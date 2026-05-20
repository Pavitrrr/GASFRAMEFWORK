import { useState } from "react";
import { ethers } from "ethers";
import {
  UGFClient,
  BASE_SEPOLIA_CHAIN_ID,
  BASE_SEPOLIA_CHAIN_TYPE,
  TYI_USD_PAYMENT_COIN,
} from "@tychilabs/ugf-testnet-js";
import { SKILLSTAMP_ABI, CONTRACT_ADDRESS } from "../contract/abi";

/**
 * Hook that wraps the full UGF remote transaction lifecycle:
 * auth → quote → settle → execute → confirm
 */
export function useUGF() {
  const [status, setStatus] = useState(null); // null | 'authenticating' | 'quoting' | 'settling' | 'executing' | 'done' | 'error'
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Execute a gasless mint via UGF
   * @param {ethers.Signer} signer - Connected wallet signer
   * @param {number} quizId
   * @param {number} score
   * @param {string} issuerSignature
   */
  async function gaslessMint(signer, quizId, score, issuerSignature) {
    setStatus("authenticating");
    setError(null);
    setTxHash(null);

    try {
      const client = new UGFClient();

      // 1. Authenticate
      setStatus("authenticating");
      await client.auth.login(signer);

      const payerAddress = await signer.getAddress();

      // Build the tx calldata for mintCertificate
      const iface = new ethers.Interface(SKILLSTAMP_ABI);
      const data = iface.encodeFunctionData("mintCertificate", [
        quizId,
        score,
        issuerSignature,
      ]);

      // 2. Quote
      setStatus("quoting");
      const quote = await client.quote.get({
        payer_address: payerAddress,
        tx_object: JSON.stringify({
          from: payerAddress,
          to: CONTRACT_ADDRESS,
          data: data,
          value: "0",
        }),
      });

      // 3. Settle (ERC-3009 signature — no on-chain tx from user)
      setStatus("settling");
      await client.payment.x402.execute({ quote, signer });

      // 4. Execute — UGF sponsors ETH, sends the tx
      setStatus("executing");
      const { userTxHash } = await client.chains.evm.sponsorAndExecute(
        quote.digest,
        signer,
        async () => ({
          to: CONTRACT_ADDRESS,
          data: data,
          value: 0n,
        })
      );

      setTxHash(userTxHash);
      setStatus("done");
      return userTxHash;
    } catch (err) {
      console.error("UGF error:", err);
      setError(err.message || "Transaction failed");
      setStatus("error");
      throw err;
    }
  }

  /**
   * Execute a gasless createQuiz via UGF
   */
  async function gaslessCreateQuiz(signer, title, skill, questionsJson, passingScore) {
    setStatus("authenticating");
    setError(null);
    setTxHash(null);

    try {
      const client = new UGFClient();

      setStatus("authenticating");
      await client.auth.login(signer);

      const payerAddress = await signer.getAddress();

      const iface = new ethers.Interface(SKILLSTAMP_ABI);
      const data = iface.encodeFunctionData("createQuiz", [
        title,
        skill,
        questionsJson,
        passingScore,
      ]);

      setStatus("quoting");
      const quote = await client.quote.get({
        payer_address: payerAddress,
        tx_object: JSON.stringify({
          from: payerAddress,
          to: CONTRACT_ADDRESS,
          data: data,
          value: "0",
        }),
      });

      setStatus("settling");
      await client.payment.x402.execute({ quote, signer });

      setStatus("executing");
      const { userTxHash } = await client.chains.evm.sponsorAndExecute(
        quote.digest,
        signer,
        async () => ({
          to: CONTRACT_ADDRESS,
          data: data,
          value: 0n,
        })
      );

      setTxHash(userTxHash);
      setStatus("done");
      return userTxHash;
    } catch (err) {
      console.error("UGF error:", err);
      setError(err.message || "Transaction failed");
      setStatus("error");
      throw err;
    }
  }

  const statusLabel = {
    authenticating: "🔐 Authenticating with UGF...",
    quoting: "💬 Getting gas quote...",
    settling: "✍️ Signing payment (no ETH needed)...",
    executing: "⛓️ Executing on-chain...",
    done: "✅ Done!",
    error: "❌ Failed",
  };

  return {
    gaslessMint,
    gaslessCreateQuiz,
    status,
    statusLabel: status ? statusLabel[status] : null,
    txHash,
    error,
    isLoading: ["authenticating", "quoting", "settling", "executing"].includes(status),
  };
}
