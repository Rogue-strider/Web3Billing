import Plan from "../models/Plan.model.js";
import Merchant from "../models/Merchant.model.js";

export const getPublicPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true })
      .populate("merchant", "businessName payoutWallet")
      .sort({ createdAt: -1 });

    res.json({ plans });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
