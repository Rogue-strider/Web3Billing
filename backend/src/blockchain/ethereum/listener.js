import { subscriptionContract } from "./contract.js";
import Subscription from "../../models/Subscription.model.js";
import Plan from "../../models/Plan.model.js";
import User from "../../models/User.model.js";
import Merchant from "../../models/Merchant.model.js";

export const startEthereumListeners = () => {
  console.log("👂 Listening to Ethereum events...");

  subscriptionContract.removeAllListeners();

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
        if (!user) return console.error("❌ User not found");

        const merchant = await Merchant.findOne({
          payoutWallet: merchantWallet.toLowerCase(),
        });
        if (!merchant) return console.error("❌ Merchant not found");

        const plan = await Plan.findOne({
          onChainPlanId: planId.toString(),
        });
        if (!plan) return console.error("❌ Plan not found");

        // 🔥 STEP 1: purane active subscriptions band karo
        await Subscription.updateMany(
          {
            user: user._id,
            plan: plan._id,
            status: "active",
          },
          {
            $set: { status: "cancelled" },
          }
        );

        // 🔥 STEP 2: hamesha NAYA subscription banao
        await Subscription.create({
          user: user._id,
          merchant: merchant._id,
          plan: plan._id,
          status: "active",
          cancelAtPeriodEnd: false, // ✅ RESET
          currentPeriodStart: new Date(Number(startTime) * 1000),
          currentPeriodEnd: new Date(Number(endTime) * 1000),
          chain: "ethereum",
          onChainSubscriptionId: subscriptionId.toString(),
        });

        console.log("✅ New subscription created");
      } catch (err) {
        console.error("❌ Subscribed listener error:", err);
      }
    }
  );



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
          { status: "cancelled" }
        );
      } catch (err) {
        console.error("❌ Cancel listener error:", err);
      }
    }
  );
};
