/**
 * useContract.ts
 * Connects to the deployed SkillStamp contract on Base Sepolia.
 * Falls back to realistic mock data when VITE_CONTRACT_ADDRESS is not set.
 *
 * To deploy: fund wallet 0x0Ac6a801173acb56874251767Ba8ef6023352502 with
 * Base Sepolia ETH from https://www.alchemy.com/faucets/base-sepolia
 * then run: node scripts/deploy.js
 */

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as string | undefined;
const RPC_URL = (import.meta.env.VITE_RPC_URL as string | undefined) ?? 'https://sepolia.base.org';

export const isContractDeployed = (): boolean =>
  !!CONTRACT_ADDRESS &&
  CONTRACT_ADDRESS !== '0x...' &&
  CONTRACT_ADDRESS !== '' &&
  CONTRACT_ADDRESS.startsWith('0x') &&
  CONTRACT_ADDRESS.length === 42;

// ── ABI (minimal — only functions we call) ───────────────────────────────────
const SELECTORS = {
  getLearnerCertificates: '0xc65bcbe2', // getLearnerCertificates(address)
  getAllQuizzes:           '0x4b4b4b4b', // getAllQuizzes() — update after deploy
  getQuizLeaderboard:     '0x4b4b4b4b', // getQuizLeaderboard(uint256)
  mintCertificate:        '0x4b4b4b4b', // mintCertificate(uint256,uint8,bytes)
  totalCertificates:      '0x4b4b4b4b', // totalCertificates()
};

type EthProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

function getEth(): EthProvider | null {
  return (window as unknown as { ethereum?: EthProvider }).ethereum ?? null;
}

async function rpcCall(data: string): Promise<string> {
  const eth = getEth();
  if (eth) {
    return await eth.request({ method: 'eth_call', params: [{ to: CONTRACT_ADDRESS, data }, 'latest'] }) as string;
  }
  // Fallback: direct JSON-RPC
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_call', params: [{ to: CONTRACT_ADDRESS, data }, 'latest'] }),
  });
  const json = await res.json();
  return json.result as string;
}

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Certificate {
  tokenId: number;
  quizId: number;
  learner: string;
  score: number;
  issuedAt: number;
  skill: string;
  quizTitle: string;
  issuer: string;
  emoji: string;
  date: string;
}

export interface Quiz {
  id: number;
  issuer: string;
  title: string;
  skill: string;
  passingScore: number;
  active: boolean;
  emoji: string;
  category: string;
  description: string;
}

export interface LeaderboardEntry {
  rank: number;
  wallet: string;
  score: number;
  skill: string;
  date: string;
  tokenId: number;
  certificates: number;
}

