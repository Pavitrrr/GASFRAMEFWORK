import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { ArrowRight, Zap, Shield, Users, Award } from 'lucide-react';
import { Link } from 'react-router';

export function HomePage() {
  const features = [
    {
      icon: Shield,
      title: 'Blockchain Verified',
      description: 'Immutable proof of skills stored on-chain',
    },
    {
      icon: Zap,
      title: 'Gasless Minting',
      description: 'Zero transaction fees via UGF',
    },
    {
      icon: Users,
      title: 'Trusted Issuers',
      description: 'Verified organizations issue certifications',
    },
    {
      icon: Award,
      title: 'NFT Credentials',
      description: 'Own achievements as soulbound NFTs',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section — centered, matches original ZeroGas design */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Animated badge pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 mb-8">
              <motion.div
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
                Built on Base Sepolia · Powered by UGF
              </span>
            </div>

            {/* Big gradient title — matches original pink/purple */}
            <h1
              className="text-6xl md:text-7xl lg:text-8xl mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}
            >
              <motion.span
                className="block bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(90deg, var(--primary), #EC4899, var(--secondary))',
                  backgroundSize: '200% auto',
                }}
                animate={{ backgroundPosition: ['0% center', '100% center', '0% center'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              >
                Prove Your Skills
              </motion.span>
              <span className="block text-foreground">On-Chain</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Earn, own, and showcase verified credentials as blockchain-backed NFTs — completely gasless via UGF.
            </p>

            {/* Three buttons — matches original */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/claim">
                <button className="group px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden w-full sm:w-auto text-white"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, #EC4899 100%)',
                    boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
                  }}
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative">Start Claiming</span>
                  <ArrowRight className="w-5 h-5 relative" />
                </button>
              </Link>

              <Link to="/leaderboard">
                <button className="px-8 py-4 rounded-full border-2 font-bold text-lg transition-all duration-200 w-full sm:w-auto hover:-translate-y-0.5 hover:bg-primary/10"
                  style={{ borderColor: 'var(--primary)', color: 'var(--foreground)' }}
                >
                  Explore Leaderboard
                </button>
              </Link>

              {/* Quick Pay button */}
              <Link to="/payment">
                <button className="group px-8 py-4 rounded-full border-2 border-white/20 font-bold text-lg flex items-center justify-center gap-2 transition-all duration-200 w-full sm:w-auto hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5 text-foreground">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Pay
                </button>
              </Link>
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
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                    boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
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

        {/* Stats — removed fake numbers, replaced with real value props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '⛽', title: 'Zero Gas Fees', desc: 'UGF covers all transaction costs — claim badges for free' },
            { icon: '🔒', title: 'Soulbound NFTs', desc: 'Credentials tied to your wallet forever, unfakeable on-chain' },
            { icon: '⚡', title: 'Instant Minting', desc: 'Badges minted on Base Sepolia in seconds, verifiable on BaseScan' },
          ].map((item, i) => (
            <GlassCard key={i} className="p-6 text-center" hover={false}>
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* UGF Band */}
      <div className="w-full border-y border-white/[0.08] py-12 mt-8"
        style={{ background: 'linear-gradient(90deg, rgba(124,58,237,0.08), rgba(6,182,212,0.08), rgba(124,58,237,0.08))' }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl mb-3" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
            Powered by User Generated Funds (UGF)
          </h2>
          <p className="text-lg text-muted-foreground mb-8">Gasless transactions made simple</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {[
              { emoji: '✍️', title: 'You Sign', sub: 'Approve transaction with your wallet', highlight: false },
              { emoji: '⚡', title: 'UGF Routes', sub: 'We handle gas fees for you', highlight: true },
              { emoji: '⛓️', title: 'Action On-Chain', sub: 'Certificate minted instantly', highlight: false },
            ].map((step, i) => (
              <GlassCard
                key={i}
                className="p-6 text-center flex-1 max-w-xs"
                hover={false}
                style={step.highlight ? {
                  background: 'rgba(124,58,237,0.12)',
                  boxShadow: '0 0 30px rgba(124,58,237,0.25)',
                  borderColor: 'rgba(124,58,237,0.4)',
                } : {}}
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${step.highlight ? '' : 'bg-white/10'}`}
                  style={step.highlight ? { background: 'linear-gradient(135deg, var(--primary), var(--secondary))' } : {}}
                >
                  <span className="text-2xl">{step.emoji}</span>
                </div>
                <h3 className={`font-bold mb-1 ${step.highlight ? 'text-primary' : ''}`}>{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.sub}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
