import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { SuccessOverlay } from '../components/SuccessOverlay';
import { ErrorOverlay } from '../components/ErrorOverlay';
import { Fuel, Lock, Link as LinkIcon, Loader2, CheckCircle, ExternalLink } from 'lucide-react';
import { fetchQuizzes, isContractDeployed, type Quiz } from '../hooks/useContract';
import { claimBadgeViaUGF, type UGFProgress } from '../hooks/useUGF';
import { useUser } from '../context/UserContext';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as string | undefined;
const categories = ['All', 'Event', 'Certificate', 'Achievement', 'Special'];

// UGF step labels matching the SDK lifecycle
const UGF_STEPS = [
  { key: 'auth',    label: 'Auth'    },
  { key: 'quote',   label: 'Quote'   },
  { key: 'settle',  label: 'Settle'  },
  { key: 'execute', label: 'Execute' },
  { key: 'done',    label: 'Done'    },
];

export function ClaimBadgesPage() {
  const { user } = useUser();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBadge, setSelectedBadge] = useState<number | null>(null);
  const [ugfProgress, setUgfProgress] = useState<UGFProgress | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [claimedIds, setClaimedIds] = useState<Set<number>>(new Set());
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzes().then(q => { setQuizzes(q); setLoading(false); });
  }, []);

  const filtered = selectedCategory === 'All'
    ? quizzes
    : quizzes.filter(b => b.category === selectedCategory);

  const isClaiming = ugfProgress !== null && ugfProgress.step !== 'done' && ugfProgress.step !== 'error';

  const currentStepIndex = ugfProgress
    ? UGF_STEPS.findIndex(s => s.key === ugfProgress.step)
    : -1;

  const handleClaim = async () => {
    if (!selectedBadge) return;
    setTxHash(null);
    setUgfProgress({ step: 'auth', message: 'Starting UGF transaction...' });

    try {
      if (isContractDeployed() && CONTRACT_ADDRESS && user.walletAddress) {
        // Real UGF flow — no ETH needed, pays with TYI Mock USD
        const hash = await claimBadgeViaUGF(
          CONTRACT_ADDRESS,
          selectedBadge,
          85,
          '0x' + '00'.repeat(65), // issuer signature — replace with real backend signing
          (progress) => setUgfProgress(progress)
        );
        setTxHash(hash);
        setClaimedIds(prev => new Set([...prev, selectedBadge]));
        setShowSuccess(true);
      } else {
        // Demo flow — simulate UGF steps without contract
        const steps: UGFProgress[] = [
          { step: 'auth',    message: 'Authenticating with UGF...' },
          { step: 'quote',   message: 'Getting gas quote — paying with TYI Mock USD...' },
          { step: 'settle',  message: 'Authorizing Mock USD payment (no ETH needed)...' },
          { step: 'execute', message: 'UGF sponsoring gas & minting badge on Base Sepolia...' },
          { step: 'done',    message: 'Badge minted! Transaction confirmed.', txHash: '0xdemo_' + Date.now().toString(16) },
        ];
        for (const s of steps) {
          setUgfProgress(s);
          await new Promise(r => setTimeout(r, 900));
        }
        setClaimedIds(prev => new Set([...prev, selectedBadge]));
        setShowSuccess(true);
      }
    } catch (err: unknown) {
      const e = err as { code?: number; message?: string };
      if (e.code !== 4001) {
        setErrorMsg(e.message ?? 'Transaction failed. Please try again.');
        setUgfProgress({ step: 'error', message: e.message ?? 'Failed', error: e.message });
        setShowError(true);
      } else {
        setUgfProgress(null);
      }
    } finally {
      if (ugfProgress?.step !== 'error') {
        setTimeout(() => { setUgfProgress(null); setSelectedBadge(null); }, 1500);
      }
    }
  };

  return (
    <div className="min-h-screen">
      <SuccessOverlay show={showSuccess} onClose={() => setShowSuccess(false)} />
      <ErrorOverlay show={showError} onClose={() => { setShowError(false); setUgfProgress(null); }} message={errorMsg} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
            Claim Badges
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-success/20 border border-success/40">
              <Fuel className="w-4 h-4 text-success" />
              <span className="text-success font-semibold text-sm">Gasless via UGF — pay with Mock USD, no ETH needed</span>
            </div>
            {isContractDeployed() && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/15 border border-green-500/30 text-xs font-bold text-green-400">
                ✅ Live on Base Sepolia
              </div>
            )}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full transition-all duration-200 ${selectedCategory === cat ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg' : 'bg-white/[0.03] border border-white/[0.08] text-muted-foreground hover:text-foreground hover:bg-white/[0.06]'}`}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Badge Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((badge, index) => {
                  const isClaimed = claimedIds.has(badge.id);
                  return (
                    <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                      <GlassCard className={`p-6 cursor-pointer relative ${selectedBadge === badge.id ? 'border-primary/50 shadow-[0_0_30px_rgba(124,58,237,0.3)]' : ''}`}
                        onClick={() => !isClaimed && !isClaiming && setSelectedBadge(badge.id)}>
                        {isClaimed && (
                          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-success/20 border border-success/40 text-xs font-bold text-success flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Claimed
                          </div>
                        )}
                        <div className="relative inline-block mb-4">
                          <motion.div className="absolute inset-0 rounded-full blur-2xl"
                            style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)', transform: 'scale(1.8)' }}
                            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1.6, 1.9, 1.6] }} transition={{ duration: 3, repeat: Infinity }} />
                          <motion.div className="relative text-5xl" whileHover={{ scale: 1.15, rotate: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                            {badge.emoji}
                          </motion.div>
                        </div>
                        <div className="inline-block px-2 py-1 rounded text-xs font-semibold bg-primary/20 text-primary mb-3">{badge.category}</div>
                        <h3 className="text-lg mb-2" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>{badge.title}</h3>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Claim Panel */}
            <div className="lg:col-span-1">
              <AnimatePresence>
                {selectedBadge && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="sticky top-24">
                    <GlassCard className="p-6">
                      <h3 className="text-xl mb-6" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Claim Badge</h3>
                      {(() => {
                        const badge = quizzes.find(b => b.id === selectedBadge);
                        if (!badge) return null;
                        return (
                          <>
                            <div className="text-center mb-6">
                              <div className="text-6xl mb-3">{badge.emoji}</div>
                              <h4 className="text-lg mb-1" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>{badge.title}</h4>
                              <p className="text-xs text-muted-foreground">Pass score: {badge.passingScore}%</p>
                            </div>

                            <div className="space-y-2 mb-6">
                              <div className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                                <Fuel className="w-4 h-4 text-primary" />
                                <span className="text-sm">Pay with <strong>TYI Mock USD</strong> — no ETH</span>
                              </div>
                              <div className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                                <Lock className="w-4 h-4 text-success" />
                                <span className="text-sm">Soulbound NFT on Base Sepolia</span>
                              </div>
                              <div className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                                <LinkIcon className="w-4 h-4 text-secondary" />
                                <span className="text-sm">UGF: Quote → Settle → Execute</span>
                              </div>
                            </div>

                            {/* UGF Progress Steps */}
                            {ugfProgress && (
                              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
                                <p className="text-xs text-muted-foreground mb-3 text-center">{ugfProgress.message}</p>
                                <div className="relative">
                                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10" />
                                  <div className="relative flex justify-between">
                                    {UGF_STEPS.map((s, i) => {
                                      const isComplete = currentStepIndex > i || ugfProgress.step === 'done';
                                      const isActive = currentStepIndex === i && ugfProgress.step !== 'done';
                                      return (
                                        <div key={s.key} className="flex flex-col items-center">
                                          <motion.div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-1.5 ${isComplete ? 'bg-success border-success' : isActive ? 'bg-primary border-primary' : 'bg-white/5 border-white/20'}`}
                                            animate={isActive ? { scale: [1,1.12,1], boxShadow: ['0 0 0 0 rgba(124,58,237,0.7)','0 0 0 8px rgba(124,58,237,0)','0 0 0 0 rgba(124,58,237,0)'] } : {}}
                                            transition={{ duration: 1.5, repeat: Infinity }}>
                                            {isComplete
                                              ? <CheckCircle className="w-5 h-5 text-white" />
                                              : <span className="text-xs font-bold text-white">{i + 1}</span>}
                                          </motion.div>
                                          <span className="text-[10px] text-muted-foreground">{s.label}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                                {ugfProgress.txHash && (
                                  <div className="mt-3 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                                    <a href={`https://sepolia.basescan.org/tx/${ugfProgress.txHash}`} target="_blank" rel="noopener noreferrer"
                                      className="text-xs text-green-400 font-mono flex items-center gap-1 hover:text-green-300">
                                      Tx: {ugfProgress.txHash.slice(0,18)}... <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                )}
                              </motion.div>
                            )}

                            <button onClick={handleClaim} disabled={isClaiming}
                              className="w-full group px-6 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_4px_20px_rgba(124,58,237,0.35)] relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                              {isClaiming
                                ? <><Loader2 className="w-4 h-4 animate-spin relative" /> <span className="relative">Processing via UGF...</span></>
                                : <span className="relative">Claim Badge (No ETH needed)</span>
                              }
                            </button>
                          </>
                        );
                      })()}
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
