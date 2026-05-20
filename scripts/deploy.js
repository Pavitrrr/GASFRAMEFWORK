import { ethers } from "ethers";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read compiled artifact — compile first with: npx hardhat compile
const artifactPath = resolve(__dirname, "../artifacts/contracts/SkillStamp.sol/SkillStamp.json");

async function main() {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) { console.error("❌ PRIVATE_KEY not set in .env"); process.exit(1); }

  const rpcUrl = process.env.VITE_RPC_URL || "https://sepolia.base.org";
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`, provider);

  console.log("Deployer:", wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    console.error("❌ No ETH. Get Base Sepolia ETH from https://www.alchemy.com/faucets/base-sepolia");
    process.exit(1);
  }

  // Read compiled artifact
  let artifact;
  try {
    artifact = JSON.parse(readFileSync(artifactPath, "utf8"));
  } catch {
    console.error("❌ Artifact not found. Run: npx hardhat compile");
    process.exit(1);
  }

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  console.log("Deploying SkillStamp...");
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ SkillStamp deployed to:", address);
  console.log("\nAdd to BOTH .env files:");
  console.log(`VITE_CONTRACT_ADDRESS=${address}`);
}

main().catch(e => { console.error(e); process.exitCode = 1; });
