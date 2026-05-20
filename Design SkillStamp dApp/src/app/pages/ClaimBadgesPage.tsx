import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { SuccessOverlay } from '../components/SuccessOverlay';
import { ErrorOverlay } from '../components/ErrorOverlay';
import { Fuel, Lock, Link as LinkIcon } from 'lucide-react';

const badges = [
  { id: 1, emoji: '⚛️', category: 'Certificate', name: 'React Developer', description: 'Master React fundamentals and advanced patterns', claimed: false },
  { id: 2, emoji: '🔐', category: 'Certificate', name: 'Smart Contract Auditor', description: 'Security analysis and vulnerability detection', claimed: true },
  { id: 3, emoji: '🎨', category: 'Achievement', name: 'UI/UX Champion', description: 'Created 10+ production-ready designs', claimed: false },
  { id: 4, emoji: '⚡', category: 'Event', name: 'ETH Denver 2026', description: 'Attended and participated in workshops', claimed: false },
  { id: 5, emoji: '🏆', category: 'Achievement', name: 'Bug Bounty Hunter', description: 'Found and reported 5+ critical bugs', claimed: true },
  { id: 6, emoji: '🌐', category: 'Certificate', name: 'Web3 Developer', description: 'Full-stack blockchain application development', claimed: false },
  { id: 7, emoji: '🔗', category: 'Special', name: 'DeFi Expert', description: 'Advanced decentralized finance protocols', claimed: false },
  { id: 8, emoji: '🎯', category: 'Achievement', name: 'First Contributor', description: 'Made your first open-source contribution', claimed: false },
  { id: 9, emoji: '🚀', category: 'Event', name: 'Hackathon Winner', description: 'Won top prize at Web3 hackathon', claimed: false },
];

const categories = ['All', 'Event', 'Certificate', 'Achievement', 'Special'];

const ugfSteps = [
  { id: 1, label: 'Auth', status: 'complete' },
  { id: 2, label: 'Quote', status: 'complete' },
  { id: 3, label: 'Settle', status: 'active' },
  { id: 4, label: 'Execute', status: 'pending' },
  { id: 5, label: 'Done', status: 'pending' },
];

