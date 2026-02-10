import Merchant from "../models/Merchant.model.js";

/* =========================
   ONBOARD MERCHANT
========================= */
export const onboardMerchant = async (req, res) => {
  const { businessName, payoutWallet, webhookUrl } = req.body;

  if (!businessName || !payoutWallet) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const existing = await Merchant.findOne({ user: req.user._id });
  if (existing) {
    return res.status(409).json({ message: "Merchant already onboarded" });
  }

  const merchant = await Merchant.create({
    user: req.user._id,
    businessName,
    payoutWallet,
    webhookUrl,
    status: "active", // MVP ke liye direct active
  });

  res.status(201).json({
    message: "Merchant onboarded successfully",
    merchant: {
      id: merchant._id,
      businessName: merchant.businessName,
      apiKey: merchant.apiKey,
      status: merchant.status,
    },
  });
};

/* =========================
   GET MERCHANT PROFILE
========================= */
export const getMerchantProfile = async (req, res) => {
  const merchant = await Merchant.findOne({ user: req.user._id }).select("-apiKey");

  if (!merchant) {
    return res.status(404).json({ message: "Merchant not found" });
  }

  res.json(merchant);
};


/* =========================
   UPDATE WEBHOOK URL
========================= */
export const updateWebhook = async (req, res) => {
  const { webhookUrl } = req.body;

  if (!webhookUrl) {
    return res.status(400).json({ message: "Webhook URL required" });
  }

  const merchant = await Merchant.findOneAndUpdate(
    { user: req.user._id },
    { webhookUrl },
    { new: true }
  ).select("-apiKey");

  if (!merchant) {
    return res.status(404).json({ message: "Merchant not found" });
  }

  res.json({
    message: "Webhook updated successfully",
    merchant,
  });
};


