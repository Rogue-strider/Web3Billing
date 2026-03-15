import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import {
  onboardMerchant,
  getMerchantProfile,
} from "../controllers/merchant.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { updateWebhook } from "../controllers/merchant.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import Merchant from "../models/Merchant.model.js";
import WebhookEvent from "../models/WebhookEvent.model.js";

const router = Router();

/* =========================
   BASIC DASHBOARD (TEST)
========================= */
router.get("/dashboard", authenticate, authorize("merchant"), (req, res) => {
  res.json({
    message: "Welcome merchant 🚀",
    wallet: req.user.wallet,
  });
});

/* =========================
   MERCHANT ONBOARDING
========================= */
router.post(
  "/onboard",
  authenticate,
  authorize("merchant"),
  asyncHandler(onboardMerchant)
);

/* =========================
   MERCHANT PROFILE
========================= */
// router.get(
//   "/me",
//   authenticate,
//   authorize("merchant"),
//   asyncHandler(getMerchantProfile)
// );

// export default router;

/* =========================
   Merchant webhook URL update
========================= */

router.patch(
  "/webhook",
  authenticate,
  authorize("merchant"),
  asyncHandler(updateWebhook)
);

/* 🔥 GET CURRENT USER MERCHANT PROFILE */
router.get("/me", authenticate, authorize("merchant"), async (req, res) => {
  try {
    const merchant = await Merchant.findOne({ user: req.user._id });

    if (!merchant) {
      return res.json({ isMerchant: false });
    }

    res.json({
      isMerchant: true,
      merchant,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   MERCHANT WEBHOOK EVENTS
========================= */

router.get(
  "/webhooks",
  authenticate,
  authorize("merchant"),
  async (req, res) => {
    try {

      const merchant = await Merchant.findOne({ user: req.user._id });

      if (!merchant) {
        return res.status(404).json({ message: "Merchant not found" });
      }

      const events = await WebhookEvent.find({
        merchant: merchant._id,
      })
        .sort({ createdAt: -1 })
        .limit(50);

      res.json({
        events,
      });

    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;




