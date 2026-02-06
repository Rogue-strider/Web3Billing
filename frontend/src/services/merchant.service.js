import api from "./api";

export const getMyMerchantProfile = async () => {
  return api.get("/merchant/me");
};
