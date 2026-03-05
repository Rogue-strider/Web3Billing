import Plan from "../models/Plan.model.js"; // 🔥 UNCOMMENT THIS
import Merchant from "../models/Merchant.model.js";
import Subscription from "../models/Subscription.model.js";

/* =========================
   CREATE PLAN
========================= */
export const createPlan = async (req, res) => {
  try {
    const { name, description, price, interval, chain, currency } = req.body;

    if (!name || !price || !interval || !chain || !currency) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const merchant = await Merchant.findOne({ user: req.user._id });
    if (!merchant) {
      return res.status(403).json({ message: "Merchant not found" });
    }

    const onChainPlanId = Date.now();

    const plan = await Plan.create({
      merchant: merchant._id,
      name,
      description,
      price,
      interval,
      chain,
      currency,
      onChainPlanId, 
      isActive: true,
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
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6; // per page
    const skip = (page - 1) * limit;
    const merchant = await Merchant.findOne({ user: req.user._id });
    if (!merchant) {
      return res.status(403).json({ message: "Merchant not found" });
    }

    const totalPlans = await Plan.countDocuments({
      merchant: merchant._id,
    });

    const plans = await Plan.find({ merchant: merchant._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      plans,
      pagination: {
        totalPlans,
        totalPages: Math.ceil(totalPlans / limit),
        currentPage: page,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