export function ClaimBadgesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBadge, setSelectedBadge] = useState<number | null>(null);
  const [claimingState, setClaimingState] = useState<'idle' | 'claiming'>('idle');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const filteredBadges =
    selectedCategory === 'All'
      ? badges
      : badges.filter((b) => b.category === selectedCategory);

  const handleClaim = () => {
    setClaimingState('claiming');
    // Simulate claiming process with 80% success rate
    setTimeout(() => {
      setClaimingState('idle');
      const success = Math.random() > 0.2;
      if (success) {
        setShowSuccess(true);
        // Update badge as claimed
        const badgeIndex = badges.findIndex(b => b.id === selectedBadge);
        if (badgeIndex !== -1) {
          badges[badgeIndex].claimed = true;
        }
      } else {
        setShowError(true);
      }
      setSelectedBadge(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen">
      <SuccessOverlay show={showSuccess} onClose={() => setShowSuccess(false)} />
      <ErrorOverlay
        show={showError}
        onClose={() => setShowError(false)}
        message="Unable to process your claim. Please try again."
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}
          >
            Claim Badges
          </h1>

          {/* Green gas savings banner */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-success/20 border border-success/40">
            <Fuel className="w-4 h-4 text-success" />
            <span className="text-success font-semibold">0.006 ETH saved via UGF</span>
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg'
                  : 'bg-white/[0.03] border border-white/[0.08] text-muted-foreground hover:text-foreground hover:bg-white/[0.06]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Badge Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredBadges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <GlassCard
                    className={`p-6 cursor-pointer relative ${
                      selectedBadge === badge.id
                        ? 'border-primary/50 shadow-[0_0_30px_rgba(124,58,237,0.3)]'
                        : ''
                    }`}
                    onClick={() => !badge.claimed && setSelectedBadge(badge.id)}
                  >
                    {/* Claimed ribbon */}
                    {badge.claimed && (
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-success/20 border border-success/40 text-xs font-bold text-success flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Claimed
                      </div>
                    )}

                    {/* Large emoji with animated glow ring */}
                    <div className="relative inline-block mb-4">
                      <motion.div
                        className="absolute inset-0 rounded-full blur-2xl"
                        style={{
                          background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)',
                          transform: 'scale(1.8)',
                        }}
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                          scale: [1.6, 1.9, 1.6],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                        }}
                      />
                      <motion.div
                        className="relative text-5xl"
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        {badge.emoji}
                      </motion.div>
                    </div>

                    {/* Category pill */}
                    <div className="inline-block px-2 py-1 rounded text-xs font-semibold bg-primary/20 text-primary mb-3">
                      {badge.category}
                    </div>

                    <h3
                      className="text-lg mb-2"
                      style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
                    >
                      {badge.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{badge.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Claim Panel */}
          <div className="lg:col-span-1">
            <AnimatePresence>
              {selectedBadge && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="sticky top-24"
                >
                  <GlassCard className="p-6">
                    <h3
                      className="text-xl mb-6"
                      style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
                    >
                      Claim Badge
                    </h3>

                    {/* Badge preview */}
                    {(() => {
                      const badge = badges.find((b) => b.id === selectedBadge);
                      if (!badge) return null;

                      return (
                        <>
                          <div className="text-center mb-6">
                            <div className="text-6xl mb-3">{badge.emoji}</div>
                            <h4
                              className="text-lg mb-2"
                              style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
                            >
                              {badge.name}
                            </h4>
                          </div>

                          {/* Info pills */}
                          <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                              <Fuel className="w-4 h-4 text-primary" />
                              <span className="text-sm">Free (Gasless via UGF)</span>
                            </div>
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                              <Lock className="w-4 h-4 text-success" />
                              <span className="text-sm">Soulbound NFT</span>
                            </div>
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                              <LinkIcon className="w-4 h-4 text-secondary" />
                              <span className="text-sm">Base Sepolia</span>
                            </div>
                          </div>

                          {/* Claim button */}
                          <button
                            onClick={handleClaim}
                            disabled={claimingState === 'claiming'}
                            className="w-full group px-6 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_4px_20px_rgba(124,58,237,0.35)] hover:shadow-[0_6px_24px_rgba(124,58,237,0.45)] relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            <span className="relative">
                              {claimingState === 'claiming' ? 'Claiming...' : 'Claim Badge'}
                            </span>
                          </button>

                          {/* UGF Status Bar */}
                          {claimingState === 'claiming' && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-6"
                            >
                              <h4 className="text-sm font-semibold mb-4 text-muted-foreground">
                                UGF Transaction Status
                              </h4>
                              <div className="relative">
                                {/* Connecting lines */}
                                <div className="absolute top-6 left-0 right-0 h-0.5 bg-white/10" />

                                <div className="relative flex justify-between">
                                  {ugfSteps.map((step, index) => (
                                    <div key={step.id} className="flex flex-col items-center">
                                      <motion.div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 mb-2 ${
                                          step.status === 'complete'
                                            ? 'bg-success border-success'
                                            : step.status === 'active'
                                            ? 'bg-primary border-primary'
                                            : 'bg-white/5 border-white/20'
                                        }`}
                                        animate={
                                          step.status === 'active'
                                            ? {
                                                scale: [1, 1.1, 1],
                                                boxShadow: [
                                                  '0 0 0 0 rgba(124, 58, 237, 0.7)',
                                                  '0 0 0 10px rgba(124, 58, 237, 0)',
                                                  '0 0 0 0 rgba(124, 58, 237, 0)',
                                                ],
                                              }
                                            : {}
                                        }
                                        transition={{
                                          duration: 2,
                                          repeat: Infinity,
                                        }}
                                      >
                                        {step.status === 'complete' ? (
                                          <svg
                                            className="w-6 h-6 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        ) : (
                                          <span className="text-xs font-bold text-white">
                                            {step.id}
                                          </span>
                                        )}
                                      </motion.div>
                                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        {step.label}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </>
                      );
                    })()}
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
