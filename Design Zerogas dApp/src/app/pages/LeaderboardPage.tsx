import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { ExternalLink } from 'lucide-react';

const topThree = [
  { rank: 2, wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', score: 9500, medal: '🥈', color: '#C0C0C0' },
  { rank: 1, wallet: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72', score: 9850, medal: '🥇', color: '#FFD700' },
  { rank: 3, wallet: '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c', score: 9200, medal: '🥉', color: '#CD7F32' },
];

const leaderboardData = [
  { rank: 1, wallet: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72', score: 9850, date: '2026-05-15' },
  { rank: 2, wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', score: 9500, date: '2026-05-14' },
  { rank: 3, wallet: '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c', score: 9200, date: '2026-05-13' },
  { rank: 4, wallet: '0x95cED938F7991cd0dFcb48F0a06a40FA1aF46EBC', score: 8900, date: '2026-05-12' },
  { rank: 5, wallet: '0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C', score: 8750, date: '2026-05-11' },
  { rank: 6, wallet: '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE', score: 8600, date: '2026-05-10' },
  { rank: 7, wallet: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', score: 8450, date: '2026-05-09' },
  { rank: 8, wallet: '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8', score: 8300, date: '2026-05-08' },
  { rank: 9, wallet: '0xDA9dfA130Df4dE4673b89022EE50ff26f6EA73Cf', score: 8150, date: '2026-05-07' },
  { rank: 10, wallet: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1', score: 8000, date: '2026-05-06' },
];

export function LeaderboardPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}
          >
            Leaderboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Top skill earners on the platform
          </p>
        </div>

        {/* Podium */}
        <div className="grid grid-cols-3 gap-4 mb-16 max-w-4xl mx-auto">
          {[topThree[0], topThree[1], topThree[2]].map((user, index) => (
            <motion.div
              key={user.rank}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`${index === 1 ? 'order-2' : index === 0 ? 'order-1' : 'order-3'}`}
            >
              <div className="relative">
                {/* Podium Bar */}
                <div
                  className={`rounded-t-2xl p-6 text-center transition-all duration-300 ${
                    index === 1 ? 'h-64' : 'h-48 mt-16'
                  }`}
                  style={{
                    background: `linear-gradient(180deg, ${user.color}40 0%, ${user.color}10 100%)`,
                    border: `2px solid ${user.color}`,
                    boxShadow: `0 0 30px ${user.color}50`,
                  }}
                >
                  <div className="text-6xl mb-3">{user.medal}</div>
                  <div
                    className="text-3xl mb-2"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 800,
                      background: `linear-gradient(135deg, ${user.color} 0%, #FFFFFF 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    #{user.rank}
                  </div>
                  <code
                    className="text-xs block mb-2 truncate"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {user.wallet.slice(0, 6)}...{user.wallet.slice(-4)}
                  </code>
                  <div
                    className="text-2xl"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 800,
                      background: 'linear-gradient(90deg, #7C3AED 0%, #06B6D4 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {user.score.toLocaleString()}
                  </div>
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                    Learner
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                    Score
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                    Verify
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((entry, index) => (
                  <motion.tr
                    key={entry.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`border-b border-white/[0.05] transition-all duration-200 hover:bg-primary/10 ${
                      entry.rank <= 3 ? 'bg-primary/5' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div
                        className="text-lg font-bold"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        #{entry.rank}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code
                        className="text-sm"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {entry.wallet}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Animated score bar */}
                        <div className="flex-1 h-2 bg-white/[0.05] rounded-full overflow-hidden max-w-xs">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: 'linear-gradient(90deg, #7C3AED 0%, #06B6D4 100%)',
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(entry.score / 10000) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.05 }}
                          />
                        </div>
                        <span
                          className="text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          {entry.score.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">{entry.date}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="flex items-center gap-1 text-sm text-secondary hover:text-secondary/80 transition-colors">
                        Verify
                        <ExternalLink className="w-3 h-3" />
                      </button>
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
