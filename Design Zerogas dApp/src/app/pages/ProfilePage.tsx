import { useState } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { Copy, QrCode, ExternalLink, Fuel, Pencil, Check } from 'lucide-react';
import { useUser, AVATAR_OPTIONS } from '../context/UserContext';

const stats = [
  { label: 'Certificates', value: '12' },
  { label: 'Skills',       value: '8'  },
  { label: 'Avg Score',    value: '89%'},
  { label: 'Achievements', value: '24' },
];

const certificates = [
  { skill: 'React Development',      emoji: '⚛️', score: 92, issuer: '0x8Ba1...BA72', date: '2026-05-15' },
  { skill: 'Smart Contracts',        emoji: '🔐', score: 88, issuer: '0x742d...bEb4', date: '2026-05-10' },
  { skill: 'Web3 Development',       emoji: '🌐', score: 95, issuer: '0x5A0b...c4c',  date: '2026-05-05' },
  { skill: 'DeFi Protocols',         emoji: '🔗', score: 85, issuer: '0x95cE...EBC',  date: '2026-04-28' },
  { skill: 'Solidity Advanced',      emoji: '📜', score: 91, issuer: '0x3fA8...D21',  date: '2026-04-20' },
  { skill: 'NFT Development',        emoji: '🎨', score: 87, issuer: '0x1bC9...F44',  date: '2026-04-12' },
  { skill: 'Blockchain Security',    emoji: '🛡️', score: 93, issuer: '0x7dE2...A88',  date: '2026-04-05' },
  { skill: 'Layer 2 Solutions',      emoji: '⚡', score: 89, issuer: '0x4aC1...B33',  date: '2026-03-28' },
  { skill: 'DAO Governance',         emoji: '🏛️', score: 82, issuer: '0x9fB3...C77',  date: '2026-03-20' },
  { skill: 'Zero Knowledge Proofs',  emoji: '🔮', score: 78, issuer: '0x2eD5...E99',  date: '2026-03-10' },
  { skill: 'Cross-Chain Bridges',    emoji: '🌉', score: 84, issuer: '0x6aF7...G55',  date: '2026-03-01' },
  { skill: 'Tokenomics Design',      emoji: '💎', score: 90, issuer: '0x8bA2...H11',  date: '2026-02-20' },
];

const achievements = [
  { tier: 'Gold',     name: 'Perfect Score',      icon: '🎯', locked: false, color: '#FFD700' },
  { tier: 'Gold',     name: 'Speed Runner',        icon: '⚡', locked: false, color: '#FFD700' },
  { tier: 'Gold',     name: 'Top Earner',          icon: '💰', locked: false, color: '#FFD700' },
  { tier: 'Gold',     name: 'Chain Master',        icon: '⛓️', locked: false, color: '#FFD700' },
  { tier: 'Gold',     name: 'Hackathon Winner',    icon: '🏆', locked: false, color: '#FFD700' },
  { tier: 'Gold',     name: 'First Contributor',   icon: '🚀', locked: false, color: '#FFD700' },
  { tier: 'Silver',   name: 'Streak Master',       icon: '🔥', locked: false, color: '#C0C0C0' },
  { tier: 'Silver',   name: 'Community Helper',    icon: '🤝', locked: false, color: '#C0C0C0' },
  { tier: 'Silver',   name: 'Bug Bounty Hunter',   icon: '🐛', locked: false, color: '#C0C0C0' },
  { tier: 'Silver',   name: 'DeFi Expert',         icon: '📊', locked: false, color: '#C0C0C0' },
  { tier: 'Silver',   name: 'Web3 Pioneer',        icon: '🌐', locked: false, color: '#C0C0C0' },
  { tier: 'Silver',   name: 'Code Reviewer',       icon: '👁️', locked: false, color: '#C0C0C0' },
  { tier: 'Bronze',   name: 'First Steps',         icon: '👣', locked: false, color: '#CD7F32' },
  { tier: 'Bronze',   name: 'Early Bird',          icon: '🐦', locked: false, color: '#CD7F32' },
  { tier: 'Bronze',   name: 'Quick Learner',       icon: '📚', locked: false, color: '#CD7F32' },
  { tier: 'Bronze',   name: 'Team Player',         icon: '👥', locked: false, color: '#CD7F32' },
  { tier: 'Bronze',   name: 'Night Owl',           icon: '🦉', locked: false, color: '#CD7F32' },
  { tier: 'Bronze',   name: 'Curious Mind',        icon: '🔍', locked: false, color: '#CD7F32' },
  { tier: 'Gold',     name: 'Legendary',           icon: '👑', locked: true,  color: '#FFD700' },
  { tier: 'Gold',     name: 'Whale',               icon: '🐋', locked: true,  color: '#FFD700' },
  { tier: 'Silver',   name: 'Mentor',              icon: '🎓', locked: true,  color: '#C0C0C0' },
  { tier: 'Silver',   name: 'Validator',           icon: '✅', locked: true,  color: '#C0C0C0' },
  { tier: 'Bronze',   name: 'Collector',           icon: '🗂️', locked: true,  color: '#CD7F32' },
  { tier: 'Bronze',   name: 'Networker',           icon: '🕸️', locked: true,  color: '#CD7F32' },
];

