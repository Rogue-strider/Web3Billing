import { subscriptionContract } from "./contract.js";
import Subscription from "../../models/Subscription.model.js";
import Plan from "../../models/Plan.model.js";
import User from "../../models/User.model.js";
import Merchant from "../../models/Merchant.model.js";

export const startEthereumListeners = () => {
  console.log("👂 Listening to Ethereum events...");

  // safety: duplicate listeners remove
  subscriptionContract.removeAllListeners();

  /* ===============================
     SUBSCRIBED EVENT
     (Create OR Reactivate subscription)
  =============================== */
  subscriptionContract.on(
    "Subscribed",
    async (
      subscriptionId,
      userWallet,
      merchantWallet,
      planId,
      startTime,
      endTime,
      event
    ) => {
      try {
        console.log(
          "🟢 Subscribed EVENT:",
          subscriptionId.toString(),
          event.log.transactionHash
        );

        const user = await User.findOne({
          walletAddress: userWallet.toLowerCase(),
        });
        if (!user) return console.error("User not found");

        const merchant = await Merchant.findOne({
          payoutWallet: merchantWallet.toLowerCase(),
        });
        if (!merchant) return console.error("Merchant not found");

        const plan = await Plan.findOne({
          onChainPlanId: planId.toString(),
        });
        if (!plan) return console.error("Plan not found");

        /**
         * 🔑 CORE FIX
         * onChainSubscriptionId UNIQUE hota hai
         * isliye CREATE nahi, UPSERT karna hai
         */
        await Subscription.findOneAndUpdate(
          { onChainSubscriptionId: subscriptionId.toString() },
          {
            user: user._id,
            merchant: merchant._id,
            plan: plan._id,
            status: "active",
            cancelAtPeriodEnd: false,
            currentPeriodStart: new Date(Number(startTime) * 1000),
            currentPeriodEnd: new Date(Number(endTime) * 1000),
            chain: "ethereum",
          },
          {
            upsert: true,
            new: true,
          }
        );

        console.log("✅ Subscription upserted (active)");
      } catch (err) {
        console.error("❌ Subscribed listener error:", err.message);
      }
    }
  );

  /* ===============================
     CANCELLED EVENT
     (Mark subscription cancelled)
  =============================== */
  subscriptionContract.on(
    "SubscriptionCancelled",
    async (subscriptionId, user, event) => {
      try {
        console.log(
          "🔴 Subscription cancelled:",
          subscriptionId.toString(),
          "tx:",
          event.log.transactionHash
        );

        await Subscription.findOneAndUpdate(
          { onChainSubscriptionId: subscriptionId.toString() },
          {
            status: "cancelled",
            cancelAtPeriodEnd: true,
          }
        );

        console.log("✅ Subscription marked cancelled");
      } catch (err) {
        console.error("❌ Cancel listener error:", err.message);
      }
    }
  );
};
