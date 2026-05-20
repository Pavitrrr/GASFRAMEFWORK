import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';
import { Wallet, Award, Shield, Share2 } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Wallet,
      title: 'Connect Wallet',
      description: 'Link your Web3 wallet to access the platform. No signup required.',
    },
    {
      number: '02',
      icon: Award,
      title: 'Complete Challenges',
      description: 'Demonstrate your skills through verified assessments and projects.',
    },
    {
      number: '03',
      icon: Shield,
      title: 'Earn Badges',
      description: 'Receive NFT credentials stored permanently on the blockchain.',
    },
    {
      number: '04',
      icon: Share2,
      title: 'Showcase Skills',
      description: 'Share your verified achievements with employers and communities.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2
          className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}
        >
          How It Works
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Four simple steps to earning blockchain-verified skill credentials
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {/* Connecting line for desktop */}
        <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20" />

        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="relative"
          >
            <GlassCard className="p-6 text-center relative">
              {/* Step number badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg relative z-10"
                  style={{
                    boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
                  }}
                >
                  <span
                    className="text-white text-sm"
                    style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}
                  >
                    {step.number}
                  </span>
                </div>
              </div>

              <div className="pt-8">
                <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center mb-4">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <h3
                  className="text-lg mb-2"
                  style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
