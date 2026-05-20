import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, User, Sparkles, ChevronRight, Check } from 'lucide-react';
import { useUser, AVATAR_OPTIONS } from '../context/UserContext';

// Simulated wallet addresses for demo
const DEMO_WALLETS = [
  '0x8Ba1f109551bD432803012645Ac136ddd64DBA72',
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4',
  '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c',
];

export function OnboardingModal() {
  const { user, setUsername, setAvatar, connectWallet, connectMetaMask, completeOnboarding } = useUser();
  const [step, setStep] = useState<'username' | 'avatar' | 'wallet'>('username');
  const [localUsername, setLocalUsername] = useState(user.username);
  const [localAvatar, setLocalAvatar] = useState(user.avatar);
  const [isConnecting, setIsConnecting] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  if (user.hasOnboarded) return null;

  const handleUsernameNext = () => {
    const trimmed = localUsername.trim();
    if (!trimmed) {
      setUsernameError('Please enter a username');
      return;
    }
    if (trimmed.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setUsernameError('Only letters, numbers, and underscores allowed');
      return;
    }
    setUsernameError('');
    setUsername(trimmed);
    setStep('avatar');
  };

  const handleAvatarNext = () => {
    setAvatar(localAvatar);
    setStep('wallet');
  };

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    await connectMetaMask();
    setIsConnecting(false);
    completeOnboarding();
  };

  const handleSkipWallet = () => {
    completeOnboarding();
  };

  const steps = ['username', 'avatar', 'wallet'];
  const currentStepIndex = steps.indexOf(step);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        <div
          className="rounded-2xl border border-white/[0.12] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(20,14,40,0.98) 0%, rgba(10,10,25,0.98) 100%)',
            boxShadow: '0 24px 80px rgba(124,58,237,0.3), 0 0 0 1px rgba(124,58,237,0.15)',
          }}
        >
          {/* Top gradient bar */}
          <div
            className="h-1 w-full"
            style={{ background: 'linear-gradient(90deg, #7C3AED 0%, #06B6D4 100%)' }}
          />

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
                style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)' }}>
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Welcome to ZeroGas</h2>
              <p className="text-sm text-white/50">Set up your profile to get started</p>
            </div>

            {/* Step indicators */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      i < currentStepIndex
                        ? 'bg-primary text-white'
                        : i === currentStepIndex
                        ? 'bg-primary/20 border-2 border-primary text-primary'
                        : 'bg-white/[0.06] border border-white/10 text-white/30'
                    }`}
                  >
                    {i < currentStepIndex ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-8 h-0.5 transition-all duration-300 ${i < currentStepIndex ? 'bg-primary' : 'bg-white/10'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step content */}
            <AnimatePresence mode="wait">
              {step === 'username' && (
                <motion.div
                  key="username"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-white/70 mb-2">
                      <User className="w-4 h-4 inline mr-1.5 mb-0.5" />
                      Choose your username
                    </label>
                    <input
                      type="text"
                      value={localUsername}
                      onChange={(e) => {
                        setLocalUsername(e.target.value);
                        setUsernameError('');
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleUsernameNext()}
                      placeholder="e.g. web3_wizard"
                      maxLength={20}
                      autoFocus
                      className={`w-full px-4 py-3 rounded-xl bg-white/[0.06] border text-white placeholder-white/25 outline-none transition-all duration-200 focus:bg-white/[0.09] ${
                        usernameError
                          ? 'border-red-500/60 focus:border-red-500'
                          : 'border-white/10 focus:border-primary/60'
                      }`}
                    />
                    {usernameError && (
                      <p className="text-red-400 text-xs mt-1.5">{usernameError}</p>
                    )}
                    <p className="text-white/30 text-xs mt-1.5">
                      {localUsername.length}/20 · Letters, numbers, underscores only
                    </p>
                  </div>
                  <button
                    onClick={handleUsernameNext}
                    className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                      boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
                    }}
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {step === 'avatar' && (
                <motion.div
                  key="avatar"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-white/70 mb-4">Pick your avatar</p>
                    {/* Selected preview */}
                    <div className="flex justify-center mb-5">
                      <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                        style={{
                          background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                          boxShadow: '0 4px 24px rgba(124,58,237,0.5)',
                        }}
                      >
                        {localAvatar}
                      </div>
                    </div>
                    {/* Avatar grid */}
                    <div className="grid grid-cols-6 gap-2">
                      {AVATAR_OPTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => setLocalAvatar(emoji)}
                          className={`w-full aspect-square rounded-xl text-2xl flex items-center justify-center transition-all duration-150 ${
                            localAvatar === emoji
                              ? 'bg-primary/30 border-2 border-primary scale-110'
                              : 'bg-white/[0.05] border border-white/10 hover:bg-white/[0.10] hover:scale-105'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep('username')}
                      className="flex-1 py-3 rounded-xl font-semibold text-white/60 bg-white/[0.05] border border-white/10 hover:bg-white/[0.09] transition-all duration-200"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleAvatarNext}
                      className="flex-1 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                        boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
                      }}
                    >
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'wallet' && (
                <motion.div
                  key="wallet"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Profile preview */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] mb-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)' }}
                    >
                      {localAvatar}
                    </div>
                    <div>
                      <p className="font-bold text-white">{localUsername || 'Your Name'}</p>
                      <p className="text-xs text-white/40">Ready to connect wallet</p>
                    </div>
                    <Check className="w-5 h-5 text-primary ml-auto" />
                  </div>

                  <p className="text-sm text-white/50 text-center mb-5">
                    Connect your wallet to claim badges and track achievements on-chain.
                  </p>

                  <button
                    onClick={handleConnectWallet}
                    disabled={isConnecting}
                    className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed mb-3"
                    style={{
                      background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                      boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
                    }}
                  >
                    {isConnecting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet className="w-4 h-4" />
                        Connect Wallet
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSkipWallet}
                    className="w-full py-2.5 rounded-xl font-semibold text-white/40 hover:text-white/60 transition-colors duration-200 text-sm"
                  >
                    Skip for now
                  </button>

                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => setStep('avatar')}
                      className="flex-1 py-2.5 rounded-xl font-semibold text-white/40 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.07] transition-all duration-200 text-sm"
                    >
                      ← Back
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
