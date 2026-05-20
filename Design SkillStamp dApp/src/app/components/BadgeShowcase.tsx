import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';
import { CheckCircle2, TrendingUp, Code, Database } from 'lucide-react';

export function BadgeShowcase() {
  const badges = [
    {
      icon: Code,
      title: 'Web3 Developer',
      issuer: 'Ethereum Foundation',
      rarity: 'Legendary',
      holders: 234,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Database,
      title: 'Smart Contract Auditor',
      issuer: 'OpenZeppelin',
      rarity: 'Epic',
      holders: 567,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: TrendingUp,
      title: 'DeFi Expert',
      issuer: 'Uniswap Labs',
      rarity: 'Rare',
      holders: 1203,
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2
          className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}
        >
          Featured Badges
        </h2>
        <p className="text-lg text-muted-foreground">
          Discover the most sought-after skill certifications
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {badges.map((badge, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <GlassCard className="p-6 group">
              <div className="relative mb-6">
                <div
                  className={`w-full aspect-square rounded-xl bg-gradient-to-br ${badge.gradient} flex items-center justify-center relative overflow-hidden`}
                >
                  {/* Hexagon pattern overlay */}
                  <div className="absolute inset-0 opacity-20">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <pattern id={`hex-${index}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path
                          d="M10 0L20 5L20 15L10 20L0 15L0 5Z"
                          fill="white"
                          fillOpacity="0.1"
                          stroke="white"
                          strokeWidth="0.5"
                        />
                      </pattern>
                      <rect width="100" height="100" fill={`url(#hex-${index})`} />
                    </svg>
                  </div>
                  <badge.icon className="w-16 h-16 text-white relative z-10" strokeWidth={1.5} />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold shadow-lg">
                    {badge.rarity}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <h3
                  className="text-xl mb-2 flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
                >
                  {badge.title}
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Issued by <span className="text-foreground font-semibold">{badge.issuer}</span>
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xs text-muted-foreground">{badge.holders} holders</span>
                  <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-semibold transition-all duration-200 border border-white/10 hover:border-primary/30">
                    Claim Badge
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
