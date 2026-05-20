import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';
import { Trophy, Clock } from 'lucide-react';

export function RecentActivity() {
  const activities = [
    {
      wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      badge: 'Solidity Expert',
      issuer: 'OpenZeppelin',
      time: '2 min ago',
      verified: true,
    },
    {
      wallet: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72',
      badge: 'DeFi Architect',
      issuer: 'Uniswap Labs',
      time: '5 min ago',
      verified: true,
    },
    {
      wallet: '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c',
      badge: 'NFT Developer',
      issuer: 'OpenSea',
      time: '12 min ago',
      verified: true,
    },
    {
      wallet: '0x95cED938F7991cd0dFcb48F0a06a40FA1aF46EBC',
      badge: 'Web3 Security',
      issuer: 'Trail of Bits',
      time: '18 min ago',
      verified: true,
    },
    {
      wallet: '0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C',
      badge: 'Smart Contract Auditor',
      issuer: 'Certik',
      time: '25 min ago',
      verified: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h2
          className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}
        >
          Live Activity
        </h2>
        <p className="text-lg text-muted-foreground">
          Real-time badge claims happening on the network
        </p>
      </div>

      <GlassCard className="p-6" hover={false}>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-primary/20 transition-all duration-200"
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-primary" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <code
                    className="text-sm text-foreground truncate"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {activity.wallet}
                  </code>
                  {activity.verified && (
                    <svg
                      className="w-4 h-4 text-success shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">claimed </span>
                  <span className="text-foreground font-semibold">{activity.badge}</span>
                  <span className="text-muted-foreground"> from </span>
                  <span className="text-secondary">{activity.issuer}</span>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                <Clock className="w-3.5 h-3.5" />
                {activity.time}
              </div>
            </motion.div>
          ))}
        </div>

        {/* View all button */}
        <div className="mt-6 text-center">
          <button className="px-6 py-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-primary/30 text-sm font-semibold transition-all duration-200">
            View All Activity
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
