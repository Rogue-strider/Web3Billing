import { subscriptionContract } from "./contract.js";
import Subscription from "../../models/Subscription.model.js";
import Plan from "../../models/Plan.model.js";
import User from "../../models/User.model.js";
import Merchant from "../../models/Merchant.model.js";

export const startEthereumListeners = () => {
  console.log("👂 Listening to Ethereum events...");

  subscriptionContract.removeAllListeners();

  /* ===============================
     SUBSCRIBED EVENT
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
        console.log("🟢 Subscribed EVENT:", subscriptionId.toString());

        const user = await User.findOne({
          walletAddress: userWallet.toLowerCase(),
        });
        if (!user) return;

        const merchant = await Merchant.findOne({
          payoutWallet: merchantWallet.toLowerCase(),
        });
        if (!merchant) return;

        const plan = await Plan.findOne({
          onChainPlanId: planId.toString(),
        });
        if (!plan) return;

        // 🔥 STEP 1: user ke saare ACTIVE subs ko expire karo
        await Subscription.updateMany(
          {
            user: user._id,
            plan: plan._id,
            status: "active",
          },
          {
            $set: { status: "expired" },
          }
        );

        // 🔥 STEP 2: NAYA subscription record (history safe)
        await Subscription.create({
          user: user._id,
          merchant: merchant._id,
          plan: plan._id,
          status: "active",
          cancelAtPeriodEnd: false,
          currentPeriodStart: new Date(Number(startTime) * 1000),
          currentPeriodEnd: new Date(Number(endTime) * 1000),
          chain: "ethereum",
          onChainSubscriptionId: subscriptionId.toString(),
        });

        console.log("✅ New subscription created (history preserved)");
      } catch (err) {
        console.error("❌ Subscribed listener error:", err.message);
      }
    }
  );


  /* ===============================
     CANCELLED EVENT
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
        console.error("❌ Cancel listener error:", err);
      }
    }
  );
};
