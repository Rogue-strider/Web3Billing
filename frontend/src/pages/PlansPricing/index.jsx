import React, { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

const Pricing = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const res = await api.get("/public/plans");
        setPlans(res.data.plans || []);
      } catch {
        toast.error("Failed to load pricing plans");
      }
    };
    loadPlans();
  }, []);

  return (
    <div className="min-h-screen px-8 pt-24 text-white">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Pricing Plans
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="bg-gray-900 bg-opacity-50 border border-white border-opacity-10 rounded-xl p-6"
          >
            <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
            <p className="text-gray-400 mb-4">{plan.description}</p>

            <p className="text-3xl font-bold mb-4">
              ${plan.price}
              <span className="text-sm text-gray-400">
                {" "}/{plan.interval}
              </span>
            </p>

            <p className="text-sm text-gray-500 mb-6">
              by {plan.merchant?.businessName}
            </p>

            <button
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg"
              onClick={() => toast("Subscribe flow next 👀")}
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;