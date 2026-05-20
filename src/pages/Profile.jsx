import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Copy, QrCode, ExternalLink, Fuel, Edit2, Check, X } from "lucide-react";
import { QRCodeSVG as QRCode } from "qrcode.react";
import GlassCard from "../components/GlassCard";
import { useReadContract } from "../hooks/useContract";
import { useWallet } from "../context/WalletContext";

const ACHIEVEMENTS = [
  { tier: "Gold",   name: "Perfect Score",     icon: "🎯", color: "#FFD700" },
  { tier: "Gold",   name: "Speed Runner",       icon: "⚡", color: "#FFD700" },
  { tier: "Silver", name: "Streak Master",      icon: "🔥", color: "#C0C0C0" },
  { tier: "Silver", name: "Community Helper",   icon: "🤝", color: "#C0C0C0" },
  { tier: "Bronze", name: "First Steps",        icon: "👣", color: "#CD7F32" },
  { tier: "Bronze", name: "Early Bird",         icon: "🐦", color: "#CD7F32" },
  { tier: "Gold",   name: "Legendary",          icon: "👑", locked: true, color: "#FFD700" },
  { tier: "Silver", name: "Mentor",             icon: "🎓", locked: true, color: "#C0C0C0" },
];

// ── Demo data for the showcase address ───────────────────────────────────────
const SHOWCASE_ADDRESS = "0x0Ac6a801173acb56874251767Ba8ef6023352502";

