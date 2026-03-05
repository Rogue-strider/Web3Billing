import Subscription from "../models/Subscription.model.js";
import Plan from "../models/Plan.model.js";
import Merchant from "../models/Merchant.model.js";
import { sendWebhook } from "../services/webhook.service.js";
import { WEBHOOK_EVENTS } from "../utils/webhookEvents.js";

/* =====================================================
   CREATE SUBSCRIPTION
===================================================== */
export const createSubscription = async (req, res) => {
  const { planId } = req.body;

  if (!planId) {
    return res.status(400).json({ message: "Plan ID required" });
  }

  const plan = await Plan.findById(planId);
  if (!plan || !plan.isActive) {
    return res.status(404).json({ message: "Plan not available" });
  }

  const merchant = await Merchant.findById(plan.merchant);

  /* ======================================
     STEP 1: HARD CLOSE ALL OLD SUBSCRIPTIONS
  ====================================== */
  await Subscription.updateMany(
    {
      user: req.user._id,
      plan: plan._id, 
      status: "active",
    },
    {
      $set: {
        status: "expired",
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
      },
    },
  );

  /* ======================================
     STEP 2: CREATE BRAND NEW SUBSCRIPTION
  ====================================== */
  const now = new Date();
  const periodEnd = new Date(now);

  if (plan.interval === "monthly") {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  } else {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  }

  const subscription = await Subscription.create({
    user: req.user._id,
    merchant: merchant._id,
    plan: plan._id,
    currentPeriodStart: now,
    currentPeriodEnd: periodEnd,
    status: "active",
    cancelAtPeriodEnd: false, // 🔥 MUST BE FALSE
    chain: plan.chain,
    onChainSubscriptionId: Date.now().toString(),
  });

  res.status(201).json({
    message: "Subscription created",
    subscription,
  });
};


/* =====================================================
   GET MY SUBSCRIPTIONS
===================================================== */
export const getMySubscriptions = async (req, res) => {
  try {
    const now = new Date();

    const subs = await Subscription.find({
      user: req.user._id,
      currentPeriodEnd: { $gt: now }, 
      status: "active",
    })
      .sort({ createdAt: -1 })
      .populate("plan", "name price interval")
      .populate("merchant", "businessName");

    res.status(200).json({
      subscriptions: subs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   CANCEL SUBSCRIPTION
===================================================== */
export const cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      user: req.user._id,
    });

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (subscription.status !== "active") {
      return res.status(400).json({
        message: `Subscription is ${subscription.status}, cannot cancel`,
      });
    }

    if (subscription.cancelAtPeriodEnd) {
      return res.status(400).json({
        message: "Already scheduled for cancellation",
      });
    }

    subscription.cancelAtPeriodEnd = true;
    await subscription.save();

    res.json({
      message: "Subscription will cancel at period end",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
