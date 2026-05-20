import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Fuel, Lock, Link as LinkIcon } from "lucide-react";
import GlassCard from "../components/GlassCard";
import SuccessOverlay from "../components/SuccessOverlay";
import ErrorOverlay from "../components/ErrorOverlay";
import { useWallet } from "../context/WalletContext";
import { useUGF } from "../hooks/useUGF";

const badges = [
  { id: 1, emoji: "⚛️", category: "Certificate", name: "React Developer", description: "Master React fundamentals and advanced patterns", claimed: false },
  { id: 2, emoji: "🔐", category: "Certificate", name: "Smart Contract Auditor", description: "Security analysis and vulnerability detection", claimed: false },
  { id: 3, emoji: "🎨", category: "Achievement", name: "UI/UX Champion", description: "Created 10+ production-ready designs", claimed: false },
  { id: 4, emoji: "⚡", category: "Event", name: "ETH Denver 2026", description: "Attended and participated in workshops", claimed: false },
  { id: 5, emoji: "🏆", category: "Achievement", name: "Bug Bounty Hunter", description: "Found and reported 5+ critical bugs", claimed: false },
  { id: 6, emoji: "🌐", category: "Certificate", name: "Web3 Developer", description: "Full-stack blockchain application development", claimed: false },
  { id: 7, emoji: "🔗", category: "Special", name: "DeFi Expert", description: "Advanced decentralized finance protocols", claimed: false },
  { id: 8, emoji: "🎯", category: "Achievement", name: "First Contributor", description: "Made your first open-source contribution", claimed: false },
  { id: 9, emoji: "🚀", category: "Event", name: "Hackathon Winner", description: "Won top prize at Web3 hackathon", claimed: false },
];

const categories = ["All", "Event", "Certificate", "Achievement", "Special"];

const ugfSteps = [
  { id: 1, label: "Auth" },
  { id: 2, label: "Quote" },
  { id: 3, label: "Settle" },
  { id: 4, label: "Execute" },
  { id: 5, label: "Done" },
];

