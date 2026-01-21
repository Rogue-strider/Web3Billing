import { subscriptionContract } from "./contract.js";
import Subscription from "../../models/Subscription.model.js";
import Plan from "../../models/Plan.model.js";
import User from "../../models/User.model.js";
import Merchant from "../../models/Merchant.model.js";
import { io } from "../../server.js";
import { getLiveStats } from "../../services/stats.service.js";
import { getDashboardCharts } from "../../services/charts.service.js";

export const startEthereumListeners = () => {
  console.log("👂 Listening to Ethereum events...");

  subscriptionContract.removeAllListeners();

  /* ===== SUBSCRIBED ===== */
  subscriptionContract.on(
    "Subscribed",
    async (
      subscriptionId,
      userWallet,
      merchantWallet,
      planId,
      startTime,
      endTime
    ) => {
      try {
        console.log("🟢 Subscribed:", subscriptionId.toString());

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

        /**
         * 🔥 MOST IMPORTANT FIX
         * SAME onChainSubscriptionId → UPSERT
         */
        const subscription = await Subscription.findOneAndUpdate(
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
        
        io.to(user.walletAddress.toLowerCase()).emit("subscription:created", {
          subscription,
        });
        
        const charts = await getDashboardCharts("30d");
        io.emit("charts:update", charts);
        /* ===== GLOBAL STATS UPDATE ===== */
        const stats = await getLiveStats();
        io.emit("stats:update", stats);

        

        console.log("✅ Subscription upserted safely");
      } catch (err) {
        console.error("❌ Subscribed error:", err.message);
      }
    }
    
  );

  /* ===== CANCELLED ===== */
  subscriptionContract.on("SubscriptionCancelled", async (subscriptionId) => {
    try {
      const subscription = await Subscription.findOneAndUpdate(
        { onChainSubscriptionId: subscriptionId.toString() },
        {
          status: "cancelled",
          cancelAtPeriodEnd: true,
        },
        { new: true }
      );

      if (!subscription) return;

      io.to(subscription.user.toString()).emit("subscription:cancelled", {
        subscription,
      });
      const charts = await getDashboardCharts();
      io.emit("charts:update", charts);

      const stats = await getLiveStats();
      io.emit("stats:update", stats);

      console.log("🔴 Subscription cancelled + socket emitted");
    } catch (err) {
      console.error("❌ Cancel error:", err.message);
    }
  });
};
