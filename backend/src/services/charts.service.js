// backend/src/services/charts.service.js
import Subscription from "../models/Subscription.model.js";

export const getDashboardCharts = async (range = "30d") => {
  let days = 30;
  if (range === "7d") days = 7;
  if (range === "90d") days = 90;
  if (range === "all") days = 3650;

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);
  /* =========================
     MRR OVER TIME (daily)
  ========================= */

  const rawMRR = await Subscription.aggregate([
    {
      $match: {
        status: "active",
        cancelAtPeriodEnd: false,
        currentPeriodStart: { $gte: fromDate },
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
              date: "$currentPeriodStart",
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
              date: "$currentPeriodStart",
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