export default function ClaimBadge() {
  const { address, signer, connect } = useWallet();
  const { gaslessMint, status, isLoading } = useUGF();
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [claimed, setClaimed] = useState([]);
  const [gasSaved, setGasSaved] = useState(0);

  const filtered = filter === "All" ? badges : badges.filter((b) => b.category === filter);

  async function handleClaim() {
    if (!address) { connect(); return; }
    setClaiming(true);
    try {
      const issuerPrivKey = import.meta.env.VITE_ISSUER_PRIVATE_KEY;
      if (issuerPrivKey) {
        const { ethers } = await import("ethers");
        const issuerWallet = new ethers.Wallet(issuerPrivKey);
        const messageHash = ethers.solidityPackedKeccak256(["address","uint256","uint8"],[address, BigInt(1), 100]);
        const sig = await issuerWallet.signMessage(ethers.getBytes(messageHash));
        await gaslessMint(signer, 1, 100, sig);
      }
      setClaimed((p) => [...p, selected.id]);
      setGasSaved((p) => p + 0.002);
      setShowSuccess(true);
      setSelected(null);
    } catch {
      setShowError(true);
    } finally {
      setClaiming(false);
    }
  }

  const activeStep = status === "authenticating" ? 1 : status === "quoting" ? 2 : status === "settling" ? 3 : status === "executing" ? 4 : status === "done" ? 5 : 0;

  return (
    <div className="min-h-screen">
      <SuccessOverlay show={showSuccess} onClose={() => setShowSuccess(false)}
        title="Badge Claimed! 🎉" subMessage={selected ? `${selected.name} minted gaslessly via UGF` : ""} />
      <ErrorOverlay show={showError} onClose={() => setShowError(false)}
        message="Unable to process your claim. Please try again." />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            style={{ fontFamily: "var(--font-heading)", fontWeight: 800 }}>Claim Badges</h1>
          {gasSaved > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-success/20 border border-success/40">
              <Fuel className="w-4 h-4 text-success" />
              <span className="text-success font-semibold">{gasSaved.toFixed(3)} ETH saved via UGF</span>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((c) => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-5 py-2 rounded-full text-sm transition-all duration-200 ${
                filter === c
                  ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg"
                  : "bg-white/[0.03] border border-white/[0.08] text-muted-foreground hover:text-foreground hover:bg-white/[0.06]"
              }`}>{c}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Badge grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((badge, i) => {
                const isClaimed = claimed.includes(badge.id);
                return (
                  <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}>
                    <GlassCard className={`p-6 relative ${selected?.id === badge.id ? "border-primary/50 shadow-[0_0_30px_rgba(124,58,237,0.3)]" : ""} ${isClaimed ? "opacity-60" : ""}`}
                      onClick={() => !isClaimed && setSelected(badge)}>
                      {isClaimed && (
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-success/20 border border-success/40 text-xs font-bold text-success flex items-center gap-1">
                          ✓ Claimed
                        </div>
                      )}
                      <div className="relative inline-block mb-4">
                        <motion.div className="absolute inset-0 rounded-full blur-2xl"
                          style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)", transform: "scale(1.8)" }}
                          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1.6, 1.9, 1.6] }}
                          transition={{ duration: 3, repeat: Infinity }} />
                        <motion.div className="relative text-5xl" whileHover={{ scale: 1.15, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}>
                          {badge.emoji}
                        </motion.div>
                      </div>
                      <div className="inline-block px-2 py-1 rounded text-xs font-semibold bg-primary/20 text-primary mb-3">
                        {badge.category}
                      </div>
                      <h3 className="text-lg mb-2" style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>{badge.name}</h3>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Claim panel */}
          <div className="lg:col-span-1">
            <AnimatePresence>
              {selected && !claimed.includes(selected.id) && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }} className="sticky top-24">
                  <GlassCard className="p-6" hover={false}>
                    <h3 className="text-xl mb-6" style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>Claim Badge</h3>
                    <div className="text-center mb-6">
                      <div className="text-6xl mb-3">{selected.emoji}</div>
                      <h4 className="text-lg" style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>{selected.name}</h4>
                    </div>
                    <div className="space-y-3 mb-6">
                      {[
                        [Fuel, "Free (Gasless via UGF)"],
                        [Lock, "Soulbound NFT"],
                        [LinkIcon, "Base Sepolia"],
                      ].map(([Icon, text], i) => (
                        <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                          <Icon className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground">{text}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={handleClaim} disabled={claiming || isLoading}
                      className="w-full group px-6 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_4px_20px_rgba(124,58,237,0.35)] relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed">
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <span className="relative">{claiming || isLoading ? "Claiming..." : "Claim Badge"}</span>
                    </button>

                    {/* UGF Status */}
                    {(claiming || isLoading) && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                        <h4 className="text-sm font-semibold mb-4 text-muted-foreground">UGF Transaction Status</h4>
                        <div className="relative">
                          <div className="absolute top-6 left-0 right-0 h-0.5 bg-white/10" />
                          <div className="relative flex justify-between">
                            {ugfSteps.map((step) => (
                              <div key={step.id} className="flex flex-col items-center">
                                <motion.div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 mb-2 ${
                                    step.id < activeStep ? "bg-success border-success" :
                                    step.id === activeStep ? "bg-primary border-primary" :
                                    "bg-white/5 border-white/20"
                                  }`}
                                  animate={step.id === activeStep ? {
                                    scale: [1, 1.1, 1],
                                    boxShadow: ["0 0 0 0 rgba(124,58,237,0.7)", "0 0 0 10px rgba(124,58,237,0)", "0 0 0 0 rgba(124,58,237,0)"],
                                  } : {}}
                                  transition={{ duration: 2, repeat: Infinity }}>
                                  {step.id < activeStep
                                    ? <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    : <span className="text-xs font-bold text-white">{step.id}</span>
                                  }
                                </motion.div>
                                <span className="text-xs text-muted-foreground">{step.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
