import api from "./api";

/* ===============================
   GET MY MERCHANT PLANS
=============================== */
export const getMyPlans = () => {
  return api.get("/plans");
};

/* ===============================
   TOGGLE PLAN STATUS
=============================== */
export const togglePlanStatus = (planId) => {
  return api.patch(`/plans/${planId}/toggle`);
};

/* ===============================
   DELETE PLAN (NEXT STEP)
=============================== */
export const deletePlan = (planId) => {
  return api.delete(`/plans/${planId}`);
};