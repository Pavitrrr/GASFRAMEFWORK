import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

export default {
  solidity: "0.8.20",
  networks: {
    baseSepolia: {
      type: "http",
      url: process.env.VITE_RPC_URL || "https://sepolia.base.org",
      accounts: process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY.replace('0x','')}`] : [],
      chainId: 84532,
    },
  },
};
