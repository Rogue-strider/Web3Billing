const hre = require("hardhat");

async function main() {
  const SubscriptionManager = await hre.ethers.getContractFactory(
    "SubscriptionManager"
  );

  const contract = await SubscriptionManager.deploy();
  await contract.waitForDeployment();

  console.log(
    "✅ SubscriptionManager deployed to:",
    await contract.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
