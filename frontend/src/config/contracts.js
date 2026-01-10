import SubscriptionManagerArtifact from "../../../blockchain-ethereum/artifacts/contracts/SubscriptionManager.sol/SubscriptionManager.json";

export const contracts = {
  ethereum: {
    chainId: 31337, // hardhat localhost
    subscriptionManager: {
      address: "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1",
      abi: SubscriptionManagerArtifact.abi, // ✅ ONLY THIS
    },
  },
};
