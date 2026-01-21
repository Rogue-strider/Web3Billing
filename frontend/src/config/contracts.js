import SubscriptionManagerArtifact from "../../../blockchain-ethereum/artifacts/contracts/SubscriptionManager.sol/SubscriptionManager.json";

export const contracts = {
  ethereum: {
    chainId: 31337, // hardhat localhost
    subscriptionManager: {
      address: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
      abi: SubscriptionManagerArtifact.abi, // ✅ ONLY THIS
    },
  },
};
