import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { ArrowRight, Wallet, Award, Shield, Share2 } from 'lucide-react';
import { Link } from 'react-router';

export function HomePage() {
  const steps = [
    {
      number: '01',
      icon: Wallet,
      title: 'Connect Wallet',
      description: 'Link your Web3 wallet to access the platform',
    },
    {
      number: '02',
      icon: Award,
      title: 'Complete Challenges',
      description: 'Demonstrate your skills through verified assessments',
    },
    {
      number: '03',
      icon: Shield,
      title: 'Earn Badges',
      description: 'Receive NFT credentials stored on-chain',
    },
    {
      number: '04',
      icon: Share2,
      title: 'Showcase Skills',
      description: 'Share your verified achievements with employers',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Animated badge pill */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8">
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #7C3AED 0%, #06B6D4 100%)',
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
                <span className="text-sm text-muted-foreground">
                  Built on Base Sepolia · Powered by UGF
                </span>
              </div>

              {/* H1 - Three lines */}
              <h1
                className="mb-6"
                style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}
              >
                <div className="text-6xl md:text-7xl lg:text-8xl leading-none mb-2">
                  Prove Your Skills.
                </div>
                <div className="text-6xl md:text-7xl lg:text-8xl leading-none mb-2">
                  On-Chain.
                </div>
                <motion.div
                  className="text-6xl md:text-7xl lg:text-8xl leading-none bg-gradient-to-r from-primary via-glow to-secondary bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{
                    backgroundSize: '200% 200%',
                  }}
                >
                  Gasless.
                </motion.div>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-xl">
                Earn blockchain-verified skill credentials with zero gas fees. Powered by User
                Generated Funds for seamless on-chain certification.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/claim">
                  <button className="group px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold text-lg flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_4px_20px_rgba(124,58,237,0.35)] hover:shadow-[0_6px_24px_rgba(124,58,237,0.45)] relative overflow-hidden w-full sm:w-auto">
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <span className="relative">Start Claiming</span>
                    <ArrowRight className="w-5 h-5 relative" />
                  </button>
                </Link>

                <Link to="/leaderboard">
                  <button className="px-8 py-4 rounded-full bg-transparent border-2 border-primary text-foreground hover:bg-primary/10 font-bold text-lg transition-all duration-200 w-full sm:w-auto">
                    View Leaderboard
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Floating Certificate Card */}
          <div className="relative flex justify-center lg:justify-end">
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative"
            >
              {/* Purple glow behind card */}
              <div
                className="absolute inset-0 blur-3xl opacity-50"
                style={{
                  background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)',
                  transform: 'scale(1.2)',
                }}
              />

              <GlassCard className="relative p-8 max-w-sm">
                {/* Holographic foil shimmer effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-30"
                  style={{
                    background:
                      'linear-gradient(135deg, transparent 0%, rgba(124,58,237,0.3) 25%, rgba(6,182,212,0.3) 50%, rgba(168,85,247,0.3) 75%, transparent 100%)',
                    backgroundSize: '400% 400%',
                  }}
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />

                <div className="relative">
                  {/* Top gradient line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                    style={{
                      background: 'linear-gradient(90deg, #7C3AED 0%, #06B6D4 100%)',
                    }}
                  />

                  <div className="text-center pt-4">
                    {/* Medal emoji with glow */}
                    <div className="relative inline-block mb-4">
                      <div
                        className="absolute inset-0 blur-2xl"
                        style={{
                          background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)',
                          transform: 'scale(1.5)',
                        }}
                      />
                      <div className="relative text-6xl">🏅</div>
                    </div>

                    <h3
                      className="text-2xl mb-2"
                      style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
                    >
                      React Developer
                    </h3>

                    <div
                      className="text-4xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                      style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}
                    >
                      Score: 92%
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/20 border border-success/40">
                      <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-success font-semibold">Soulbound</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2
            className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}
          >
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard className="p-6 text-center">
                {/* Numbered gradient square */}
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl text-white shadow-lg"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
                  }}
                >
                  {step.number}
                </div>

                <div className="mb-4">
                  <step.icon className="w-8 h-8 mx-auto text-primary" />
                </div>

                <h3
                  className="text-lg mb-2"
                  style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* UGF Explainer Band */}
      <div className="w-full bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-y border-white/[0.08] py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2
              className="text-3xl md:text-4xl mb-3"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}
            >
              Powered by User Generated Funds (UGF)
            </h2>
            <p className="text-lg text-muted-foreground">
              Gasless transactions made simple
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {/* Step 1 */}
            <GlassCard className="p-6 text-center flex-1 max-w-xs" hover={false}>
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="text-2xl">✍️</span>
              </div>
              <h3 className="font-bold mb-1">You Sign</h3>
              <p className="text-sm text-muted-foreground">Approve transaction with your wallet</p>
            </GlassCard>

            {/* Arrow */}
            <ArrowRight className="w-8 h-8 text-primary hidden md:block" />

            {/* Step 2 - Highlighted */}
            <GlassCard
              className="p-6 text-center flex-1 max-w-xs border-primary/50"
              hover={false}
              style={{
                background: 'rgba(124, 58, 237, 0.1)',
                boxShadow: '0 0 30px rgba(124, 58, 237, 0.3)',
              }}
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-bold mb-1 text-primary">UGF Routes</h3>
              <p className="text-sm text-muted-foreground">
                We handle gas fees for you
              </p>
            </GlassCard>

            {/* Arrow */}
            <ArrowRight className="w-8 h-8 text-primary hidden md:block" />

            {/* Step 3 */}
            <GlassCard className="p-6 text-center flex-1 max-w-xs" hover={false}>
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="text-2xl">⛓️</span>
              </div>
              <h3 className="font-bold mb-1">Action On-Chain</h3>
              <p className="text-sm text-muted-foreground">
                Certificate minted instantly
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
