import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { Fuel } from 'lucide-react';

const transactions = [
  {
    id: 1,
    emoji: '⚛️',
    type: 'Badge Claim',
    title: 'React Developer',
    skill: 'React',
    score: 92,
    date: '2026-05-15',
    gasSaved: '0.003',
    status: 'Confirmed',
  },
  {
    id: 2,
    emoji: '🔐',
    type: 'Certificate Issue',
    title: 'Smart Contract Auditor',
    skill: 'Security',
    score: 88,
    date: '2026-05-10',
    gasSaved: '0.004',
    status: 'Confirmed',
  },
  {
    id: 3,
    emoji: '🌐',
    type: 'Badge Claim',
    title: 'Web3 Developer',
    skill: 'Web3',
    score: 95,
    date: '2026-05-05',
    gasSaved: '0.002',
    status: 'Confirmed',
  },
  {
    id: 4,
    emoji: '🎨',
    type: 'Achievement',
    title: 'UI/UX Champion',
    skill: 'Design',
    score: 90,
    date: '2026-05-01',
    gasSaved: '0.002',
    status: 'Confirmed',
  },
  {
    id: 5,
    emoji: '🔗',
    type: 'Certificate Issue',
    title: 'DeFi Expert',
    skill: 'DeFi',
    score: 85,
    date: '2026-04-28',
    gasSaved: '0.003',
    status: 'Confirmed',
  },
  {
    id: 6,
    emoji: '🏆',
    type: 'Achievement',
    title: 'Bug Bounty Hunter',
    skill: 'Security',
    score: 87,
    date: '2026-04-25',
    gasSaved: '0.002',
    status: 'Confirmed',
  },
  {
    id: 7,
    emoji: '⚡',
    type: 'Event Badge',
    title: 'ETH Denver 2026',
    skill: 'Event',
    score: 100,
    date: '2026-04-20',
    gasSaved: '0.001',
    status: 'Confirmed',
  },
  {
    id: 8,
    emoji: '🎯',
    type: 'Achievement',
    title: 'First Contributor',
    skill: 'Community',
    score: 75,
    date: '2026-04-15',
    gasSaved: '0.002',
    status: 'Confirmed',
  },
];

export function TransactionHistoryPage() {
  const totalGasSaved = transactions.reduce((acc, tx) => acc + parseFloat(tx.gasSaved), 0);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}
          >
            Transaction History
          </h1>

          {/* Total gas savings badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-success/20 border border-success/40">
            <Fuel className="w-4 h-4 text-success" />
            <span className="text-success font-semibold">
              Total gas saved: {totalGasSaved.toFixed(3)} ETH via UGF
            </span>
          </div>
        </div>

        {/* Transaction List */}
        <GlassCard className="p-6" hover={false}>
          <div className="space-y-3">
            {transactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ x: 4 }}
                className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-primary/20 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* Icon with status dot */}
                  <div className="relative shrink-0">
                    <div className="text-3xl">{tx.emoji}</div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success border-2 border-background" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {tx.type}
                      </span>
                    </div>
                    <h3
                      className="text-base mb-1"
                      style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
                    >
                      {tx.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="px-2 py-1 rounded bg-primary/20 text-primary font-semibold">
                        {tx.skill}
                      </span>
                      <span
                        className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {tx.score}%
                      </span>
                      <span>{tx.date}</span>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-xs text-success mb-2">
                      <Fuel className="w-3 h-3" />
                      <span className="font-semibold">{tx.gasSaved} ETH saved</span>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-success/20 border border-success/40 text-xs font-bold text-success">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {tx.status}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
