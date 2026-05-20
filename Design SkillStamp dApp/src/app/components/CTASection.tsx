import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { GlassCard } from './GlassCard';

export function CTASection() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <GlassCard className="relative overflow-hidden" hover={false}>
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
          }}
        />

        {/* Floating orbs */}
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-secondary/20 blur-3xl" />

        <div className="relative z-10 text-center py-16 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 mb-6">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-sm font-semibold">Join 12,500+ Professionals</span>
            </div>

            <h2
              className="text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-primary via-glow to-secondary bg-clip-text text-transparent"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}
            >
              Ready to Prove Your Skills?
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Start building your on-chain credential portfolio today. No fees, no friction, just pure proof of expertise.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold text-lg flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_4px_20px_rgba(124,58,237,0.35)] hover:shadow-[0_6px_24px_rgba(124,58,237,0.45)] relative overflow-hidden">
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="relative">Get Started Now</span>
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

              <button className="px-8 py-4 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-primary/30 text-foreground font-bold text-lg transition-all duration-200">
                View Documentation
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span>Ethereum Mainnet</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span>Polygon Support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span>Gasless Transactions</span>
              </div>
            </div>
          </motion.div>
        </div>
      </GlassCard>
    </div>
  );
}
