// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import { ethers } from "ethers";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // 🔥 ABI load (HARdHAT ARTIFACT)
// const artifactPath = path.join(
//   __dirname,
//   "../../../../blockchain-ethereum/artifacts/contracts/SubscriptionManager.sol/SubscriptionManager.json"
// );

// const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
// const abi = artifact.abi;

// // 🔥 WebSocket provider (EVENTS)
// const WS_URL = "ws://127.0.0.1:8545";
// export const provider = new ethers.WebSocketProvider(WS_URL);

// // 🔥 Contract address
// const CONTRACT_ADDRESS = process.env.SUBSCRIPTION_MANAGER_ADDRESS;
// if (!CONTRACT_ADDRESS) {
//   throw new Error("❌ SUBSCRIPTION_MANAGER_ADDRESS missing in env");
// }

// // 🔥 Contract instance
// export const subscriptionContract = new ethers.Contract(
//   CONTRACT_ADDRESS,
//   abi,
//   provider
// );

// // =======================
// // DEBUG
// // =======================
// provider.on("network", () => {
//   console.log("🟢 Ethereum WS connected");
// });

// provider.on("error", (err) => {
//   console.error("❌ Provider error:", err);
// });




import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ethers } from "ethers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ ABI load (Hardhat artifact)
const artifactPath = path.join(
  __dirname,
  "../../../../blockchain-ethereum/artifacts/contracts/SubscriptionManager.sol/SubscriptionManager.json"
);

const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
const abi = artifact.abi;

// ✅ WS Provider
export const provider = new ethers.WebSocketProvider("ws://127.0.0.1:8545");

// ✅ Contract Address
const CONTRACT_ADDRESS = process.env.SUBSCRIPTION_MANAGER_ADDRESS;
if (!CONTRACT_ADDRESS) {
  throw new Error("SUBSCRIPTION_MANAGER_ADDRESS missing");
}

// ✅ Contract instance (READ + EVENTS only)
export const subscriptionContract = new ethers.Contract(
  CONTRACT_ADDRESS,
  abi,
  provider
);

// ✅ Correct event
provider.on("network", (network) => {
  console.log("🟢 Ethereum WS connected:", network.chainId);
});

provider.on("error", (err) => {
  console.error("❌ WS Provider error:", err);
});
