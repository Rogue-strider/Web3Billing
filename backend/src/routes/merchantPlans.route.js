import express from "express";
import Plan from "../models/Plan.model.js";
import Merchant from "../models/Merchant.model.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/* ===============================
   GET ALL PLANS OF MERCHANT
================================ */
router.get("/", protect, async (req, res) => {
  try {
    const merchant = await Merchant.findOne({ user: req.user._id });

    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    const plans = await Plan.find({ merchant: merchant._id });

    res.json({ plans });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   CREATE NEW PLAN
================================ */
router.post("/", protect, async (req, res) => {
  try {
    const { name, description, price, interval } = req.body;

    const merchant = await Merchant.findOne({ user: req.user._id });

    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    const plan = await Plan.create({
      merchant: merchant._id,
      name,
      description,
      price,
      interval,
      onChainPlanId: Date.now().toString(), // temp until blockchain sync
    });

    res.status(201).json({ plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   TOGGLE PLAN ACTIVE STATUS
================================ */
router.patch("/:id/toggle", protect, async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    plan.isActive = !plan.isActive;
    await plan.save();

    res.json({ plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
