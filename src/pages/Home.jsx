import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Zap, Users, Award, Send, ArrowRight, TrendingUp, Star } from "lucide-react";
import GlassCard from "../components/GlassCard";
import { useWallet } from "../context/WalletContext";
import { useState } from "react";

// ── Quick Pay Modal ───────────────────────────────────────────────────────────
function QuickPayModal({ onClose }) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

  function handleSend() {
    if (!to || !amount) return;
    navigate(`/payment?to=${to}&amount=${amount}`);
    onClose();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9990] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 30 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm"
      >
        <GlassCard className="p-6" hover={false}>
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Send className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm" style={{ fontFamily: "var(--font-heading)" }}>Quick Send</h3>
                <p className="text-xs text-success">⛽ Gasless via UGF</p>
              </div>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-muted-foreground text-xs transition-all">✕</button>
          </div>

          {/* Inputs */}
          <div className="space-y-3 mb-4">
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Recipient address (0x...)"
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] focus:border-primary/50 text-foreground placeholder:text-muted-foreground outline-none text-xs transition-all"
              style={{ fontFamily: "var(--font-mono)" }}
            />
            <div className="relative">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                type="number"
                min="0"
                className="w-full px-3 py-2.5 pr-12 rounded-xl bg-white/[0.05] border border-white/[0.08] focus:border-primary/50 text-foreground placeholder:text-muted-foreground outline-none text-sm font-bold transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-semibold">TYI</span>
            </div>
            {/* Presets */}
            <div className="flex gap-2">
              {["5", "10", "25", "50"].map((a) => (
                <button key={a} onClick={() => setAmount(a)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    amount === a
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
                      : "bg-white/[0.04] border border-white/[0.08] text-muted-foreground hover:text-foreground"
                  }`}>{a}</button>
              ))}
            </div>
          </div>

          <button onClick={handleSend} disabled={!to || !amount}
            className="group w-full py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all shadow-[0_4px_16px_rgba(124,58,237,0.4)] relative overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed">
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <Send className="w-4 h-4 relative" />
            <span className="relative">Send Gaslessly</span>
          </button>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}

// ── Main Home ─────────────────────────────────────────────────────────────────
export default function Home() {
  const { connect, address } = useWallet();
  const [showPay, setShowPay] = useState(false);

  const features = [
    { icon: Shield, title: "Blockchain Verified", description: "Immutable proof of skills stored on-chain" },
    { icon: Zap, title: "Gasless Minting", description: "Zero transaction fees via UGF" },
    { icon: Users, title: "Trusted Issuers", description: "Verified organizations issue certifications" },
    { icon: Award, title: "NFT Credentials", description: "Own achievements as soulbound NFTs" },
  ];

  const recentActivity = [
    { emoji: "⚛️", name: "0x8Ba1...BA72", action: "claimed React Developer", time: "2m ago" },
    { emoji: "🔐", name: "0x742d...bEb", action: "minted Smart Contract cert", time: "5m ago" },
    { emoji: "🚀", name: "0x5A0b...c4c", action: "claimed Hackathon Winner", time: "8m ago" },
    { emoji: "⚡", name: "0x95cE...EBC", action: "sent 25 TYI gaslessly", time: "12m ago" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <AnimatePresence>
        {showPay && <QuickPayModal onClose={() => setShowPay(false)} />}
      </AnimatePresence>

      {/* ── Hero ── */}
      <div className="text-center mb-20">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/20 text-sm font-semibold mb-6 text-primary dark:text-secondary"
            animate={{ boxShadow: ["0 0 0 0 rgba(124,58,237,0.3)", "0 0 0 8px rgba(124,58,237,0)", "0 0 0 0 rgba(124,58,237,0)"] }}
            transition={{ duration: 2.5, repeat: Infinity }}>
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Built on Base Sepolia · Powered by UGF
          </motion.span>

          <h1 className="text-6xl md:text-7xl lg:text-8xl mb-6 leading-tight"
            style={{ fontFamily: "var(--font-heading)", fontWeight: 800 }}>
            <motion.span
              className="bg-gradient-to-r from-primary via-glow to-secondary bg-clip-text text-transparent"
              style={{ backgroundSize: "200% 200%" }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 4, repeat: Infinity }}>
              Prove Your Skills
            </motion.span>
            <br />
            <span className="text-foreground">On-Chain</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Earn, own, and showcase verified credentials as blockchain-backed NFTs — completely gasless via UGF.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/badges"
              className="group px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg flex items-center gap-2 hover:-translate-y-1 transition-all shadow-[0_4px_24px_rgba(124,58,237,0.4)] hover:shadow-[0_8px_32px_rgba(124,58,237,0.6)] relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="relative">Start Claiming</span>
              <ArrowRight className="w-5 h-5 relative" />
            </Link>
            <Link to="/leaderboard"
              className="px-8 py-4 rounded-full border-2 border-primary text-primary dark:text-white hover:bg-primary/10 font-bold text-lg transition-all">
              Explore Leaderboard
            </Link>
            {/* Quick Pay button */}
            <motion.button
              onClick={() => setShowPay(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-full bg-white/[0.05] border border-white/[0.12] hover:border-success/40 text-foreground font-bold text-lg flex items-center gap-2 transition-all hover:bg-success/10">
              <Send className="w-5 h-5 text-success" />
              Quick Pay
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ── Feature cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
        {features.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}>
            <GlassCard className="p-6 group">
              <motion.div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4"
                style={{ boxShadow: "0 4px 16px rgba(124,58,237,0.25)" }}
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.4 }}>
                <f.icon className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="text-base mb-2 text-foreground" style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.description}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* ── Stats + Live Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
        {/* Stats */}
        <div className="lg:col-span-2">
          <GlassCard className="p-8" hover={false}>
            <div className="grid grid-cols-3 gap-6 text-center">
              {[["12.5K", "Badges Issued", TrendingUp], ["450+", "Trusted Issuers", Users], ["98%", "Verification Rate", Star]].map(([val, label, Icon], i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}>
                  <div className="text-4xl md:text-5xl mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                    style={{ fontFamily: "var(--font-heading)", fontWeight: 800 }}>{val}</div>
                  <div className="text-muted-foreground text-sm flex items-center justify-center gap-1">
                    <Icon className="w-3 h-3" />{label}
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Quick Pay card */}
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <GlassCard className="p-6 h-full flex flex-col justify-between cursor-pointer"
            onClick={() => setShowPay(true)}
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))", borderColor: "rgba(124,58,237,0.25)" }}>
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4"
                style={{ boxShadow: "0 4px 16px rgba(124,58,237,0.4)" }}>
                <Send className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>Quick Pay</h3>
              <p className="text-muted-foreground text-sm mb-4">Send Mock USD to any wallet. Gasless via UGF — no ETH needed.</p>
              <div className="flex items-center gap-2 text-xs text-success font-semibold">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                ⛽ Zero gas fees
              </div>
            </div>
            <motion.div
              className="mt-4 flex items-center gap-2 text-primary font-semibold text-sm"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}>
              Send now <ArrowRight className="w-4 h-4" />
            </motion.div>
          </GlassCard>
        </motion.div>
      </div>

      {/* ── Live Activity Feed ── */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            Live Activity
          </h2>
          <span className="flex items-center gap-2 text-xs text-success font-semibold px-3 py-1 rounded-full bg-success/10 border border-success/20">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Live
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recentActivity.map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ x: 4 }}>
              <GlassCard className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{item.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold" style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>{item.name}</span>
                      {" "}<span className="text-muted-foreground">{item.action}</span>
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── UGF Flow ── */}
      <div className="text-center mb-4">
        <h2 className="text-3xl md:text-4xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          style={{ fontFamily: "var(--font-heading)", fontWeight: 800 }}>Why No ETH?</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          UGF removes the gas barrier — pay in Mock USD, UGF sponsors the ETH.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {["You Sign", "UGF Routes", "Action On-Chain"].map((step, i) => (
            <div key={i} className="flex items-center gap-4">
              <motion.div
                className={`px-6 py-3 rounded-xl font-semibold text-sm border ${
                  i === 1
                    ? "bg-gradient-to-r from-primary to-secondary text-white border-transparent"
                    : "bg-white/[0.03] border-white/[0.08] text-foreground"
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                style={i === 1 ? { boxShadow: "0 4px 20px rgba(124,58,237,0.4)" } : {}}>
                {step}
              </motion.div>
              {i < 2 && (
                <motion.span className="text-muted-foreground text-xl"
                  animate={{ x: [0, 4, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}>
                  →
                </motion.span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
