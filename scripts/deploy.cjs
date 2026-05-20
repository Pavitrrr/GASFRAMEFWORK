const hre = require("hardhat");

async function main() {
  console.log("Deploying SkillStamp to Base Sepolia...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    console.error("❌ No ETH in deployer wallet. Get Base Sepolia ETH from https://www.alchemy.com/faucets/base-sepolia");
    process.exit(1);
  }

  const SkillStamp = await hre.ethers.getContractFactory("SkillStamp");
  const contract = await SkillStamp.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ SkillStamp deployed to:", address);
  console.log("\nPaste this into skillstamp/.env:");
  console.log(`VITE_CONTRACT_ADDRESS=${address}`);
  console.log("\nAlso paste into 'Design Zerogas dApp/.env':");
  console.log(`VITE_CONTRACT_ADDRESS=${address}`);
}

main().catch(e => { console.error(e); process.exitCode = 1; });
