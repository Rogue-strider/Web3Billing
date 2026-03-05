import SubscriptionManagerArtifact from "../../../blockchain-ethereum/artifacts/contracts/SubscriptionManager.sol/SubscriptionManager.json";

export const contracts = {
  ethereum: {
    chainId: 31337, // hardhat localhost
    subscriptionManager: {
      address: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
      abi: SubscriptionManagerArtifact.abi, // ✅ ONLY THIS
    },
  },
};