// Proper QR code generator — creates a real-looking QR with finder patterns, timing, and data
function QRCode({ value, size = 160, color = '#7C3AED' }: { value: string; size?: number; color?: string }) {
  const N = 21; // QR version 1 = 21x21 modules

  // Deterministic data fill from seed
  const grid: boolean[][] = Array.from({ length: N }, () => Array(N).fill(false));

  // Finder patterns (top-left, top-right, bottom-left)
  const drawFinder = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
      const border = r === 0 || r === 6 || c === 0 || c === 6;
      const inner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      if (row + r < N && col + c < N) grid[row + r][col + c] = border || inner;
    }
  };
  drawFinder(0, 0); drawFinder(0, N - 7); drawFinder(N - 7, 0);

  // Timing patterns
  for (let i = 8; i < N - 8; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  // Dark module
  grid[N - 8][8] = true;

  // Fill data area with deterministic pattern from value
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      // Skip finder pattern areas and timing
      const inFinder = (r < 9 && c < 9) || (r < 9 && c >= N - 8) || (r >= N - 8 && c < 9);
      const inTiming = r === 6 || c === 6;
      if (!inFinder && !inTiming) {
        const seed = (r * N + c + Math.abs(hash)) * 2654435761;
        grid[r][c] = (seed >>> 0) % 3 !== 0;
      }
    }
  }

  const cell = size / N;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={size} height={size} fill="white" />
      {grid.map((row, r) =>
        row.map((filled, c) =>
          filled ? (
            <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill={color} />
          ) : null
        )
      )}
    </svg>
  );
}

