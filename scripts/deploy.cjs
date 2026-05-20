const hre = require("hardhat");

async function main() {
  console.log("Deploying SkillStamp contract to Base Sepolia...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  const SkillStamp = await hre.ethers.getContractFactory("SkillStamp");
  const skillStamp = await SkillStamp.deploy();

  await skillStamp.waitForDeployment();

  const address = await skillStamp.getAddress();
  console.log("✅ SkillStamp deployed to:", address);
  console.log("\nAdd this to your .env file:");
  console.log(`VITE_CONTRACT_ADDRESS=${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
