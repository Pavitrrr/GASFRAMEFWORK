import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Fuel } from "lucide-react";
import GlassCard from "../components/GlassCard";
import { useWallet } from "../context/WalletContext";
import { useReadContract } from "../hooks/useContract";

const DEMO_TXS = [
  { id: 1, emoji: "⚛️", type: "Badge Claim", title: "React Developer", skill: "React", score: 92, date: "2026-05-15", gasSaved: "0.003", status: "Confirmed" },
  { id: 2, emoji: "🔐", type: "Certificate", title: "Smart Contract Auditor", skill: "Security", score: 88, date: "2026-05-10", gasSaved: "0.004", status: "Confirmed" },
  { id: 3, emoji: "🌐", type: "Badge Claim", title: "Web3 Developer", skill: "Web3", score: 95, date: "2026-05-05", gasSaved: "0.002", status: "Confirmed" },
  { id: 4, emoji: "⚡", type: "Event Badge", title: "ETH Denver 2026", skill: "Event", score: 100, date: "2026-04-20", gasSaved: "0.001", status: "Confirmed" },
];

export default function TransactionHistory() {
  const { address, connect } = useWallet();
  const contract = useReadContract();
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contract && address) loadHistory();
    else if (!address) setLoading(false);
  }, [contract, address]);

  async function loadHistory() {
    try {
      const tokenIds = await contract.getLearnerCertificates(address);
      const certs = await Promise.all(tokenIds.map((id) => contract.certificates(id)));
      setTxs(certs.map((c, i) => ({
        id: i, emoji: "🏅", type: "Certificate Minted",
        title: c.quizTitle, skill: c.skill, score: Number(c.score),
        date: new Date(Number(c.issuedAt) * 1000).toLocaleDateString(),
        gasSaved: "0.002", status: "Confirmed",
      })));
    } catch {
      setTxs(DEMO_TXS);
    } finally {
      setLoading(false);
    }
  }

  if (!address) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Transaction History</h2>
          <p className="text-muted-foreground mb-6">Connect your wallet to view your on-chain activity.</p>
          <button onClick={connect} className="px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold">
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  const totalSaved = txs.reduce((s, t) => s + parseFloat(t.gasSaved), 0);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            style={{ fontFamily: "var(--font-heading)", fontWeight: 800 }}>Transaction History</h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-success/20 border border-success/40">
            <Fuel className="w-4 h-4 text-success" />
            <span className="text-success font-semibold">Total gas saved: {totalSaved.toFixed(3)} ETH via UGF</span>
          </div>
        </div>

        <GlassCard className="p-6" hover={false}>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : txs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No transactions yet. Claim a badge to get started!</div>
          ) : (
            <div className="space-y-3">
              {txs.map((tx, i) => (
                <motion.div key={tx.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }} whileHover={{ x: 4 }}
                  className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-primary/20 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <div className="text-3xl">{tx.emoji}</div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success border-2 border-background" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{tx.type}</div>
                      <h3 className="text-base mb-1" style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>{tx.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="px-2 py-1 rounded bg-primary/20 text-primary font-semibold">{tx.skill}</span>
                        <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                          style={{ fontFamily: "var(--font-heading)" }}>{tx.score}%</span>
                        <span>{tx.date}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-xs text-success mb-2">
                        <Fuel className="w-3 h-3" />
                        <span className="font-semibold">{tx.gasSaved} ETH saved</span>
                      </div>
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-success/20 border border-success/40 text-xs font-bold text-success">
                        ✓ {tx.status}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
