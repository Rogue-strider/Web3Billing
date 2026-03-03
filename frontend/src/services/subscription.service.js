import api from "./api";

export const getMySubscriptions = () => api.get("/subscriptions/me");

export const cancelSubscription = (subscriptionId) =>
  api.post(`/subscriptions/${subscriptionId}/cancel`);

export const createSubscription = (data) => api.post("/subscriptions", data);