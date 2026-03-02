import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import {
  createPlan,
  deletePlan,
  getMyPlans,
  togglePlanStatus,
} from "../controllers/plan.controller.js";

const router = Router();

router.use(authenticate, authorize("merchant"));

router.post("/", createPlan);
router.get("/", getMyPlans);
router.patch("/:planId/toggle", togglePlanStatus);
router.delete("/:planId", deletePlan);

export default router;
