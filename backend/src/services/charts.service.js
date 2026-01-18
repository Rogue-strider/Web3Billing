// backend/src/services/charts.service.js
import Subscription from "../models/Subscription.model.js";

export const getDashboardCharts = async () => {
  /* =========================
     MRR OVER TIME (daily)
  ========================= */
  const rawMRR = await Subscription.aggregate([
    {
      $match: {
        status: "active",
        cancelAtPeriodEnd: false,
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
        _id: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
        },
        totalMRR: { $sum: "$plan.price" },
      },
    },
    { $sort: { "_id.date": 1 } },
  ]);

  /* =========================
     ACTIVE SUBS OVER TIME
  ========================= */
  const rawActiveSubs = await Subscription.aggregate([
    {
      $match: {
        status: "active",
      },
    },
    {
      $group: {
        _id: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.date": 1 } },
  ]);

  /* =========================
     SHAPE TRANSFORMATION
  ========================= */
  const mrrOverTime = rawMRR.map((item) => ({
    date: item._id.date,
    value: item.totalMRR,
  }));

  const activeSubsOverTime = rawActiveSubs.map((item) => ({
    date: item._id.date,
    value: item.count,
  }));

  return {
    mrrOverTime,
    activeSubsOverTime,
  };
};
