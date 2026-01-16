import Subscription from "../models/Subscription.model.js";
import mongoose from "mongoose";

export const getLiveStats = async () => {
  /* =========================
     ACTIVE SUBSCRIBERS
     (sirf truly active)
  ========================= */
  const activeSubscribers = await Subscription.countDocuments({
    status: "active",
    cancelAtPeriodEnd: false,
  });

  /* =========================
     MRR (Monthly Recurring Revenue)
     only active + non-cancelling
  ========================= */
  const mrrAgg = await Subscription.aggregate([
    {
      $match: {
        status: "active",
        cancelAtPeriodEnd: false,
      },
    },
    {
      $lookup: {
        from: "plans", // Plan collection
        localField: "plan",
        foreignField: "_id",
        as: "plan",
      },
    },
    { $unwind: "$plan" },
    {
      $group: {
        _id: null,
        totalMRR: { $sum: "$plan.price" },
      },
    },
  ]);

  const mrr = mrrAgg[0]?.totalMRR || 0;

  /* =========================
     TOTAL SUBSCRIPTIONS (ever)
  ========================= */
  const totalSubscriptions = await Subscription.countDocuments();

  /* =========================
     CHURNED SUBSCRIPTIONS
     (cancelled OR expired)
  ========================= */
  const churnedSubscriptions = await Subscription.countDocuments({
    status: { $in: ["cancelled", "expired"] },
  });

  const churnRate =
    totalSubscriptions === 0
      ? 0
      : Number(((churnedSubscriptions / totalSubscriptions) * 100).toFixed(2));

  return {
    activeSubscribers,
    mrr,
    churnRate,
  };
};
