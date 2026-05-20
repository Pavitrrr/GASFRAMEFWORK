import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { Shield, Wallet, Key, Eye, EyeOff, AlertTriangle, Check, Copy, Lock, Unlock, X, Smartphone } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router';

const PERMISSIONS = [
  { id: 'badges',    label: 'Claim Badges',       desc: 'Allow claiming skill badges on-chain',      enabled: true  },
  { id: 'transfer',  label: 'Transfer Credentials',desc: 'Allow transferring NFT credentials',        enabled: false },
  { id: 'share',     label: 'Public Profile',      desc: 'Make your profile visible to everyone',    enabled: true  },
  { id: 'analytics', label: 'Usage Analytics',     desc: 'Share anonymous usage data to improve UX', enabled: true  },
];

export function SecurityPage() {
  const { user, disconnectWallet } = useUser();
  const navigate = useNavigate();
  const [showAddress, setShowAddress] = useState(false);
  const [copied, setCopied] = useState(false);
  const [permissions, setPermissions] = useState(PERMISSIONS);
  const [twoFA, setTwoFA] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFAStep, setTwoFAStep] = useState<'setup' | 'verify' | 'done'>('setup');
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFAError, setTwoFAError] = useState('');
  // Fake TOTP secret for demo
  const TOTP_SECRET = 'JBSWY3DPEHPK3PXP';
  const TOTP_QR_URL = `otpauth://totp/ZeroGas:${user.username || 'user'}?secret=${TOTP_SECRET}&issuer=ZeroGas`;
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);

  const handleCopy = () => {
    if (user.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setConfirmDisconnect(false);
    navigate('/');
  };

  const togglePermission = (id: string) =>
    setPermissions(ps => ps.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,var(--primary),var(--secondary))' }}>
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold" style={{ fontFamily: 'var(--font-heading)' }}>Security</h1>
            <p className="text-sm text-muted-foreground">Manage wallet & permissions</p>
          </div>
        </div>

        <div className="space-y-6">

          {/* Connected Wallet */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
            <GlassCard className="p-6" hover={false}>
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-lg">Connected Wallet</h2>
                {user.isConnected && (
                  <span className="ml-auto flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-green-500/15 text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Connected
                  </span>
                )}
              </div>

              {user.walletAddress ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                    style={{ background: 'linear-gradient(135deg,var(--primary),var(--secondary))' }}>
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{user.username}</p>
                    <code className="text-xs text-muted-foreground font-mono truncate block">
                      {showAddress
                        ? user.walletAddress
                        : `${user.walletAddress.slice(0, 8)}${'•'.repeat(20)}${user.walletAddress.slice(-4)}`}
                    </code>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setShowAddress(v => !v)}
                      className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] flex items-center justify-center transition-colors">
                      {showAddress ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                    </button>
                    <button onClick={handleCopy}
                      className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] flex items-center justify-center transition-colors">
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />
                  <p className="text-sm text-yellow-300">No wallet connected. Go back and connect your wallet.</p>
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* 2FA Toggle */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <GlassCard className="p-6" hover={false}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: twoFA ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)' }}>
                    {twoFA ? <Lock className="w-5 h-5 text-green-400" /> : <Unlock className="w-5 h-5 text-muted-foreground" />}
                  </div>
                  <div>
                    <p className="font-bold">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      {twoFA ? 'Extra security is enabled' : 'Add an extra layer of security'}
                    </p>
                  </div>
                </div>
                <button onClick={() => twoFA ? setTwoFA(false) : setShow2FAModal(true)}
                  className="rounded-full relative flex-shrink-0"
                  style={{ height: '24px', width: '44px', background: twoFA ? 'var(--primary)' : 'rgba(255,255,255,0.1)', boxShadow: twoFA ? '0 0 12px var(--primary)' : 'none', transition: 'background 0.3s, box-shadow 0.3s' }}>
                  <motion.span className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
                    animate={{ left: twoFA ? '24px' : '2px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                </button>
              </div>
              {twoFA && (
                <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Check className="w-4 h-4 text-green-400 shrink-0" />
                  <p className="text-xs text-green-300">Authenticator app is active. Your account is protected.</p>
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* 2FA Setup Modal */}
          <AnimatePresence>
            {show2FAModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => { setShow2FAModal(false); setTwoFAStep('setup'); setTwoFACode(''); setTwoFAError(''); }} />
                <motion.div initial={{ opacity: 0, scale: 0.92, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 16 }}
                  className="relative w-full max-w-sm rounded-2xl border border-white/[0.12] overflow-hidden z-10"
                  style={{ background: 'linear-gradient(135deg,rgba(14,9,28,0.99),rgba(6,6,16,0.99))', boxShadow: '0 24px 80px rgba(0,0,0,0.8)' }}>
                  <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,var(--primary),var(--secondary))' }} />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-white">Set Up 2FA</h3>
                      </div>
                      <button onClick={() => { setShow2FAModal(false); setTwoFAStep('setup'); setTwoFACode(''); setTwoFAError(''); }}
                        className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.12] text-white/50">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {twoFAStep === 'setup' && (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                        </p>
                        {/* QR code visual */}
                        <div className="flex justify-center">
                          <div className="w-40 h-40 bg-white rounded-xl p-3 flex items-center justify-center">
                            <div className="w-full h-full grid grid-cols-7 gap-[2px]">
                              {Array.from({ length: 49 }, (_, i) => {
                                const isCorner = [0,1,2,7,8,9,14,15,16,4,5,6,11,12,13,18,19,20,28,29,30,35,36,37,42,43,44].includes(i);
                                const hash = (i * 37 + TOTP_SECRET.charCodeAt(i % TOTP_SECRET.length)) % 3;
                                return <div key={i} className="rounded-[1px]" style={{ background: (isCorner || hash !== 0) ? '#7C3AED' : 'white' }} />;
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                          <p className="text-xs text-muted-foreground mb-1">Or enter this key manually:</p>
                          <code className="text-sm font-mono text-primary tracking-widest">{TOTP_SECRET}</code>
                        </div>
                        <button onClick={() => setTwoFAStep('verify')}
                          className="w-full py-3 rounded-xl font-semibold text-white"
                          style={{ background: 'linear-gradient(135deg,var(--primary),var(--secondary))' }}>
                          I've scanned it → Next
                        </button>
                      </div>
                    )}

                    {twoFAStep === 'verify' && (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Enter the 6-digit code from your authenticator app to confirm setup.
                        </p>
                        <input
                          type="text" inputMode="numeric" maxLength={6}
                          value={twoFACode} onChange={e => { setTwoFACode(e.target.value.replace(/\D/g,'')); setTwoFAError(''); }}
                          placeholder="000000"
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-center text-2xl font-mono tracking-[0.5em] outline-none focus:border-primary/60 transition-all"
                        />
                        {twoFAError && <p className="text-red-400 text-xs text-center">{twoFAError}</p>}
                        <button onClick={() => {
                          if (twoFACode.length !== 6) { setTwoFAError('Enter a 6-digit code'); return; }
                          // Accept any 6-digit code for demo
                          setTwoFAStep('done');
                          setTimeout(() => { setTwoFA(true); setShow2FAModal(false); setTwoFAStep('setup'); setTwoFACode(''); }, 1200);
                        }}
                          className="w-full py-3 rounded-xl font-semibold text-white"
                          style={{ background: 'linear-gradient(135deg,var(--primary),var(--secondary))' }}>
                          Verify & Enable
                        </button>
                        <button onClick={() => setTwoFAStep('setup')} className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          ← Back
                        </button>
                      </div>
                    )}

                    {twoFAStep === 'done' && (
                      <div className="text-center py-4 space-y-3">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}
                          className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                          <Check className="w-8 h-8 text-green-400" />
                        </motion.div>
                        <p className="font-bold text-white">2FA Enabled!</p>
                        <p className="text-sm text-muted-foreground">Your account is now protected with two-factor authentication.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* App Permissions */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
            <GlassCard className="p-6" hover={false}>
              <div className="flex items-center gap-2 mb-4">
                <Key className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-lg">App Permissions</h2>
              </div>
              <div className="space-y-3">
                {permissions.map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div>
                      <p className="text-sm font-semibold">{p.label}</p>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                    </div>
                    <button onClick={() => togglePermission(p.id)}
                      className="rounded-full relative flex-shrink-0"
                      style={{ height: '22px', width: '40px', background: p.enabled ? 'var(--primary)' : 'rgba(255,255,255,0.1)', boxShadow: p.enabled ? '0 0 10px var(--primary)' : 'none', transition: 'background 0.3s, box-shadow 0.3s' }}>
                      <motion.span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
                        animate={{ left: p.enabled ? '20px' : '2px' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Danger Zone */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
            <GlassCard className="p-6" hover={false} style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h2 className="font-bold text-lg text-red-400">Danger Zone</h2>
              </div>

              {/* Disconnect Wallet */}
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold">Disconnect Wallet</p>
                    <p className="text-xs text-muted-foreground">Removes your wallet from this session</p>
                  </div>
                  {!confirmDisconnect ? (
                    <button onClick={() => setConfirmDisconnect(true)}
                      className="px-3 py-1.5 rounded-lg text-sm font-semibold text-red-400 border border-red-500/30 hover:bg-red-500/15 transition-colors">
                      Disconnect
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => setConfirmDisconnect(false)}
                        className="px-3 py-1.5 rounded-lg text-sm font-semibold text-muted-foreground border border-white/10 hover:bg-white/[0.06] transition-colors">
                        Cancel
                      </button>
                      <button onClick={handleDisconnect}
                        className="px-3 py-1.5 rounded-lg text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors">
                        Confirm
                      </button>
                    </div>
                  )}
                </div>
                {confirmDisconnect && (
                  <p className="text-xs text-red-400 mt-1">Are you sure? You'll need to reconnect your wallet.</p>
                )}
              </div>
            </GlassCard>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