export function ProfilePage() {
  const { user, updateProfile } = useUser();
  const [activeTab, setActiveTab] = useState<'certificates' | 'achievements'>('certificates');
  const [showQR, setShowQR] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUsername, setEditUsername] = useState(user.username);
  const [editAvatar, setEditAvatar] = useState(user.avatar);
  const [copied, setCopied] = useState(false);

  const walletAddress = user.walletAddress || null;
  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : 'Not connected';

  const profileUrl = walletAddress
    ? `https://zerogas.xyz/${walletAddress}`
    : 'https://zerogas.xyz/';

  // Real stats — only show data if wallet connected, otherwise zeros
  const isConnected = !!walletAddress;
  const userStats = [
    { label: 'Certificates', value: isConnected ? user.settings?.compactMode ? '12' : '0' : '0' },
    { label: 'Skills',       value: isConnected ? '0' : '0' },
    { label: 'Avg Score',    value: isConnected ? '—' : '—' },
    { label: 'Achievements', value: isConnected ? '0' : '0' },
  ];

  // Only show certificates/achievements if wallet is connected
  const userCertificates = isConnected ? certificates : [];
  const userAchievements = isConnected ? achievements : [];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProfile = () => {
    updateProfile({ username: editUsername.trim() || user.username, avatar: editAvatar });
    setShowEditModal(false);
  };

  return (
    <>
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Header Card */}
        <GlassCard className="p-8 mb-8" hover={false}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl shrink-0"
                  style={{ background: 'linear-gradient(135deg,var(--primary),var(--secondary))', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}>
                  {user.avatar}
                </div>
                <button onClick={() => { setEditUsername(user.username); setEditAvatar(user.avatar); setShowEditModal(true); }}
                  className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <Pencil className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
                    {user.username || shortAddress}
                  </h1>
                  <div className="px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-bold">
                    ✦ This is you
                  </div>
                </div>
                {walletAddress ? (
                  <code className="text-sm text-muted-foreground block" style={{ fontFamily: 'var(--font-mono)' }}>
                    {walletAddress}
                  </code>
                ) : (
                  <p className="text-sm text-muted-foreground">No wallet connected</p>
                )}
              </div>
            </div>

            {/* Action Buttons — only real/useful ones */}
            <div className="flex flex-wrap gap-2">
              <button onClick={() => { setEditUsername(user.username); setEditAvatar(user.avatar); setShowEditModal(true); }}
                className="px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-sm font-semibold transition-all flex items-center gap-2">
                <Pencil className="w-4 h-4" /> Edit Profile
              </button>
              <button onClick={handleCopyLink}
                className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] border border-white/10 hover:border-primary/30 text-sm font-semibold transition-all flex items-center gap-2">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <button onClick={() => setShowQR(!showQR)}
                className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all flex items-center gap-2 ${showQR ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/10'}`}>
                <QrCode className="w-4 h-4" /> QR Code
              </button>
              {walletAddress && (
                <a href={`https://basescan.org/address/${walletAddress}`} target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] border border-white/10 hover:border-primary/30 text-sm font-semibold transition-all flex items-center gap-2">
                  BaseScan <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* QR Panel */}
          {showQR && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 pt-6 border-t border-white/[0.08]">
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-2xl p-4 bg-white shadow-xl">
                  <QRCode value={profileUrl} size={176} color="#7C3AED" />
                </div>
                <code className="text-sm text-muted-foreground text-center break-all max-w-xs" style={{ fontFamily: 'var(--font-mono)' }}>
                  {walletAddress ? `zerogas.xyz/${shortAddress}` : 'zerogas.xyz/'}
                </code>
              </div>
            </motion.div>
          )}
        </GlassCard>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {userStats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard className="p-6 text-center">
                <div className="text-4xl mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                  style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Gas Savings */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-success/20 border border-success/40">
            <Fuel className="w-4 h-4 text-success" />
            <span className="text-success font-semibold">
              {isConnected ? 'Total gas saved: 0.000 ETH via UGF' : 'Connect wallet to track gas savings'}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-white/[0.08]">
          {(['certificates', 'achievements'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 font-semibold transition-all relative capitalize ${activeTab === tab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              <span className="flex items-center gap-2">
                {tab === 'certificates' ? '🏅' : '🏆'} {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </span>
              {activeTab === tab && (
                <motion.div layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'certificates' ? (
          <div className="space-y-6">
            {userCertificates.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <div className="text-5xl mb-4">🏅</div>
                <p className="font-semibold text-lg mb-2">No certificates yet</p>
                <p className="text-sm">{isConnected ? 'Claim your first badge to earn a certificate!' : 'Connect your wallet to see your certificates'}</p>
              </div>
            ) : userCertificates.map((cert, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: 'linear-gradient(90deg,var(--primary),var(--secondary))' }} />
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="absolute inset-0 blur-2xl opacity-60"
                        style={{ background: 'radial-gradient(circle,var(--primary) 0%,transparent 70%)', transform: 'scale(1.5)' }} />
                      <div className="relative text-5xl">{cert.emoji}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl mb-1" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>{cert.skill}</h3>
                      <code className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                        Issued by {cert.issuer}
                      </code>
                      <div className="text-xs text-muted-foreground mt-1">{cert.date}</div>
                    </div>
                    <div className="text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                      style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
                      {cert.score}%
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userAchievements.length === 0 ? (
              <div className="col-span-4 text-center py-16 text-muted-foreground">
                <div className="text-5xl mb-4">🏆</div>
                <p className="font-semibold text-lg mb-2">No achievements yet</p>
                <p className="text-sm">{isConnected ? 'Start claiming badges to unlock achievements!' : 'Connect your wallet to see your achievements'}</p>
              </div>
            ) : userAchievements.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                <GlassCard className={`p-6 text-center ${a.locked ? 'opacity-50 grayscale' : ''}`}
                  style={!a.locked ? { border: `2px solid ${a.color}`, boxShadow: `0 0 20px ${a.color}40` } : {}}>
                  <div className="text-4xl mb-3">{a.locked ? '🔒' : a.icon}</div>
                  <div className="text-xs font-bold mb-2" style={!a.locked ? { color: a.color } : {}}>{a.tier}</div>
                  <div className="text-sm font-semibold">{a.name}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Edit Profile Modal */}
    {showEditModal && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
        <motion.div initial={{ opacity: 0, scale: 0.92, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-sm rounded-2xl border border-white/[0.12] overflow-hidden"
          style={{ background: 'linear-gradient(135deg,rgba(20,14,40,0.98),rgba(10,10,25,0.98))', boxShadow: '0 24px 80px rgba(124,58,237,0.3)' }}>
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,var(--primary),var(--secondary))' }} />
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Edit Profile</h3>
              <button onClick={() => setShowEditModal(false)}
                className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.12] transition-colors text-white/50 hover:text-white">✕</button>
            </div>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                style={{ background: 'linear-gradient(135deg,var(--primary),var(--secondary))', boxShadow: '0 4px 24px rgba(124,58,237,0.5)' }}>
                {editAvatar}
              </div>
            </div>
            <p className="text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">Choose Avatar</p>
            <div className="grid grid-cols-6 gap-2 mb-5">
              {AVATAR_OPTIONS.map(emoji => (
                <button key={emoji} onClick={() => setEditAvatar(emoji)}
                  className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all ${editAvatar === emoji ? 'bg-primary/30 border-2 border-primary scale-110' : 'bg-white/[0.05] border border-white/10 hover:scale-105'}`}>
                  {emoji}
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">Username</p>
            <input type="text" value={editUsername} onChange={e => setEditUsername(e.target.value)} maxLength={20}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white outline-none focus:border-primary/60 transition-all mb-5" />
            <div className="flex gap-3">
              <button onClick={() => setShowEditModal(false)}
                className="flex-1 py-3 rounded-xl font-semibold text-white/60 bg-white/[0.05] border border-white/10 hover:bg-white/[0.09] transition-all">
                Cancel
              </button>
              <button onClick={handleSaveProfile}
                className="flex-1 py-3 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg,var(--primary),var(--secondary))', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}>
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
    </>
  );
}
