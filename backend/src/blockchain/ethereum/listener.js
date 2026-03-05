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
        const subId = subscriptionId.toString();

        console.log("🟢 Subscribed event:", subId);

        /* 🔒 DUPLICATE PROTECTION */
        const existing = await Subscription.findOne({
          onChainSubscriptionId: subId,
        });

        if (existing) {
          console.log("⚠️ Subscription already synced");
          return;
        }

        const user = await User.findOne({
          walletAddress: userWallet.toLowerCase(),
        });

        if (!user) {
          console.log("User not found:", userWallet);
          return;
        }

        const merchant = await Merchant.findOne({
          payoutWallet: merchantWallet.toLowerCase(),
        });

        if (!merchant) {
          console.log("Merchant not found:", merchantWallet);
          return;
        }

        const plan = await Plan.findOne({
          onChainPlanId: planId.toString(),
        });

        if (!plan) {
          console.log("Plan not found:", planId.toString());
          return;
        }
        if (plan.chain !== "ethereum") {
          console.log("Skipping non-ethereum plan:", plan.chain);
          return;
        }

        /* 🔥 Expire old active subscription of same plan */
        await Subscription.updateMany(
          {
            user: user._id,
            plan: plan._id,
            status: "active",
          },
          {
            $set: {
              status: "expired",
              cancelAtPeriodEnd: false,
            },
          },
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
          onChainSubscriptionId: subId,
        });

        /* 🔥 USER ROOM UPDATE */
        io.to(user.walletAddress.toLowerCase()).emit("subscription:created", {
          subscription,
        });

        /* 🔥 GLOBAL STATS */
        const stats = await getLiveStats();
        io.emit("stats:update", stats);

        /* 🔥 CHARTS UPDATE */
        const charts = await getDashboardCharts("30d");
        io.emit("charts:update", charts);

        /* 🔥 MERCHANT DASHBOARD UPDATE */
        const merchantStats = await getMerchantStats(merchant._id);

        io.to(merchant.payoutWallet.toLowerCase()).emit(
          "merchant:stats:update",
          merchantStats,
        );

        console.log("✅ Subscription synced from blockchain");
      } catch (err) {
        console.error("❌ Subscribed listener error:", err.message);
      }
    },
  );

  /* =========================
     🔴 CANCELLED EVENT
  ========================= */
  subscriptionContract.on("SubscriptionCancelled", async (subscriptionId) => {
    try {
      const subId = subscriptionId.toString();

      const subscription = await Subscription.findOneAndUpdate(
        {
          onChainSubscriptionId: subId,
          status: "active",
        },
        {
          status: "cancelled",
          cancelAtPeriodEnd: false,
        },
        { new: true },
      );

      if (!subscription) {
        console.log("Subscription not found for cancel:", subId);
        return;
      }

      const user = await User.findById(subscription.user);
      const merchant = await Merchant.findById(subscription.merchant);

      /* 🔥 USER UPDATE */
      io.to(user.walletAddress.toLowerCase()).emit("subscription:cancelled", {
        subscription,
      });

      /* 🔥 GLOBAL STATS */
      const stats = await getLiveStats();
      io.emit("stats:update", stats);

      /* 🔥 CHARTS UPDATE */
      const charts = await getDashboardCharts("30d");
      io.emit("charts:update", charts);

      /* 🔥 MERCHANT DASHBOARD UPDATE */
      const merchantStats = await getMerchantStats(merchant._id);

      io.to(merchant.payoutWallet.toLowerCase()).emit(
        "merchant:stats:update",
        merchantStats,
      );

      console.log("🔴 Subscription cancelled synced");
    } catch (err) {
      console.error("❌ Cancel listener error:", err.message);
    }
  });
};