const DEMO_CERTS = [
  { tokenId: "1", quizId: "1", learner: SHOWCASE_ADDRESS, score: 100, issuedAt: "1747000000", skill: "React", quizTitle: "React Developer", issuer: "0x8Ba1f109551bD432803012645Ac136ddd64DBA72" },
  { tokenId: "2", quizId: "2", learner: SHOWCASE_ADDRESS, score: 95,  issuedAt: "1746900000", skill: "Solidity", quizTitle: "Smart Contract Auditor", issuer: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" },
  { tokenId: "3", quizId: "3", learner: SHOWCASE_ADDRESS, score: 92,  issuedAt: "1746800000", skill: "Web3", quizTitle: "Web3 Developer", issuer: "0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c" },
  { tokenId: "4", quizId: "4", learner: SHOWCASE_ADDRESS, score: 88,  issuedAt: "1746700000", skill: "DeFi", quizTitle: "DeFi Expert", issuer: "0x95cED938F7991cd0dFcb48F0a06a40FA1aF46EBC" },
  { tokenId: "5", quizId: "5", learner: SHOWCASE_ADDRESS, score: 97,  issuedAt: "1746600000", skill: "Security", quizTitle: "Bug Bounty Hunter", issuer: "0x8Ba1f109551bD432803012645Ac136ddd64DBA72" },
  { tokenId: "6", quizId: "6", learner: SHOWCASE_ADDRESS, score: 90,  issuedAt: "1746500000", skill: "UI/UX", quizTitle: "UI/UX Champion", issuer: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" },
  { tokenId: "7", quizId: "7", learner: SHOWCASE_ADDRESS, score: 100, issuedAt: "1746400000", skill: "Event", quizTitle: "ETH Denver 2026", issuer: "0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c" },
  { tokenId: "8", quizId: "8", learner: SHOWCASE_ADDRESS, score: 85,  issuedAt: "1746300000", skill: "Python", quizTitle: "Python Developer", issuer: "0x95cED938F7991cd0dFcb48F0a06a40FA1aF46EBC" },
  { tokenId: "9", quizId: "9", learner: SHOWCASE_ADDRESS, score: 93,  issuedAt: "1746200000", skill: "Blockchain", quizTitle: "Blockchain Beginner", issuer: "0x8Ba1f109551bD432803012645Ac136ddd64DBA72" },
];

const DEMO_ACHIEVEMENTS_UNLOCKED = [
  { tier: "Gold",   name: "Perfect Score",     icon: "🎯", color: "#FFD700" },
  { tier: "Gold",   name: "Speed Runner",       icon: "⚡", color: "#FFD700" },
  { tier: "Gold",   name: "Legendary",          icon: "👑", color: "#FFD700" },
  { tier: "Silver", name: "Streak Master",      icon: "🔥", color: "#C0C0C0" },
  { tier: "Silver", name: "Community Helper",   icon: "🤝", color: "#C0C0C0" },
  { tier: "Silver", name: "Mentor",             icon: "🎓", color: "#C0C0C0" },
  { tier: "Bronze", name: "First Steps",        icon: "👣", color: "#CD7F32" },
  { tier: "Bronze", name: "Early Bird",         icon: "🐦", color: "#CD7F32" },
  { tier: "Special", name: "The Coolest One",   icon: "😎", color: "#06B6D4", special: true },
];
function addressToColor(addr) {
  const hash = addr.slice(2, 8);
  const hue = parseInt(hash, 16) % 360;
  return `hsl(${hue}, 70%, 55%)`;
}

export default function Profile() {
  const { address: paramAddress } = useParams();
  const { address: myAddress } = useWallet();
  const contract = useReadContract();

  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("certificates");
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  // Editable name — stored in localStorage per address
  const storageKey = `zerogas-name-${paramAddress}`;
  const [name, setName] = useState(() => localStorage.getItem(storageKey) || "");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(name);

  const isOwn = myAddress?.toLowerCase() === paramAddress?.toLowerCase();
  const isShowcase = paramAddress?.toLowerCase() === SHOWCASE_ADDRESS.toLowerCase();
  const short = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const profileUrl = `${window.location.origin}/profile/${paramAddress}`;
  const avatarColor = addressToColor(paramAddress);

  useEffect(() => {
    if (paramAddress?.toLowerCase() === SHOWCASE_ADDRESS.toLowerCase()) {
      // Load demo data for showcase address
      setCerts(DEMO_CERTS);
      setLoading(false);
    } else if (contract && paramAddress) {
      loadCerts();
    } else {
      setLoading(false);
    }
  }, [contract, paramAddress]);

  async function loadCerts() {
    try {
      const ids = await contract.getLearnerCertificates(paramAddress);
      const data = await Promise.all(ids.map((id) => contract.certificates(id)));
      setCerts(data);
    } catch { setCerts([]); }
    finally { setLoading(false); }
  }

  function copyLink() {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function saveName() {
    const trimmed = nameInput.trim();
    setName(trimmed);
    localStorage.setItem(storageKey, trimmed);
    setEditingName(false);
    // Notify navbar to update
    window.dispatchEvent(new Event("zerogas-name-updated"));
  }

  function cancelEdit() {
    setNameInput(name);
    setEditingName(false);
  }

  const avgScore = certs.length > 0
    ? Math.round(certs.reduce((s, c) => s + Number(c.score), 0) / certs.length) : 0;
  const totalSaved = (certs.length * 0.002).toFixed(3);
  const unlockedCount = Math.min(certs.length + 2, 6);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* ── Profile Header ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="p-8 mb-6" hover={false}>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">

              {/* Left: Avatar + Info */}
              <div className="flex items-center gap-5">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${avatarColor}, #06B6D4)`,
                      boxShadow: `0 8px 24px ${avatarColor}60`,
                      fontFamily: "var(--font-heading)",
                    }}>
                    {name ? name.slice(0, 2).toUpperCase() : paramAddress.slice(2, 4).toUpperCase()}
                  </div>
                  {isOwn && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success border-2 border-background flex items-center justify-center">
                      <span className="text-[8px] text-white font-bold">✓</span>
                    </div>
                  )}
                </div>

                {/* Name + address */}
                <div>
                  {/* Editable name */}
                  <div className="flex items-center gap-2 mb-1">
                    {editingName ? (
                      <div className="flex items-center gap-2">
                        <input
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") saveName(); if (e.key === "Escape") cancelEdit(); }}
                          placeholder="Enter your name..."
                          autoFocus
                          className="px-3 py-1.5 rounded-lg bg-white/[0.08] border border-primary/40 text-foreground outline-none text-lg font-bold"
                          style={{ fontFamily: "var(--font-heading)", minWidth: "180px" }}
                        />
                        <button onClick={saveName} className="w-7 h-7 rounded-full bg-success/20 border border-success/40 flex items-center justify-center hover:bg-success/30 transition-all">
                          <Check className="w-3.5 h-3.5 text-success" />
                        </button>
                        <button onClick={cancelEdit} className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all">
                          <X className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-extrabold text-foreground"
                          style={{ fontFamily: "var(--font-heading)" }}>
                          {name || short(paramAddress)}
                        </h1>
                        {isOwn && (
                          <button onClick={() => { setNameInput(name); setEditingName(true); }}
                            className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/[0.10] flex items-center justify-center hover:border-primary/40 hover:bg-primary/10 transition-all"
                            title="Edit name">
                            <Edit2 className="w-3 h-3 text-muted-foreground" />
                          </button>
                        )}
                        {isOwn && (
                          <span className="px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold">
                            ✦ You
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Full address */}
                  <code className="text-xs text-muted-foreground block mb-2"
                    style={{ fontFamily: "var(--font-mono)" }}>
                    {paramAddress}
                  </code>

                  {/* Badges row */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full bg-secondary/15 border border-secondary/25 text-secondary text-xs font-semibold">
                      ⛓️ Base Sepolia
                    </span>
                    {certs.length > 0 && (
                      <span className="px-2.5 py-1 rounded-full bg-success/15 border border-success/25 text-success text-xs font-semibold">
                        🏅 {certs.length} Cert{certs.length !== 1 ? "s" : ""}
                      </span>
                    )}
                    {certs.some((c) => Number(c.score) === 100) && (
                      <span className="px-2.5 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/25 text-yellow-400 text-xs font-semibold">
                        💯 Perfect Score
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Action buttons */}
              <div className="flex flex-wrap gap-2">
                <button onClick={copyLink}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.10] border border-white/10 hover:border-primary/30 text-sm font-semibold transition-all flex items-center gap-2 text-foreground">
                  <Copy className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy Link"}
                </button>
                <button onClick={() => setShowQR(!showQR)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.10] border border-white/10 hover:border-primary/30 text-sm font-semibold transition-all flex items-center gap-2 text-foreground">
                  <QrCode className="w-4 h-4" />
                  QR Code
                </button>
                <button
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check my Web3 profile on ZeroGas! ${profileUrl}`)}`, "_blank")}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.10] border border-white/10 hover:border-primary/30 text-sm font-semibold transition-all text-foreground">
                  𝕏 Share
                </button>
                <a href={`https://sepolia.basescan.org/address/${paramAddress}`} target="_blank" rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.10] border border-white/10 hover:border-primary/30 text-sm font-semibold transition-all flex items-center gap-2 text-foreground">
                  BaseScan <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* QR Panel */}
            <AnimatePresence>
              {showQR && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }} className="mt-6 pt-6 border-t border-white/[0.08]">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-white rounded-2xl">
                      <QRCode value={profileUrl} size={160} bgColor="#ffffff" fgColor="#6D28D9" level="H" />
                    </div>
                    <code className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
                      {profileUrl}
                    </code>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </motion.div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            ["🏅", "Certificates", certs.length],
            ["🎯", "Skills", new Set(certs.map((c) => c.skill)).size],
            ["📊", "Avg Score", `${avgScore}%`],
            ["🏆", "Achievements", unlockedCount],
          ].map(([icon, label, val], i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}>
              <GlassCard className="p-5 text-center">
                <div className="text-2xl mb-2">{icon}</div>
                <div className="text-3xl font-extrabold mb-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                  style={{ fontFamily: "var(--font-heading)" }}>{val}</div>
                <div className="text-xs text-muted-foreground font-medium">{label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Gas savings */}
        {certs.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 border border-success/20">
              <Fuel className="w-4 h-4 text-success" />
              <span className="text-success font-semibold text-sm">
                {totalSaved} ETH saved in gas fees via UGF
              </span>
            </div>
          </motion.div>
        )}

        {/* ── Tabs ── */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit">
          {[["certificates", "🏅 Certificates", certs.length], ["achievements", "🏆 Achievements", isShowcase ? DEMO_ACHIEVEMENTS_UNLOCKED.length : unlockedCount]].map(([tab, label, count]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}>
              {label}
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                activeTab === tab ? "bg-white/20" : "bg-white/[0.06]"
              }`}>{count}</span>
            </button>
          ))}
        </div>

        {/* ── Certificates ── */}
        {activeTab === "certificates" && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-16 text-muted-foreground">Loading certificates...</div>
            ) : certs.length === 0 ? (
              <GlassCard className="p-12 text-center" hover={false}>
                <div className="text-5xl mb-4">🎓</div>
                <h3 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  No certificates yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  {isOwn ? "Claim your first badge to get started!" : "This wallet hasn't earned any certificates yet."}
                </p>
                {isOwn && (
                  <Link to="/badges"
                    className="inline-flex px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold hover:-translate-y-0.5 transition-all shadow-[0_4px_16px_rgba(124,58,237,0.35)]">
                    Claim a Badge →
                  </Link>
                )}
              </GlassCard>
            ) : (
              certs.map((cert, i) => (
                <motion.div key={cert.tokenId?.toString() || i}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }} whileHover={{ x: 4 }}>
                  <GlassCard className="p-6 relative overflow-hidden">
                    {/* Top gradient line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px]"
                      style={{ background: "linear-gradient(90deg, #7C3AED, #06B6D4)" }} />
                    <div className="flex items-center gap-5">
                      {/* Medal */}
                      <div className="relative shrink-0">
                        <div className="absolute inset-0 blur-xl opacity-40 rounded-full"
                          style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }} />
                        <div className="relative text-4xl">🏅</div>
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-foreground mb-1"
                          style={{ fontFamily: "var(--font-heading)" }}>
                          {cert.quizTitle || cert.skill}
                        </h3>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-xs font-semibold">{cert.skill}</span>
                          <code className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
                            by {cert.issuer?.slice(0,6)}...{cert.issuer?.slice(-4)}
                          </code>
                          <span className="text-xs text-muted-foreground">
                            {new Date(Number(cert.issuedAt) * 1000).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {/* Score */}
                      <div className="text-right shrink-0">
                        <div className="text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                          style={{ fontFamily: "var(--font-heading)" }}>
                          {cert.score?.toString()}%
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Score</div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* ── Achievements ── */}
        {activeTab === "achievements" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(isShowcase ? DEMO_ACHIEVEMENTS_UNLOCKED : ACHIEVEMENTS).map((a, i) => {
              const unlocked = isShowcase ? true : (!a.locked && i < unlockedCount);
              return (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }} whileHover={unlocked ? { scale: 1.04, y: -4 } : {}}>
                  <GlassCard
                    className={`p-6 text-center relative overflow-hidden ${!unlocked ? "opacity-40 grayscale" : ""}`}
                    style={unlocked ? { border: `2px solid ${a.color}50`, boxShadow: `0 0 24px ${a.color}30` } : {}}
                    hover={false}>
                    {/* Special badge glow */}
                    {a.special && (
                      <div className="absolute inset-0 opacity-10"
                        style={{ background: `radial-gradient(circle at center, ${a.color}, transparent)` }} />
                    )}
                    <div className="text-4xl mb-3 relative">{!unlocked ? "🔒" : a.icon}</div>
                    <div className="text-xs font-bold mb-1 uppercase tracking-wide"
                      style={unlocked ? { color: a.color } : { color: "var(--muted-foreground)" }}>
                      {a.tier}
                    </div>
                    <div className="text-sm font-semibold text-foreground">{a.name}</div>
                    {unlocked && (
                      <div className="mt-2 text-xs text-success">✓ Unlocked</div>
                    )}
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-xs text-muted-foreground">
            🔗 Publicly verifiable on Base Sepolia ·{" "}
            <a href={`https://sepolia.basescan.org/address/${paramAddress}`} target="_blank" rel="noreferrer"
              className="text-secondary hover:underline">
              View on BaseScan ↗
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
