import express from "express";
import Subscription from "../../models/Subscription.model.js";

const router = express.Router();

router.get("/stats", async (req, res) => {
  const merchantId = req.user.merchantId;

  const subs = await Subscription.find({
    merchant: merchantId,
    status: "active",
  });

  res.json({
    revenue: subs.reduce((a, s) => a + s.plan.price, 0),
    activeSubs: subs.length,
    mrr: subs.reduce((a, s) => a + s.plan.price, 0),
  });
});

export default router;
