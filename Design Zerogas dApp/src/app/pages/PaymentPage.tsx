import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { Zap, ArrowRight, CheckCircle, Clock, Wallet, CreditCard, Send, Fuel, ExternalLink, AlertTriangle, Loader2 } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router';
import { sendETHViaUGF, contributeToUGFPool, type UGFProgress } from '../hooks/useUGF';

const QUICK_AMOUNTS = ['0.001', '0.005', '0.01', '0.05', '0.1', '0.5'];
const UGF_POOL = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4';

const UGF_STEPS = [
  { key: 'auth',    label: 'Auth'    },
  { key: 'quote',   label: 'Quote'   },
  { key: 'settle',  label: 'Settle'  },
  { key: 'execute', label: 'Execute' },
  { key: 'done',    label: 'Done'    },
];

export function PaymentPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'send' | 'contribute'>('send');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [ugfProgress, setUgfProgress] = useState<UGFProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState(false);

  const isSending = ugfProgress !== null && ugfProgress.step !== 'done' && ugfProgress.step !== 'error';
  const isDone = ugfProgress?.step === 'done';
  const txHash = ugfProgress?.txHash ?? null;

  const currentStepIndex = ugfProgress
    ? UGF_STEPS.findIndex(s => s.key === ugfProgress.step)
    : -1;

  const resetForm = () => { setUgfProgress(null); setAmount(''); setRecipient(''); setError(null); };

  const handleSend = async () => {
    setError(null);
    if (!amount || !recipient) return;
    if (!recipient.startsWith('0x') || recipient.length !== 42) {
      setError('Invalid address. Must be a valid 0x... Ethereum address.');
      return;
    }
    try {
      await sendETHViaUGF(recipient, amount, (p) => setUgfProgress(p));
    } catch (err: unknown) {
      const e = err as { code?: number; message?: string };
      if (e.code === 4001) { setCancelled(true); setTimeout(() => setCancelled(false), 3000); setUgfProgress(null); }
      else { setError(e.message ?? 'Transaction failed.'); setUgfProgress(null); }
    }
  };

  const handleContribute = async () => {
    setError(null);
    if (!amount) return;
    try {
      await contributeToUGFPool(UGF_POOL, amount, (p) => setUgfProgress(p));
    } catch (err: unknown) {
      const e = err as { code?: number; message?: string };
      if (e.code === 4001) { setCancelled(true); setTimeout(() => setCancelled(false), 3000); setUgfProgress(null); }
      else { setError(e.message ?? 'Transaction failed.'); setUgfProgress(null); }
    }
  };

  const explorerUrl = txHash ? `https://sepolia.basescan.org/tx/${txHash}` : null;

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,var(--primary),var(--secondary))' }}>
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold" style={{ fontFamily: 'var(--font-heading)' }}>Payment</h1>
            <p className="text-sm text-muted-foreground">Send ETH via UGF — pay gas with Mock USD, no ETH needed</p>
          </div>
          {user.walletAddress && (
            <div className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/15 border border-green-500/30">
              <Wallet className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-semibold text-sm font-mono">
                {user.walletAddress.slice(0,6)}...{user.walletAddress.slice(-4)}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Left — Payment form */}
          <div className="lg:col-span-3 space-y-4">

            {/* Tabs */}
            <div className="flex gap-2 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              {(['send', 'contribute'] as const).map(t => (
                <button key={t} onClick={() => { setTab(t); resetForm(); }}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                  style={tab === t ? { background: 'linear-gradient(135deg,var(--primary),var(--secondary))', color: '#fff' } : { color: 'var(--muted-foreground)' }}>
                  {t === 'send' ? '📤 Send ETH' : '⛽ Contribute to UGF'}
                </button>
              ))}
            </div>

            <GlassCard className="p-6" hover={false}>
              <AnimatePresence mode="wait">

                {/* Success state */}
                {isDone ? (
                  <motion.div key="success" initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} className="text-center py-6 space-y-4">
                    <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:300 }}
                      className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </motion.div>
                    <div>
                      <p className="font-bold text-lg">Transaction Confirmed! 🎉</p>
                      <p className="text-sm text-muted-foreground mt-1">Gas paid with TYI Mock USD via UGF</p>
                    </div>
                    {txHash && (
                      <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-left">
                        <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
                        <code className="text-xs font-mono text-primary break-all">{txHash}</code>
                      </div>
                    )}
                    {explorerUrl && (
                      <a href={explorerUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-primary/30 text-primary hover:bg-primary/10 transition-colors">
                        View on BaseScan <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button onClick={resetForm}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold text-muted-foreground border border-white/10 hover:bg-white/[0.06] transition-colors">
                      Send Another
                    </button>
                  </motion.div>

                ) : tab === 'send' ? (
                  <motion.div key="send" initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:10 }} className="space-y-4">
                    {/* UGF info banner */}
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-primary/10 border border-primary/20">
                      <Fuel className="w-4 h-4 text-primary shrink-0" />
                      <p className="text-xs text-primary">Gas paid with <strong>TYI Mock USD</strong> via UGF — you don't need ETH in your wallet</p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block">Recipient Address</label>
                      <input type="text" value={recipient} onChange={e => { setRecipient(e.target.value); setError(null); }}
                        placeholder="0x..."
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-foreground text-sm outline-none focus:border-primary/60 transition-all font-mono" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block">Amount (ETH)</label>
                      <div className="relative">
                        <input type="number" value={amount} onChange={e => { setAmount(e.target.value); setError(null); }}
                          placeholder="0.00" min="0" step="0.001"
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-foreground text-lg font-bold outline-none focus:border-primary/60 transition-all pr-16" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">ETH</span>
                      </div>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {QUICK_AMOUNTS.map(a => (
                          <button key={a} onClick={() => { setAmount(a); setError(null); }}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${amount===a ? 'border-primary bg-primary/20 text-primary' : 'border-white/10 bg-white/[0.04] text-muted-foreground hover:border-primary/40'}`}>
                            {a} ETH
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* UGF Progress */}
                    {ugfProgress && !isDone && (
                      <UGFProgressBar progress={ugfProgress} currentStepIndex={currentStepIndex} />
                    )}

                    {error && <ErrorBanner message={error} />}
                    <UGFButton sending={isSending} disabled={!amount || !recipient} onClick={handleSend} label="Send via UGF (No ETH needed)" />
                  </motion.div>

                ) : (
                  <motion.div key="contribute" initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-10 }} className="space-y-4">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                      <h3 className="font-bold mb-1 flex items-center gap-2">
                        <Fuel className="w-4 h-4 text-primary" /> Contribute to UGF Pool
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Your ETH goes to the UGF pool that sponsors gas for all badge claims. Gas paid with TYI Mock USD — no ETH needed from you!
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block">Amount (ETH)</label>
                      <div className="relative">
                        <input type="number" value={amount} onChange={e => { setAmount(e.target.value); setError(null); }}
                          placeholder="0.00" min="0" step="0.001"
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-foreground text-lg font-bold outline-none focus:border-primary/60 transition-all pr-16" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">ETH</span>
                      </div>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {QUICK_AMOUNTS.map(a => (
                          <button key={a} onClick={() => { setAmount(a); setError(null); }}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${amount===a ? 'border-primary bg-primary/20 text-primary' : 'border-white/10 bg-white/[0.04] text-muted-foreground hover:border-primary/40'}`}>
                            {a} ETH
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[['🏊','Pool Size','2.4 ETH'],['👥','Contributors','847'],['⚡','Txns Covered','12.5K']].map(([icon,label,val]) => (
                        <div key={label} className="text-center p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                          <div className="text-xl mb-1">{icon}</div>
                          <div className="text-sm font-bold">{val}</div>
                          <div className="text-xs text-muted-foreground">{label}</div>
                        </div>
                      ))}
                    </div>

                    {ugfProgress && !isDone && (
                      <UGFProgressBar progress={ugfProgress} currentStepIndex={currentStepIndex} />
                    )}

                    {error && <ErrorBanner message={error} />}
                    <UGFButton sending={isSending} disabled={!amount} onClick={handleContribute} label="Contribute via UGF (No ETH needed)" />
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </div>

          {/* Right — Recent activity */}
          <div className="lg:col-span-2">
            <GlassCard className="p-5" hover={false}>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Recent Activity
              </h3>
              <div className="text-center py-8 text-muted-foreground">
                <Wallet className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-semibold">
                  {user.walletAddress ? 'No transactions yet' : 'Connect wallet first'}
                </p>
                <p className="text-xs mt-1 opacity-60">
                  {user.walletAddress
                    ? 'Your UGF transactions will appear here'
                    : 'Connect MetaMask to send transactions'}
                </p>
              </div>
              <button onClick={() => navigate('/history')}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-colors border border-white/[0.06]">
                <ExternalLink className="w-3.5 h-3.5" /> View Full History
              </button>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Success overlay */}
      <AnimatePresence>
        {isDone && txHash && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div key={i} className="absolute w-3 h-3 rounded-full"
                style={{ background: ['#7C3AED','#06B6D4','#10B981','#F59E0B','#EC4899'][i % 5] }}
                initial={{ x:0, y:0, scale:0, opacity:1 }}
                animate={{ x: Math.cos((i/20)*Math.PI*2)*(120+Math.random()*80), y: Math.sin((i/20)*Math.PI*2)*(120+Math.random()*80)-40, scale:[0,1.5,0], opacity:[1,1,0] }}
                transition={{ duration:1.2, delay:i*0.04, ease:'easeOut' }} />
            ))}
            <motion.div initial={{ scale:0, rotate:-20 }} animate={{ scale:1, rotate:0 }} exit={{ scale:0 }}
              transition={{ type:'spring', stiffness:300, damping:20 }}
              className="rounded-3xl p-10 flex flex-col items-center gap-5 pointer-events-auto"
              style={{ background:'linear-gradient(135deg,rgba(10,20,40,0.98),rgba(5,10,20,0.98))', boxShadow:'0 0 80px rgba(16,185,129,0.4),0 0 0 1px rgba(16,185,129,0.3)' }}>
              <motion.div animate={{ scale:[1,1.15,1], boxShadow:['0 0 0px #10B981','0 0 40px #10B981','0 0 0px #10B981'] }}
                transition={{ duration:1.5, repeat:Infinity }}
                className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </motion.div>
              <div className="text-center">
                <p className="text-2xl font-extrabold text-white">Transaction Sent! 🎉</p>
                <p className="text-sm text-green-400 mt-1">Gas paid with TYI Mock USD via UGF</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancelled overlay */}
      <AnimatePresence>
        {cancelled && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
            <motion.div initial={{ scale:0, rotate:10 }} animate={{ scale:1, rotate:[10,-8,6,-4,0] }} exit={{ scale:0, opacity:0 }}
              transition={{ type:'spring', stiffness:400, damping:18 }}
              className="rounded-3xl p-10 flex flex-col items-center gap-5 pointer-events-auto"
              style={{ background:'linear-gradient(135deg,rgba(30,5,5,0.98),rgba(15,5,5,0.98))', boxShadow:'0 0 80px rgba(239,68,68,0.35),0 0 0 1px rgba(239,68,68,0.25)' }}>
              <motion.div animate={{ rotate:[0,-5,5,-5,0] }} transition={{ duration:0.5, repeat:2 }}
                className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-6xl">❌</span>
              </motion.div>
              <div className="text-center">
                <p className="text-2xl font-extrabold text-white">Transaction Cancelled</p>
                <p className="text-sm text-red-400 mt-1">You rejected the request in MetaMask</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Failed overlay */}
      <AnimatePresence>
        {failed && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
            <motion.div initial={{ scale:0, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0, opacity:0 }}
              transition={{ type:'spring', stiffness:300, damping:20 }}
              className="rounded-3xl p-10 flex flex-col items-center gap-5 pointer-events-auto max-w-sm mx-4"
              style={{ background:'linear-gradient(135deg,rgba(20,5,5,0.98),rgba(10,5,5,0.98))', boxShadow:'0 0 80px rgba(239,68,68,0.3),0 0 0 1px rgba(239,68,68,0.2)' }}>
              <motion.div
                animate={{ scale:[1,1.1,1], boxShadow:['0 0 0px #EF4444','0 0 30px #EF4444','0 0 0px #EF4444'] }}
                transition={{ duration:1.5, repeat:2 }}
                className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-5xl">⚠️</span>
              </motion.div>
              <div className="text-center">
                <p className="text-2xl font-extrabold text-white">Transaction Failed</p>
                <p className="text-sm text-red-300 mt-2 leading-relaxed">{failed}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UGFProgressBar({ progress, currentStepIndex }: { progress: UGFProgress; currentStepIndex: number }) {
  return (
    <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
      <p className="text-xs text-muted-foreground mb-3 text-center">{progress.message}</p>
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10" />
        <div className="relative flex justify-between">
          {UGF_STEPS.map((s, i) => {
            const isComplete = currentStepIndex > i || progress.step === 'done';
            const isActive = currentStepIndex === i && progress.step !== 'done';
            return (
              <div key={s.key} className="flex flex-col items-center">
                <motion.div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-1.5 ${isComplete ? 'bg-success border-success' : isActive ? 'bg-primary border-primary' : 'bg-white/5 border-white/20'}`}
                  animate={isActive ? { scale:[1,1.12,1], boxShadow:['0 0 0 0 rgba(124,58,237,0.7)','0 0 0 8px rgba(124,58,237,0)','0 0 0 0 rgba(124,58,237,0)'] } : {}}
                  transition={{ duration:1.5, repeat:Infinity }}>
                  {isComplete ? <CheckCircle className="w-5 h-5 text-white" /> : isActive ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <span className="text-xs font-bold text-white">{i+1}</span>}
                </motion.div>
                <span className="text-[10px] text-muted-foreground">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
      <p className="text-xs text-red-300">{message}</p>
    </div>
  );
}

function UGFButton({ sending, disabled, onClick, label }: { sending: boolean; disabled: boolean; onClick: () => void; label: string }) {
  return (
    <motion.button onClick={onClick} disabled={disabled || sending}
      whileHover={!disabled && !sending ? { scale:1.01, y:-1 } : {}}
      whileTap={!disabled ? { scale:0.98 } : {}}
      className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
      style={{ background:'linear-gradient(135deg,var(--primary),var(--secondary))', boxShadow:'0 4px 20px rgba(124,58,237,0.35)' }}>
      {!sending && (
        <motion.div className="absolute inset-0 -translate-x-full"
          animate={{ translateX:['-100%','100%'] }} transition={{ duration:2, repeat:Infinity, repeatDelay:1 }}
          style={{ background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)' }} />
      )}
      {sending
        ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing via UGF...</>
        : <><Send className="w-4 h-4" /> {label} <ArrowRight className="w-4 h-4" /></>
      }
    </motion.button>
  );
}
