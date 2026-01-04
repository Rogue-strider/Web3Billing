import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  createSubscription,
  getMySubscriptions,
  cancelSubscription,
} from "../controllers/subscription.controller.js";

const router = Router();

router.use(authenticate);

router.post("/", createSubscription);
router.get("/me", getMySubscriptions);
router.post("/:subscriptionId/cancel", cancelSubscription);

export default router;
