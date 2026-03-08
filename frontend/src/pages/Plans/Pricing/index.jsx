import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { ethers } from "ethers";
import toast from "react-hot-toast";

import { useWallet } from "../../../hooks/useWallet";
import useContract from "../../../hooks/useContract";
import { contracts } from "../../../config/contracts";
import { createSubscription } from "../../../services/subscription.service";
import api from "../../../services/api";

const Pricing = () => {
  const { isConnected } = useWallet();

  // 🔗 Smart Contract (Ethereum)
  const subscriptionContract = useContract(
    contracts.ethereum.subscriptionManager.address,
    contracts.ethereum.subscriptionManager.abi,
  );

  // 🔥 BACKEND-CONNECTED PLANS (onChain ready)
  const [plans, setPlans] = useState([]);

  /* =========================
     LOAD PLANS FROM BACKEND
  ========================= */
  useEffect(() => {
    const loadPlans = async () => {
      try {
        const res = await api.get("/public/plans");

        const mapped = (res.data.plans || []).map((p,i) => ({
          ...p,
          onChainPlanId: i + 1,
          // frontend UI compatibility
          displayPrice: `$${p.price}`,
          period: `/${p.interval}`,

          // temporary ETH mapping
          priceEth: "0.01",

          // fallback
          duration: 30 * 24 * 60 * 60,
          merchantWallet: p.merchant?.payoutWallet,

          highlighted: false,

          features: [
            "Advanced analytics",
            "Webhook integration",
            "Multi-chain support",
            "API access",
          ],
        }));

        setPlans(mapped);
      } catch (err) {
        console.error("Failed to load plans", err);
        toast.error("Failed to load plans");
      }
    };

    loadPlans();
  }, []);

  // 🚀 SUBSCRIBE HANDLER
  const handleSubscribe = async (plan) => {
    if (!isConnected) {
      toast.error("Please connect MetaMask first");
      return;
    }

    if (!subscriptionContract) {
      toast.error("Contract not ready");
      return;
    }

    try {
      toast.loading("Confirming transaction...");

      const tx = await subscriptionContract.subscribe(
        plan.merchantWallet,
        plan.onChainPlanId,
        // plan.duration,
        {
          value: ethers.parseEther(plan.priceEth),
        },
      );

      await tx.wait();
      toast.dismiss();

      // 🔥 IMPORTANT PART — BACKEND CALL
      await createSubscription({
        planId: plan._id,
      });

      toast.success("Subscription successful 🎉");
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Subscription failed");
    }
  };

  return (
    <div className="min-h-screen px-6 pt-28 pb-12 text-white">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: plan.highlighted ? 0 : -10 }}
              className={`relative ${plan.highlighted ? "md:-mt-8" : ""}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-5 left-0 right-0 flex justify-center">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div
                className={`h-full rounded-2xl p-8 ${
                  plan.highlighted
                    ? "bg-gradient-to-br from-purple-600 to-pink-600 shadow-2xl"
                    : "bg-gray-900 bg-opacity-50 border border-white border-opacity-10"
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="mb-6">{plan.description}</p>

                <div className="mb-8">
                  <span className="text-5xl font-bold">
                    {plan.displayPrice}
                  </span>
                  <span>{plan.period}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex gap-3">
                      <Check size={20} className="text-green-400" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  className={`w-full py-3 rounded-lg font-semibold ${
                    plan.highlighted
                      ? "bg-white text-purple-600"
                      : "bg-purple-600 text-white"
                  }`}
                >
                  Subscribe
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
