import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import GlassCard from "../components/GlassCard";
import { useReadContract } from "../hooks/useContract";

const DEMO_DATA = [
  { rank: 1, wallet: "0x8Ba1f109551bD432803012645Ac136ddd64DBA72", score: 9850, date: "2026-05-15", medal: "🥇", color: "#FFD700" },
  { rank: 2, wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", score: 9500, date: "2026-05-14", medal: "🥈", color: "#C0C0C0" },
  { rank: 3, wallet: "0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", score: 9200, date: "2026-05-13", medal: "🥉", color: "#CD7F32" },
  { rank: 4, wallet: "0x95cED938F7991cd0dFcb48F0a06a40FA1aF46EBC", score: 8900, date: "2026-05-12", medal: "#4", color: "#7C3AED" },
  { rank: 5, wallet: "0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C", score: 8750, date: "2026-05-11", medal: "#5", color: "#7C3AED" },
];

export default function Leaderboard() {
  const { quizId } = useParams();
  const contract = useReadContract();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contract && quizId) {
      loadLeaderboard();
    } else {
      setEntries(DEMO_DATA);
      setLoading(false);
    }
  }, [contract, quizId]);

  async function loadLeaderboard() {
    try {
      const board = await contract.getQuizLeaderboard(quizId);
      const sorted = [...board].sort((a, b) => Number(b.score) - Number(a.score));
      setEntries(sorted.map((e, i) => ({
        rank: i + 1,
        wallet: e.learner,
        score: Number(e.score) * 100,
        date: new Date(Number(e.issuedAt) * 1000).toLocaleDateString(),
        medal: i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i+1}`,
        color: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "#7C3AED",
      })));
    } catch {
      setEntries(DEMO_DATA);
    } finally {
      setLoading(false);
    }
  }

  const short = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const top3 = [entries[1], entries[0], entries[2]].filter(Boolean);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            style={{ fontFamily: "var(--font-heading)", fontWeight: 800 }}>Leaderboard</h1>
          <p className="text-lg text-muted-foreground">Top skill earners on the platform</p>
        </div>

        {/* Podium */}
        {entries.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-16 max-w-2xl mx-auto">
            {top3.map((user, i) => (
              <motion.div key={user.rank} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}>
                <div className={`rounded-t-2xl p-6 text-center ${i === 1 ? "h-64" : "h-48 mt-16"}`}
                  style={{
                    background: `linear-gradient(180deg, ${user.color}40 0%, ${user.color}10 100%)`,
                    border: `2px solid ${user.color}`,
                    boxShadow: `0 0 30px ${user.color}50`,
                  }}>
                  <div className="text-5xl mb-2">{user.medal}</div>
                  <div className="text-2xl mb-2" style={{ fontFamily: "var(--font-heading)", fontWeight: 800,
                    background: `linear-gradient(135deg, ${user.color} 0%, #FFFFFF 100%)`,
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    #{user.rank}
                  </div>
                  <code className="text-xs block mb-2 text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
                    {short(user.wallet)}
                  </code>
                  <div className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                    style={{ fontFamily: "var(--font-heading)" }}>
                    {user.score.toLocaleString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Table */}
        <GlassCard hover={false} className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  {["Rank", "Learner", "Score", "Date", "Verify"].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">Loading...</td></tr>
                ) : entries.map((entry, i) => (
                  <motion.tr key={entry.rank} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className={`border-b border-white/[0.05] transition-all duration-200 hover:bg-primary/10 ${entry.rank <= 3 ? "bg-primary/5" : ""}`}>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                        {entry.rank <= 3 ? entry.medal : `#${entry.rank}`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm text-foreground" style={{ fontFamily: "var(--font-mono)" }}>
                        {entry.wallet}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-white/[0.05] rounded-full overflow-hidden max-w-[120px]">
                          <motion.div className="h-full rounded-full"
                            style={{ background: "linear-gradient(90deg, #7C3AED 0%, #06B6D4 100%)" }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(entry.score / 10000) * 100}%` }}
                            transition={{ duration: 1, delay: i * 0.05 }} />
                        </div>
                        <span className="text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                          style={{ fontFamily: "var(--font-heading)" }}>
                          {entry.score.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{entry.date}</td>
                    <td className="px-6 py-4">
                      <a href={`https://sepolia.basescan.org/address/${entry.wallet}`} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-sm text-secondary hover:text-secondary/80 transition-colors">
                        Verify <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
