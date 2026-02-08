import api from "./api";

export const getMyPlans = () => {
  return api.get("/plans");
};

export const togglePlanStatus = (planId) => {
  return api.patch(`/plans/${planId}/toggle`);
};
