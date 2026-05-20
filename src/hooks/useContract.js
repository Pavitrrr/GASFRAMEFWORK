import { useMemo } from "react";
import { ethers } from "ethers";
import { useWallet } from "../context/WalletContext";
import { ZEROGAS_ABI as SKILLSTAMP_ABI, CONTRACT_ADDRESS } from "../contract/abi";

const RPC_URL = import.meta.env.VITE_RPC_URL || "https://sepolia.base.org";

// Read-only contract (no wallet needed)
export function useReadContract() {
  return useMemo(() => {
    if (!CONTRACT_ADDRESS) return null;
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    return new ethers.Contract(CONTRACT_ADDRESS, SKILLSTAMP_ABI, provider);
  }, []);
}

// Write contract (wallet needed)
export function useWriteContract() {
  const { signer } = useWallet();
  return useMemo(() => {
    if (!signer || !CONTRACT_ADDRESS) return null;
    return new ethers.Contract(CONTRACT_ADDRESS, SKILLSTAMP_ABI, signer);
  }, [signer]);
}
