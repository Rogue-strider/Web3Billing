import Plan from "../models/Plan.model.js";
import Merchant from "../models/Merchant.model.js";

/* =========================
   CREATE PLAN
========================= */
export const createPlan = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      currency,
      interval,
      chain,
      onChainPlanId, // ✅ ADD THIS
    } = req.body;

    if (!name || !price || !interval || !onChainPlanId) {
      return res.status(400).json({
        message: "Missing required fields (including onChainPlanId)",
      });
    }

    const merchant = await Merchant.findOne({ user: req.user.userId });

    if (!merchant) {
      return res.status(403).json({ message: "Merchant not found" });
    }

    const plan = await Plan.create({
      merchant: merchant._id,
      name,
      description,
      price,
      currency,
      interval,
      chain,
      onChainPlanId: String(onChainPlanId), // 🔥 IMPORTANT
    });

    res.status(201).json({
      message: "Plan created successfully",
      plan,
    });
  } catch (err) {
    console.error("Create plan error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   LIST MERCHANT PLANS
========================= */
export const getMyPlans = async (req, res) => {
  const merchant = await Merchant.findOne({ user: req.user.userId });

  if (!merchant) {
    return res.status(403).json({ message: "Merchant not found" });
  }

  const plans = await Plan.find({ merchant: merchant._id });

  res.json(plans);
};

/* =========================
   TOGGLE PLAN STATUS
========================= */
export const togglePlanStatus = async (req, res) => {
  const { planId } = req.params;

  const merchant = await Merchant.findOne({ user: req.user.userId });

  const plan = await Plan.findOne({
    _id: planId,
    merchant: merchant._id,
  });

  if (!plan) {
    return res.status(404).json({ message: "Plan not found" });
  }

  plan.isActive = !plan.isActive;
  await plan.save();

  res.json({
    message: "Plan status updated",
    isActive: plan.isActive,
  });
};
