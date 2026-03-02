import Plan from "../models/Plan.model.js"; // 🔥 UNCOMMENT THIS
import Merchant from "../models/Merchant.model.js";
import Subscription from "../models/Subscription.model.js";

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
      onChainPlanId,
    } = req.body;

    if (!name || !price || !interval || !onChainPlanId) {
      return res.status(400).json({
        message: "Missing required fields (including onChainPlanId)",
      });
    }

    const merchant = await Merchant.findOne({ user: req.user._id });

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
      onChainPlanId: String(onChainPlanId),
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
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  const merchant = await Merchant.findOne({ user: req.user._id });
  if (!merchant) {
    return res.status(403).json({ message: "Merchant not found" });
  }

  const [plans, total] = await Promise.all([
    Plan.find({ merchant: merchant._id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),

    Plan.countDocuments({ merchant: merchant._id }),
  ]);

  res.json({
    plans,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    },
  });
};

/* =========================
   TOGGLE PLAN STATUS
========================= */
export const togglePlanStatus = async (req, res) => {
  const { planId } = req.params;

  const merchant = await Merchant.findOne({ user: req.user._id });

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
    plan,
  });
};

/* =========================
   DELETE PLAN
========================= */
export const deletePlan = async (req, res) => {
  const { planId } = req.params;

  const merchant = await Merchant.findOne({ user: req.user._id });
  if (!merchant) {
    return res.status(403).json({ message: "Merchant not found" });
  }

  const plan = await Plan.findOne({
    _id: planId,
    merchant: merchant._id,
  });

  if (!plan) {
    return res.status(404).json({ message: "Plan not found" });
  }

  // ❌ Check active subscriptions
  const activeSubs = await Subscription.countDocuments({
    plan: plan._id,
    status: "active",
  });

  if (activeSubs > 0) {
    return res.status(400).json({
      message: "Cannot delete plan with active subscriptions",
    });
  }

  await plan.deleteOne();

  res.json({ message: "Plan deleted successfully" });
};
