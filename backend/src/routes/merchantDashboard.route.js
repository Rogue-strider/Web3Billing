import express from "express";
import Merchant from "../models/Merchant.model.js";
import Subscription from "../models/Subscription.model.js";
import Plan from "../models/Plan.model.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * GET /api/merchant/dashboard
 */
router.get("/", protect, async (req, res, next) => {
  try {
    /* =========================
       FIND MERCHANT
    ========================= */
    const merchant = await Merchant.findOne({ user: req.user._id });
    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    /* =========================
       BASIC STATS
    ========================= */
    const activeSubscribers = await Subscription.countDocuments({
      merchant: merchant._id,
      status: "active",
      cancelAtPeriodEnd: false,
    });

    const cancelledSubscribers = await Subscription.countDocuments({
      merchant: merchant._id,
      status: "cancelled",
    });

    const totalSubscribers = await Subscription.countDocuments({
      merchant: merchant._id,
    });

    /* =========================
       TOTAL REVENUE
    ========================= */
    const revenueAgg = await Subscription.aggregate([
      {
        $match: {
          merchant: merchant._id,
          status: "active",
        },
      },
      {
        $lookup: {
          from: "plans",
          localField: "plan",
          foreignField: "_id",
          as: "plan",
        },
      },
      { $unwind: "$plan" },
      {
        $group: {
          _id: null,
          total: { $sum: "$plan.price" },
        },
      },
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    /* =========================
       PLANS + PLAN WISE STATS
    ========================= */
    const plans = await Plan.find({ merchant: merchant._id });

    const planStats = await Subscription.aggregate([
      { $match: { merchant: merchant._id } },
      {
        $group: {
          _id: "$plan",
          subscribers: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "plans",
          localField: "_id",
          foreignField: "_id",
          as: "plan",
        },
      },
      { $unwind: "$plan" },
    ]);

    /* =========================
       RECENT SUBSCRIPTIONS
    ========================= */
    const recentSubscriptions = await Subscription.find({
      merchant: merchant._id,
    })
      .populate("plan", "name price")
      .populate("user", "walletAddress")
      .sort({ createdAt: -1 })
      .limit(10);

    /* =========================
       RESPONSE
    ========================= */
    res.json({
      merchant: {
        businessName: merchant.businessName,
        payoutWallet: merchant.payoutWallet,
        apiKey: merchant.apiKey,
        webhookUrl: merchant.webhookUrl,
        status: merchant.status,
      },
      stats: {
        totalRevenue,
        activeSubscribers,
        cancelledSubscribers,
        totalSubscribers,
        totalPlans: plans.length,
      },
      plans,
      planStats,
      recentSubscriptions,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
