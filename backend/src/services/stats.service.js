import Subscription from "../models/Subscription.model.js";

export const getLiveStats = async () => {
  /* =========================
     ACTIVE SUBSCRIBERS
  ========================= */

  const activeSubscribers = await Subscription.countDocuments({
    status: "active",
  });

  /* =========================
     TOTAL SUBSCRIPTIONS
  ========================= */

  const totalSubscriptions = await Subscription.countDocuments();

  /* =========================
     CHURNED SUBSCRIPTIONS
  ========================= */

  const churnedSubscriptions = await Subscription.countDocuments({
    status: { $in: ["cancelled", "expired"] },
  });

  /* =========================
     REVENUE + MRR
  ========================= */

  const revenueAgg = await Subscription.aggregate([
    {
      $match: { status: "active" },
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
        totalRevenue: { $sum: "$plan.price" },
        mrr: { $sum: "$plan.price" },
      },
    },
  ]);

  const totalRevenue = revenueAgg[0]?.totalRevenue || 0;
  const mrr = revenueAgg[0]?.mrr || 0;

  /* =========================
     CHURN RATE
  ========================= */

  const churnRate =
    totalSubscriptions === 0
      ? 0
      : Number(((churnedSubscriptions / totalSubscriptions) * 100).toFixed(2));

  return {
    totalRevenue,
    activeSubscribers,
    mrr,
    churnRate,
  };
};
