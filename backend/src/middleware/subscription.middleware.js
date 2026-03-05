import Subscription from "../models/Subscription.model.js";

/**
 * Checks if user has active subscription for merchant
 */
export const requireActiveSubscription = async (req, res, next) => {
  const { merchantId } = req.params;

  if (!merchantId) {
    return res.status(400).json({ message: "Merchant ID required" });
  }

  const subscription = await Subscription.findOne({
    user: req.user._id,
    merchant: merchantId,
    status: "active",
    currentPeriodEnd: { $gt: new Date() },
  });

  if (!subscription) {
    return res.status(402).json({
      message: "Active subscription required",
    });
  }

  req.subscription = subscription; // future use
  next();
};
