import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { ExternalLink, Loader2 } from 'lucide-react';
import { fetchLeaderboard, isContractDeployed, type LeaderboardEntry } from '../hooks/useContract';

const MEDALS = ['🥈', '🥇', '🥉'];
const COLORS = ['#C0C0C0', '#FFD700', '#CD7F32'];

export function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard().then(d => { setData(d); setLoading(false); });
  }, []);

  const podium = [
    data.find(e => e.rank === 2),
    data.find(e => e.rank === 1),
    data.find(e => e.rank === 3),
  ].filter(Boolean) as LeaderboardEntry[];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
            Leaderboard
          </h1>
          <p className="text-lg text-muted-foreground">Top skill earners on Base Sepolia</p>
          {isContractDeployed() && (
            <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-lg bg-green-500/15 border border-green-500/30 text-xs font-bold text-green-400">
              ✅ Live on-chain data
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Podium */}
            <div className="grid grid-cols-3 gap-4 mb-16 max-w-4xl mx-auto">
              {podium.map((user, i) => (
                <motion.div key={user.rank} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.1 }}>
                  <div className={`rounded-t-2xl p-6 text-center ${i === 1 ? 'h-64' : 'h-48 mt-16'}`}
                    style={{ background: `linear-gradient(180deg, ${COLORS[i]}40 0%, ${COLORS[i]}10 100%)`, border: `2px solid ${COLORS[i]}`, boxShadow: `0 0 30px ${COLORS[i]}50` }}>
                    <div className="text-6xl mb-3">{MEDALS[i]}</div>
                    <div className="text-3xl mb-2" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, background: `linear-gradient(135deg, ${COLORS[i]} 0%, #FFFFFF 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      #{user.rank}
                    </div>
                    <code className="text-xs block mb-2 truncate" style={{ fontFamily: 'var(--font-mono)' }}>
                      {user.wallet.slice(0,6)}...{user.wallet.slice(-4)}
                    </code>
                    <div className="text-2xl" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, background: 'linear-gradient(90deg, #7C3AED 0%, #06B6D4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {user.score.toLocaleString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Full Table */}
            <GlassCard className="overflow-hidden" hover={false}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.08]">
                      {['Rank','Learner','Score','Certs','Date','Verify'].map(h => (
                        <th key={h} className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((entry, i) => (
                      <motion.tr key={entry.rank} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}
                        className={`border-b border-white/[0.05] transition-all duration-200 hover:bg-primary/10 ${entry.rank <= 3 ? 'bg-primary/5' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>#{entry.rank}</div>
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
                            {entry.wallet.slice(0,6)}...{entry.wallet.slice(-4)}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-white/[0.05] rounded-full overflow-hidden max-w-xs">
                              <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #7C3AED 0%, #06B6D4 100%)' }}
                                initial={{ width: 0 }} animate={{ width: `${(entry.score / 10000) * 100}%` }} transition={{ duration: 1, delay: i * 0.05 }} />
                            </div>
                            <span className="text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-heading)' }}>
                              {entry.score.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold">{entry.certificates}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">{entry.date}</span>
                        </td>
                        <td className="px-6 py-4">
                          <a href={`https://sepolia.basescan.org/address/${entry.wallet}`} target="_blank" rel="noopener noreferrer"
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
          </>
        )}
      </div>
    </div>
  );
}
