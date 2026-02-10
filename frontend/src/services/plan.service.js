import api from "./api";

/* ===============================
   GET MY MERCHANT PLANS
=============================== */
export const getMyPlans = () => {
  return api.get("/plans"); // ✅ FIXED
};

/* ===============================
   TOGGLE PLAN STATUS
=============================== */
export const togglePlanStatus = (planId) => {
  return api.patch(`/plans/${planId}/toggle`); // ✅ FIXED
};
