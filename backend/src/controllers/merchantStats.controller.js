import Subscription from "../models/Subscription.model.js";
import Plan from "../models/Plan.model.js";
import Merchant from "../models/Merchant.model.js";

export const getMerchantStats = async (req, res) => {
  try {
    const merchant = await Merchant.findOne({ user: req.user._id });

    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    const subs = await Subscription.find({
      merchant: merchant._id,
    }).populate("plan");

    const activeSubs = subs.filter(
      (s) => s.status === "active" && !s.cancelAtPeriodEnd,
    );

    const totalRevenue = subs.reduce((sum, s) => sum + (s.plan?.price || 0), 0);

    const mrr = activeSubs.reduce((sum, s) => sum + (s.plan?.price || 0), 0);

    const churnRate =
      subs.length === 0
        ? 0
        : (
            (subs.filter((s) => s.status === "cancelled").length /
              subs.length) *
            100
          ).toFixed(2);

    res.json({
      totalRevenue,
      activeSubscribers: activeSubs.length,
      mrr,
      churnRate,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
