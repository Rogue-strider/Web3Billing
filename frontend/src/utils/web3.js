import { ethers } from "ethers";

// Get provider
export const getProvider = () => {
  if (window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  throw new Error("No Web3 provider found");
};

// Get signer
export const getSigner = async () => {
  const provider = getProvider();
  return await provider.getSigner();
};

// Get network
export const getNetwork = async () => {
  const provider = getProvider();
  return await provider.getNetwork();
};

// Switch network
export const switchNetwork = async (chainId) => {
  const chainIdHex = `0x${chainId.toString(16)}`;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
  } catch (error) {
    if (error.code === 4902) {
      throw new Error("Network not added to wallet");
    }
    throw error;
  }
};

// Parse error message
export const parseError = (error) => {
  if (error.reason) return error.reason;
  if (error.data?.message) return error.data.message;
  if (error.message) return error.message;
  return "Transaction failed";
};

// Wait for transaction
export const waitForTransaction = async (txHash) => {
  const provider = getProvider();
  return await provider.waitForTransaction(txHash);
};
