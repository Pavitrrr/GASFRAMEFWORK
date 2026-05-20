import { motion } from 'motion/react';
import { Shield, Zap, Users, Award } from 'lucide-react';
import { GlassCard } from './GlassCard';

export function Hero() {
  const features = [
    {
      icon: Shield,
      title: 'Blockchain Verified',
      description: 'Immutable proof of skills stored on-chain',
    },
    {
      icon: Zap,
      title: 'Gasless Minting',
      description: 'Zero transaction fees for claiming badges',
    },
    {
      icon: Users,
      title: 'Trusted Issuers',
      description: 'Verified organizations issue certifications',
    },
    {
      icon: Award,
      title: 'NFT Credentials',
      description: 'Own your achievements as unique NFTs',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* Hero Section */}
      <div className="text-center mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 text-primary dark:text-secondary border border-primary/20 dark:border-secondary/20 text-sm font-semibold mb-6">
            Revolutionizing Skill Verification
          </span>
          <h1
            className="text-6xl md:text-7xl lg:text-8xl mb-6 bg-gradient-to-r from-primary via-glow to-secondary bg-clip-text text-transparent leading-tight"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}
          >
            Prove Your Skills
            <br />
            On-Chain
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
            SkillStamp is the future of professional certification. Earn, own, and showcase verified
            credentials as blockchain-backed NFTs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold text-lg flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_4px_20px_rgba(124,58,237,0.35)] hover:shadow-[0_6px_24px_rgba(124,58,237,0.45)] relative overflow-hidden">
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="relative">Start Claiming</span>
              <svg
                className="w-5 h-5 relative"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
            <button className="px-8 py-4 rounded-full bg-transparent border-2 border-primary text-primary dark:text-primary-foreground hover:bg-primary/10 font-bold text-lg transition-all duration-200">
              Explore Badges
            </button>
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <GlassCard className="p-6">
              <div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4"
                style={{
                  boxShadow: '0 4px 20px rgba(124, 58, 237, 0.3)',
                }}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg mb-2" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Stats Section */}
      <GlassCard className="p-8" hover={false}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div
              className="text-5xl mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}
            >
              12.5K
            </div>
            <div className="text-muted-foreground">Badges Issued</div>
          </div>
          <div>
            <div
              className="text-5xl mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}
            >
              450+
            </div>
            <div className="text-muted-foreground">Trusted Issuers</div>
          </div>
          <div>
            <div
              className="text-5xl mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}
            >
              98%
            </div>
            <div className="text-muted-foreground">Verification Rate</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
