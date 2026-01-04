import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import {
  createPlan,
  getMyPlans,
  togglePlanStatus,
} from "../controllers/plan.controller.js";

const router = Router();

router.use(authenticate, authorize("merchant"));

router.post("/", createPlan);
router.get("/", getMyPlans);
router.patch("/:planId/toggle", togglePlanStatus);

export default router;
