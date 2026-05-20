/**
 * useUGF.ts
 * Full UGF Remote Transaction lifecycle for ZeroGas dApp.
 * Users pay gas with TYI Mock USD — no ETH needed.
 *
 * Flow: Auth → Quote → Settle → Execute → Confirm
 */

import {
  UGFClient,
  BASE_SEPOLIA_CHAIN_ID,
  BASE_SEPOLIA_CHAIN_TYPE,
  TYI_USD_PAYMENT_COIN,
} from '@tychilabs/ugf-testnet-js';
import { ethers } from 'ethers';

export type UGFStep = 'idle' | 'auth' | 'quote' | 'settle' | 'execute' | 'done' | 'error';

export interface UGFProgress {
  step: UGFStep;
  message: string;
  txHash?: string;
  error?: string;
}

type ProgressCallback = (p: UGFProgress) => void;

type EthProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

function getEthProvider(): EthProvider | null {
  return (window as unknown as { ethereum?: EthProvider }).ethereum ?? null;
}

/**
 * Execute a UGF remote transaction.
 * The user pays with TYI Mock USD — no ETH required.
 *
 * @param toAddress   Destination contract/address
 * @param calldata    Encoded function call (0x for plain ETH send)
 * @param value       ETH value in wei (0n for contract calls)
 * @param onProgress  Callback for step-by-step UI updates
 */
export async function executeUGFTransaction(
  toAddress: string,
  calldata: string,
  value: bigint,
  onProgress: ProgressCallback
): Promise<string> {
  const eth = getEthProvider();
  if (!eth) throw new Error('MetaMask not found');

  // Get signer from MetaMask via ethers
  const web3Provider = new ethers.BrowserProvider(eth as unknown as ethers.Eip1193Provider);
  const signer = await web3Provider.getSigner();
  const userAddress = await signer.getAddress();

  // Switch to Base Sepolia
  try {
    await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x14a34' }] });
  } catch { /* ignore if already on correct chain */ }

  const client = new UGFClient();

  // ── Step 1: Auth ──────────────────────────────────────────────────────────
  onProgress({ step: 'auth', message: 'Authenticating with UGF...' });
  await client.auth.login(signer);

  // ── Step 2: Quote ─────────────────────────────────────────────────────────
  onProgress({ step: 'quote', message: 'Getting gas quote from UGF...' });
  const quote = await client.quote.get({
    payer_address: userAddress,
    tx_object: JSON.stringify({
      from: userAddress,
      to: toAddress,
      data: calldata,
      value: value.toString(),
    }),
    destination_chain_id: BASE_SEPOLIA_CHAIN_ID,
    destination_chain_type: BASE_SEPOLIA_CHAIN_TYPE,
    payment_coin: TYI_USD_PAYMENT_COIN,
  });

  // ── Step 3: Settle ────────────────────────────────────────────────────────
  onProgress({
    step: 'settle',
    message: `Authorizing ${quote.settlement_amount} TYI Mock USD payment...`,
  });
  await client.payment.x402.execute({ quote, signer });

  // ── Step 4: Execute ───────────────────────────────────────────────────────
  onProgress({ step: 'execute', message: 'UGF sponsoring gas & executing on Base Sepolia...' });
  const { userTxHash } = await client.chains.evm.sponsorAndExecute(
    quote.digest,
    signer,
    async () => ({
      to: toAddress,
      data: calldata,
      value,
    })
  );

  // ── Step 5: Done ──────────────────────────────────────────────────────────
  onProgress({ step: 'done', message: 'Transaction confirmed on Base Sepolia!', txHash: userTxHash });
  return userTxHash;
}

/**
 * Claim a badge via UGF — no ETH needed.
 * Calls mintCertificate on the SkillStamp contract.
 */
export async function claimBadgeViaUGF(
  contractAddress: string,
  quizId: number,
  score: number,
  issuerSignature: string,
  onProgress: ProgressCallback
): Promise<string> {
  // Encode mintCertificate(uint256 quizId, uint8 score, bytes issuerSignature)
  const iface = new ethers.Interface([
    'function mintCertificate(uint256 quizId, uint8 score, bytes issuerSignature)',
  ]);
  const calldata = iface.encodeFunctionData('mintCertificate', [quizId, score, issuerSignature]);

  return executeUGFTransaction(contractAddress, calldata, 0n, onProgress);
}

/**
 * Send ETH via UGF — user pays with Mock USD, no ETH needed.
 */
export async function sendETHViaUGF(
  toAddress: string,
  amountEth: string,
  onProgress: ProgressCallback
): Promise<string> {
  const valueWei = ethers.parseEther(amountEth);
  return executeUGFTransaction(toAddress, '0x', valueWei, onProgress);
}

/**
 * Contribute to UGF pool via UGF — meta!
 */
export async function contributeToUGFPool(
  poolAddress: string,
  amountEth: string,
  onProgress: ProgressCallback
): Promise<string> {
  const valueWei = ethers.parseEther(amountEth);
  return executeUGFTransaction(poolAddress, '0x', valueWei, onProgress);
}
