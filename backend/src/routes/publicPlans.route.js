import { Router } from "express";
import { getPublicPlans } from "../controllers/publicPlans.controller.js";

const router = Router();

router.get("/plans", getPublicPlans);

export default router;
