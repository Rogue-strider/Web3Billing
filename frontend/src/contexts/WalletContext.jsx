// import React, { createContext, useState, useEffect } from "react";
// import { ethers } from "ethers";
// import toast from "react-hot-toast";
// import { loginWithWallet } from "../services/auth.service";

// export const WalletContext = createContext();

// export const WalletProvider = ({ children }) => {
//   const [account, setAccount] = useState(null);
//   const [provider, setProvider] = useState(null);
//   const [signer, setSigner] = useState(null);
//   const [chainId, setChainId] = useState(null);
//   const [authReady, setAuthReady] = useState(false);

//   /* =======================
//       AUTO CONNECT (HERE)
//   ======================= */
//   const autoConnect = async () => {
//     if (!window.ethereum) return;

//     const token = localStorage.getItem("token");
//     if (!token) return; // 🔥 IMPORTANT

//     try {
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const accounts = await provider.listAccounts();
//       if (!accounts.length) return;

//       const signer = await provider.getSigner();
//       const network = await provider.getNetwork();

//       setProvider(provider);
//       setSigner(signer);
//       setAccount(accounts[0].address);
//       setChainId(Number(network.chainId));

//       setAuthReady(true); // ❌ loginWithWallet yahan mat bulao
//     } catch (err) {
//       console.error("Auto connect failed:", err);
//     }
//   };

//   /* =======================
//       RUN ON APP LOAD
//   ======================= */
//   useEffect(() => {
//     autoConnect();
//   }, []);

//   /* =======================
//       MANUAL CONNECT
//   ======================= */
//   const connectEthereumWallet = async () => {
//     if (!window.ethereum) {
//       toast.error("Please install MetaMask");
//       return;
//     }

//     // 1️⃣ WALLET CONNECT (NEVER FAILS IF METAMASK OK)
//     const provider = new ethers.BrowserProvider(window.ethereum);
//     await window.ethereum.request({ method: "eth_requestAccounts" });

//     const signer = await provider.getSigner();
//     const network = await provider.getNetwork();
//     const address = await signer.getAddress();

//     setProvider(provider);
//     setSigner(signer);
//     setAccount(address);
//     setChainId(Number(network.chainId));

//     toast.success("Wallet connected"); // ✅ ALWAYS TRUE HERE

//     // 2️⃣ BACKEND AUTH (SEPARATE TRY/CATCH)
//     try {
//       await loginWithWallet(provider);
//       setAuthReady(true);
//     } catch (err) {
//       console.error("Backend auth failed:", err);
//       toast.error("Login failed. Please reconnect wallet.");
//     }
//   };

//   /* =======================
//       DISCONNECT
//   ======================= */
//   const disconnect = () => {
//     localStorage.clear();
//     setAccount(null);
//     setAuthReady(false);
//     toast.success("Disconnected");
//   };

//   return (
//     <WalletContext.Provider
//       value={{
//         account,
//         provider,
//         signer,
//         chainId,
//         isConnected: !!account,
//         authReady,
//         connectEthereumWallet,
//         disconnect,
//       }}
//     >
//       {children}
//     </WalletContext.Provider>
//   );
// };

import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { loginWithWallet } from "../services/auth.service";
import api from "../services/api"; // ✅ ADD THIS

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  /* =======================
      AUTO CONNECT (FIXED)
  ======================= */
  // const autoConnect = async () => {
  //   if (!window.ethereum) return;

  //   const token = localStorage.getItem("token");
  //   if (!token) return;

  //   try {
  //     // 🔥 TOKEN VALIDATION (MAIN FIX)
  //     await api.get("/auth/me");

  //     const provider = new ethers.BrowserProvider(window.ethereum);
  //     const accounts = await provider.listAccounts();
  //     if (!accounts.length) return;

  //     const signer = await provider.getSigner();
  //     const network = await provider.getNetwork();

  //     setProvider(provider);
  //     setSigner(signer);
  //     setAccount(accounts[0].address);
  //     setChainId(Number(network.chainId));
  //     setAuthReady(true);
  //   } catch (err) {
  //     console.warn("Token expired → logging out");
  //     localStorage.clear();
  //     setAuthReady(false);
  //   }
  // };

  // const autoConnect = async () => {
  //   if (!window.ethereum) return;

  //   const token = localStorage.getItem("token");
  //   if (!token) return;

  //   try {
  //     // 🔥 token validation
  //     await api.get("/auth/me");

  //     const provider = new ethers.BrowserProvider(window.ethereum);
  //     const accounts = await provider.listAccounts();
  //     if (!accounts.length) return;

  //     const signer = await provider.getSigner();
  //     const network = await provider.getNetwork();

  //     setProvider(provider);
  //     setSigner(signer);
  //     setAccount(accounts[0].address);
  //     setChainId(Number(network.chainId));
  //     setAuthReady(true);
  //   } catch (err) {
  //     // 🔥 THIS IS THE IMPORTANT PART
  //     console.warn("Token expired or invalid → logout");
  //     localStorage.clear();
  //     setAuthReady(false);
  //     setAccount(null);
  //   }
  // };

  const autoConnect = async () => {
  if (!window.ethereum) return;

  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    // 🔥 TOKEN VALIDATION (MOST IMPORTANT)
    const res = await api.get("/auth/me");

    if (!res.data?.success) throw new Error("Invalid token");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.listAccounts();
    if (!accounts.length) return;

    const signer = await provider.getSigner();
    const network = await provider.getNetwork();

    setProvider(provider);
    setSigner(signer);
    setAccount(accounts[0].address);
    setChainId(Number(network.chainId));
    setAuthReady(true);
  } catch (err) {
    console.warn("Token invalid or expired → logout");
    localStorage.clear();
    setAccount(null);
    setAuthReady(false);
  }
};


  useEffect(() => {
    autoConnect();
  }, []);

  /* =======================
      MANUAL CONNECT
  ======================= */
  const connectEthereumWallet = async () => {
    if (!window.ethereum) {
      toast.error("Please install MetaMask");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const signer = await provider.getSigner();
    const network = await provider.getNetwork();
    const address = await signer.getAddress();

    setProvider(provider);
    setSigner(signer);
    setAccount(address);
    setChainId(Number(network.chainId));

    toast.success("Wallet connected");

    try {
      await loginWithWallet(provider);
      setAuthReady(true);
    } catch (err) {
      console.error("Backend auth failed:", err);
      toast.error("Login failed. Please reconnect wallet.");
    }
  };

  const disconnect = () => {
    localStorage.clear();
    setAccount(null);
    setAuthReady(false);
    toast.success("Disconnected");
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        provider,
        signer,
        chainId,
        isConnected: !!account,
        authReady,
        connectEthereumWallet,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
