import api from "./api";
import { ethers } from "ethers";

/**
 * Wallet based login
 */
export const loginWithWallet = async (provider) => {
  if (!provider) throw new Error("Provider not found");

  // 1️⃣ signer + wallet address
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  // 2️⃣ backend se nonce lo
  const nonceRes = await api.get(`/auth/nonce?wallet=${address}`);
  const { nonce } = nonceRes.data;

  // 3️⃣ wallet se sign karao
  const message = `Sign this message to login: ${nonce}`;
  const signature = await signer.signMessage(message);

  // 4️⃣ backend verify
  const verifyRes = await api.post("/auth/verify", {
    wallet: address,
    signature,
  });

  const { accessToken, refreshToken, user } = verifyRes.data;

  // 5️⃣ tokens save karo
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("user", JSON.stringify(user));

  return user;
};

/**
 * Logout
 */
export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    // ignore
  }

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};