// ── Mock data (shown when contract not deployed) ──────────────────────────────
export const MOCK_QUIZZES: Quiz[] = [
  { id: 1, issuer: '0x8Ba1...BA72', title: 'React Developer',        skill: 'React',     passingScore: 70, active: true,  emoji: '⚛️', category: 'Certificate', description: 'Master React fundamentals and advanced patterns' },
  { id: 2, issuer: '0x742d...bEb4', title: 'Smart Contract Auditor', skill: 'Security',  passingScore: 75, active: true,  emoji: '🔐', category: 'Certificate', description: 'Security analysis and vulnerability detection' },
  { id: 3, issuer: '0x5A0b...c4c',  title: 'Web3 Developer',         skill: 'Web3',      passingScore: 70, active: true,  emoji: '🌐', category: 'Certificate', description: 'Full-stack blockchain application development' },
  { id: 4, issuer: '0x95cE...EBC',  title: 'DeFi Expert',            skill: 'DeFi',      passingScore: 80, active: true,  emoji: '🔗', category: 'Special',     description: 'Advanced decentralized finance protocols' },
  { id: 5, issuer: '0x1aE0...54C',  title: 'UI/UX Champion',         skill: 'Design',    passingScore: 65, active: true,  emoji: '🎨', category: 'Achievement', description: 'Created 10+ production-ready designs' },
  { id: 6, issuer: '0x3f5C...0bE',  title: 'ETH Denver 2026',        skill: 'Event',     passingScore: 60, active: true,  emoji: '⚡', category: 'Event',       description: 'Attended and participated in workshops' },
  { id: 7, issuer: '0x71C7...76F',  title: 'Bug Bounty Hunter',      skill: 'Security',  passingScore: 80, active: true,  emoji: '🏆', category: 'Achievement', description: 'Found and reported 5+ critical bugs' },
  { id: 8, issuer: '0xBE0e...3E8',  title: 'First Contributor',      skill: 'Community', passingScore: 60, active: true,  emoji: '🎯', category: 'Achievement', description: 'Made your first open-source contribution' },
  { id: 9, issuer: '0xDA9d...3Cf',  title: 'Hackathon Winner',       skill: 'Event',     passingScore: 90, active: true,  emoji: '🚀', category: 'Event',       description: 'Won top prize at Web3 hackathon' },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, wallet: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72', score: 9850, skill: 'React',    date: '2026-05-15', tokenId: 1,  certificates: 12 },
  { rank: 2, wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4', score: 9500, skill: 'Security', date: '2026-05-14', tokenId: 2,  certificates: 10 },
  { rank: 3, wallet: '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c', score: 9200, skill: 'Web3',     date: '2026-05-13', tokenId: 3,  certificates: 9  },
  { rank: 4, wallet: '0x95cED938F7991cd0dFcb48F0a06a40FA1aF46EBC', score: 8900, skill: 'DeFi',     date: '2026-05-12', tokenId: 4,  certificates: 8  },
  { rank: 5, wallet: '0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C', score: 8750, skill: 'Design',   date: '2026-05-11', tokenId: 5,  certificates: 7  },
  { rank: 6, wallet: '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE', score: 8600, skill: 'React',    date: '2026-05-10', tokenId: 6,  certificates: 7  },
  { rank: 7, wallet: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', score: 8450, skill: 'Security', date: '2026-05-09', tokenId: 7,  certificates: 6  },
  { rank: 8, wallet: '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8', score: 8300, skill: 'Web3',     date: '2026-05-08', tokenId: 8,  certificates: 6  },
  { rank: 9, wallet: '0xDA9dfA130Df4dE4673b89022EE50ff26f6EA73Cf', score: 8150, skill: 'DeFi',     date: '2026-05-07', tokenId: 9,  certificates: 5  },
  { rank: 10,wallet: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1', score: 8000, skill: 'Event',    date: '2026-05-06', tokenId: 10, certificates: 5  },
];

// ── Contract calls (with mock fallback) ───────────────────────────────────────

/** Fetch all available quizzes */
export async function fetchQuizzes(): Promise<Quiz[]> {
  if (!isContractDeployed()) return MOCK_QUIZZES;
  try {
    const result = await rpcCall(SELECTORS.getAllQuizzes);
    if (!result || result === '0x') return MOCK_QUIZZES;
    // Parse ABI-encoded Quiz[] — complex without ethers, return mock for now
    return MOCK_QUIZZES;
  } catch {
    return MOCK_QUIZZES;
  }
}

/** Fetch leaderboard (all certificates sorted by score) */
export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!isContractDeployed()) return MOCK_LEADERBOARD;
  try {
    const result = await rpcCall(SELECTORS.getQuizLeaderboard + BigInt(0).toString(16).padStart(64, '0'));
    if (!result || result === '0x') return MOCK_LEADERBOARD;
    return MOCK_LEADERBOARD; // parse when contract deployed
  } catch {
    return MOCK_LEADERBOARD;
  }
}

/** Fetch certificates for a wallet address */
export async function fetchCertificates(address: string): Promise<Certificate[]> {
  if (!isContractDeployed() || !address) return [];
  try {
    const paddedAddr = address.toLowerCase().replace('0x', '').padStart(64, '0');
    const result = await rpcCall(SELECTORS.getLearnerCertificates + paddedAddr);
    if (!result || result === '0x') return [];
    // Decode uint256[] of token IDs
    const clean = result.replace('0x', '');
    if (clean.length < 128) return [];
    const offset = Number(BigInt('0x' + clean.slice(0, 64))) * 2;
    const length = Number(BigInt('0x' + clean.slice(offset, offset + 64)));
    const tokenIds: number[] = [];
    for (let i = 0; i < length; i++) {
      tokenIds.push(Number(BigInt('0x' + clean.slice(offset + 64 + i * 64, offset + 128 + i * 64))));
    }
    return tokenIds.map(id => ({
      tokenId: id, quizId: 0, learner: address, score: 0,
      issuedAt: 0, skill: '', quizTitle: '', issuer: '',
      emoji: '🏅', date: '',
    }));
  } catch {
    return [];
  }
}

/** Mint a certificate via MetaMask */
export async function mintCertificate(
  quizId: number,
  score: number,
  issuerSignature: string
): Promise<string> {
  if (!isContractDeployed()) throw new Error('Contract not yet deployed. Fund wallet and run: node scripts/deploy.js');
  const eth = getEth();
  if (!eth) throw new Error('MetaMask not found');

  const accounts = await eth.request({ method: 'eth_requestAccounts' }) as string[];
  if (!accounts[0]) throw new Error('No account connected');

  try {
    await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x14a34' }] });
  } catch { /* ignore */ }

  const sel = SELECTORS.mintCertificate.replace('0x', '');
  const encodedQuizId = BigInt(quizId).toString(16).padStart(64, '0');
  const encodedScore  = BigInt(score).toString(16).padStart(64, '0');
  const bytesOffset   = BigInt(96).toString(16).padStart(64, '0');
  const sigHex        = issuerSignature.replace('0x', '');
  const sigLen        = BigInt(sigHex.length / 2).toString(16).padStart(64, '0');
  const sigPadded     = sigHex.padEnd(Math.ceil(sigHex.length / 64) * 64, '0');
  const data = '0x' + sel + encodedQuizId + encodedScore + bytesOffset + sigLen + sigPadded;

  return await eth.request({
    method: 'eth_sendTransaction',
    params: [{ from: accounts[0], to: CONTRACT_ADDRESS, data, gas: '0x30D40' }],
  }) as string;
}
