import { createContext, useContext, useState, useCallback } from "react";
import { ethers } from "ethers";

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask not found. Please install MetaMask.");
      return;
    }
    setConnecting(true);
    setError(null);
    try {
      // Request accounts
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Switch to Base Sepolia
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x14A34" }], // 84532 in hex
        });
      } catch (switchError) {
        // Chain not added yet — add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x14A34",
                chainName: "Base Sepolia",
                nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
                rpcUrls: ["https://sepolia.base.org"],
                blockExplorerUrls: ["https://sepolia.basescan.org"],
              },
            ],
          });
        } else {
          throw switchError;
        }
      }

      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();
      const addr = await web3Signer.getAddress();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAddress(addr);
    } catch (err) {
      setError(err.message || "Failed to connect wallet");
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setSigner(null);
    setProvider(null);
  }, []);

  return (
    <WalletContext.Provider
      value={{ address, signer, provider, connecting, error, connect, disconnect }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}
