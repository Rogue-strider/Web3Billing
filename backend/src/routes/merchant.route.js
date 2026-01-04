import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import {
  onboardMerchant,
  getMerchantProfile,
} from "../controllers/merchant.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { updateWebhook } from "../controllers/merchant.controller.js";

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
router.get(
  "/me",
  authenticate,
  authorize("merchant"),
  asyncHandler(getMerchantProfile)
);

export default router;

/* =========================
   Merchant webhook URL update
========================= */

router.patch(
  "/webhook",
  authenticate,
  authorize("merchant"),
  asyncHandler(updateWebhook)
);