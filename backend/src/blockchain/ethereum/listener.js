import { subscriptionContract } from "./contract.js";
import Subscription from "../../models/Subscription.model.js";
import Plan from "../../models/Plan.model.js";
import User from "../../models/User.model.js";
import Merchant from "../../models/Merchant.model.js";
import { io } from "../../server.js";
import { getLiveStats } from "../../services/stats.service.js";
import { getDashboardCharts } from "../../services/charts.service.js";

/* =========================
   🔥 MERCHANT STATS HELPER
========================= */
const getMerchantStats = async (merchantId) => {
  const subs = await Subscription.find({
    merchant: merchantId,
    status: "active",
    cancelAtPeriodEnd: false,
  }).populate("plan");

  const activeSubs = subs.length;

  const mrr = subs.reduce((sum, s) => sum + (s.plan?.price || 0), 0);

  const allSubs = await Subscription.find({
    merchant: merchantId,
  }).populate("plan");

  const revenue = allSubs.reduce((sum, s) => sum + (s.plan?.price || 0), 0);

  return { revenue, activeSubs, mrr };
};

/* =========================
   🚀 START ETH LISTENERS
========================= */
export const startEthereumListeners = () => {
  console.log("👂 Listening to Ethereum events...");

  subscriptionContract.removeAllListeners();

  /* =========================
     🟢 SUBSCRIBED EVENT
  ========================= */
  subscriptionContract.on(
    "Subscribed",
    async (
      subscriptionId,
      userWallet,
      merchantWallet,
      planId,
      startTime,
      endTime,
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

        /* 🔥 Expire old active subscription of same plan */
        await Subscription.updateMany(
          {
            user: user._id,
            plan: plan._id,
            status: "active",
          },
          { status: "expired" },
        );

        /* ✅ Create new subscription */
        const subscription = await Subscription.create({
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

        /* 🔥 USER ROOM (wallet based) */
        io.to(user.walletAddress.toLowerCase()).emit("subscription:created", {
          subscription,
        });

        /* 🔥 UPDATE GLOBAL STATS */
        const stats = await getLiveStats();
        io.emit("stats:update", stats);

        /* 🔥 UPDATE CHARTS */
        const charts = await getDashboardCharts("30d");
        io.emit("charts:update", charts);

        /* 🔥 UPDATE MERCHANT DASHBOARD */
        const merchantStats = await getMerchantStats(merchant._id);

        io.to(merchant._id.toString()).emit(
          "merchant:stats:update",
          merchantStats,
        );

        console.log("✅ Subscription created cleanly");
      } catch (err) {
        console.error("❌ Subscribed error:", err.message);
      }
    },
  );

  /* =========================
     🔴 CANCELLED EVENT
  ========================= */
  subscriptionContract.on("SubscriptionCancelled", async (subscriptionId) => {
    try {
      const subscription = await Subscription.findOneAndUpdate(
        {
          onChainSubscriptionId: subscriptionId.toString(),
          status: "active",
        },
        {
          status: "cancelled",
          cancelAtPeriodEnd: true,
        },
        { new: true },
      );

      if (!subscription) return;

      const user = await User.findById(subscription.user);
      const merchant = await Merchant.findById(subscription.merchant);

      /* 🔥 USER UPDATE */
      io.to(user.walletAddress.toLowerCase()).emit("subscription:cancelled", {
        subscription,
      });

      /* 🔥 UPDATE GLOBAL STATS */
      const stats = await getLiveStats();
      io.emit("stats:update", stats);

      /* 🔥 UPDATE CHARTS */
      const charts = await getDashboardCharts("30d");
      io.emit("charts:update", charts);

      /* 🔥 UPDATE MERCHANT DASHBOARD */
      const merchantStats = await getMerchantStats(merchant._id);

      io.to(merchant._id.toString()).emit(
        "merchant:stats:update",
        merchantStats,
      );

      console.log("🔴 Subscription cancelled cleanly");
    } catch (err) {
      console.error("❌ Cancel error:", err.message);
    }
  });
};
