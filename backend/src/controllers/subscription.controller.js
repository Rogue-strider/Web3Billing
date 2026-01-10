import Subscription from "../models/Subscription.model.js";
import Plan from "../models/Plan.model.js";
import Merchant from "../models/Merchant.model.js";
import { sendWebhook } from "../services/webhook.service.js";
import { WEBHOOK_EVENTS } from "../utils/webhookEvents.js";

/* =========================
   CREATE SUBSCRIPTION
========================= */
// export const createSubscription = async (req, res) => {
//   const { planId } = req.body;

//   if (!planId) {
//     return res.status(400).json({ message: "Plan ID required" });
//   }

//   const plan = await Plan.findById(planId);

//   if (!plan || !plan.isActive) {
//     return res.status(404).json({ message: "Plan not available" });
//   }

//   const merchant = await Merchant.findById(plan.merchant);

//   const now = new Date();
//   const periodEnd = new Date(now);

//   if (plan.interval === "monthly") {
//     periodEnd.setMonth(periodEnd.getMonth() + 1);
//   } else {
//     periodEnd.setFullYear(periodEnd.getFullYear() + 1);
//   }

//   const subscription = await Subscription.create({
//     user: req.user.userId,
//     merchant: merchant._id,
//     plan: plan._id,
//     currentPeriodStart: now,
//     currentPeriodEnd: periodEnd,
//     status: "active",              // ✅ ADD THIS
//     cancelAtPeriodEnd: false,
//     chain: plan.chain,
//   });

//   if (merchant.webhookUrl) {
//     // optional: check kar lo url exist kare
//     await sendWebhook({
//       url: merchant.webhookUrl,
//       event: WEBHOOK_EVENTS.SUBSCRIPTION_CREATED,
//       payload: {
//         subscriptionId: subscription._id,
//         planId: plan._id,
//         user: req.user.wallet, // wallet address bhej rahe ho payload mein
//         periodEnd: subscription.currentPeriodEnd,
//       },
//     });
//   }

//   res.status(201).json({
//     message: "Subscription created",
//     subscription,
//   });
// };
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

  // 🔥 STEP 1: close any existing active subscription for this plan
  await Subscription.updateMany(
    {
      user: req.user.userId,
      plan: plan._id,
      status: "active",
    },
    {
      $set: {
        status: "cancelled",
      },
    }
  );

  // 🔥 STEP 2: create fresh subscription
  const now = new Date();
  const periodEnd = new Date(now);

  if (plan.interval === "monthly") {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  } else {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  }

  const subscription = await Subscription.create({
    user: req.user.userId,
    merchant: merchant._id,
    plan: plan._id,
    currentPeriodStart: now,
    currentPeriodEnd: periodEnd,
    status: "active",
    cancelAtPeriodEnd: false, // ✅ ALWAYS reset
    chain: plan.chain,
    onChainSubscriptionId: Date.now().toString(), // temp unique
  });

  if (merchant.webhookUrl) {
    await sendWebhook({
      url: merchant.webhookUrl,
      event: WEBHOOK_EVENTS.SUBSCRIPTION_CREATED,
      payload: {
        subscriptionId: subscription._id,
        planId: plan._id,
        user: req.user.wallet,
        periodEnd: subscription.currentPeriodEnd,
      },
    });
  }

  res.status(201).json({
    message: "Subscription created",
    subscription,
  });
};


/* =========================
   MY SUBSCRIPTIONS
========================= */
export const getMySubscriptions = async (req, res) => {
  const subs = await Subscription.find({ user: req.user.userId })
    .sort({ createdAt: -1 }) // ✅ LATEST FIRST
    .populate("plan", "name price interval")
    .populate("merchant", "businessName");

  res.status(200).json({
    subscriptions: subs,
  });
};

/* =========================
   CANCEL SUBSCRIPTION
========================= */
export const cancelSubscription = async (req, res) => {
  const { subscriptionId } = req.params;

  const subscription = await Subscription.findOne({
    _id: subscriptionId,
    user: req.user.userId,
  });

  if (!subscription) {
    return res.status(404).json({ message: "Subscription not found" });
  }

  //  IMPORTANT CHECK
  if (subscription.status !== "active") {
    return res.status(400).json({
      message: `Subscription is ${subscription.status}, cannot cancel`,
    });
  }

  // ⛔ Already cancelled
  if (subscription.cancelAtPeriodEnd) {
    return res.status(400).json({
      message: "Subscription already scheduled for cancellation",
    });
  }

  subscription.cancelAtPeriodEnd = true;
  await subscription.save();

  res.json({
    message: "Subscription will cancel at period end",
  });
};
