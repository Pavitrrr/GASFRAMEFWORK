import { useState } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { Copy, QrCode, ExternalLink, Fuel } from 'lucide-react';
import { Linkedin, Twitter } from 'lucide-react';

const stats = [
  { label: 'Certificates', value: '12', gradient: true },
  { label: 'Skills', value: '8', gradient: true },
  { label: 'Avg Score', value: '89%', gradient: true },
  { label: 'Achievements', value: '24', gradient: true },
];

const certificates = [
  { skill: 'React Development', emoji: '⚛️', score: 92, issuer: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72', date: '2026-05-15' },
  { skill: 'Smart Contracts', emoji: '🔐', score: 88, issuer: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', date: '2026-05-10' },
  { skill: 'Web3 Development', emoji: '🌐', score: 95, issuer: '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c', date: '2026-05-05' },
  { skill: 'DeFi Protocols', emoji: '🔗', score: 85, issuer: '0x95cED938F7991cd0dFcb48F0a06a40FA1aF46EBC', date: '2026-04-28' },
];

const achievements = [
  { tier: 'Gold', name: 'Perfect Score', icon: '🎯', locked: false, color: '#FFD700' },
  { tier: 'Gold', name: 'Speed Runner', icon: '⚡', locked: false, color: '#FFD700' },
  { tier: 'Silver', name: 'Streak Master', icon: '🔥', locked: false, color: '#C0C0C0' },
  { tier: 'Silver', name: 'Community Helper', icon: '🤝', locked: false, color: '#C0C0C0' },
  { tier: 'Bronze', name: 'First Steps', icon: '👣', locked: false, color: '#CD7F32' },
  { tier: 'Bronze', name: 'Early Bird', icon: '🐦', locked: false, color: '#CD7F32' },
  { tier: 'Gold', name: 'Legendary', icon: '👑', locked: true, color: '#FFD700' },
  { tier: 'Silver', name: 'Mentor', icon: '🎓', locked: true, color: '#C0C0C0' },
];

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'certificates' | 'achievements'>('certificates');
  const [showQR, setShowQR] = useState(false);

  const walletAddress = '0x8Ba1f109551bD432803012645Ac136ddd64DBA72';
  const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <GlassCard className="p-8 mb-8" hover={false}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              {/* Gradient Avatar */}
              <div
                className="w-18 h-18 rounded-xl flex items-center justify-center text-4xl text-white shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                  boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                }}
              >
                {walletAddress.slice(2, 4).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1
                    className="text-3xl"
                    style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}
                  >
                    {shortAddress}
                  </h1>
                  <div className="px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-bold flex items-center gap-1">
                    ✦ This is you
                  </div>
                </div>
                <code
                  className="text-sm text-muted-foreground block"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {walletAddress}
                </code>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] border border-white/10 hover:border-primary/30 text-sm font-semibold transition-all duration-200 flex items-center gap-2">
                <Copy className="w-4 h-4" />
                Copy Link
              </button>
              <button
                onClick={() => setShowQR(!showQR)}
                className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] border border-white/10 hover:border-primary/30 text-sm font-semibold transition-all duration-200 flex items-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                QR Code
              </button>
              <button className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] border border-white/10 hover:border-primary/30 text-sm font-semibold transition-all duration-200">
                𝕏
              </button>
              <button className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] border border-white/10 hover:border-primary/30 text-sm font-semibold transition-all duration-200">
                <Linkedin className="w-4 h-4" />
              </button>
              <button className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] border border-white/10 hover:border-primary/30 text-sm font-semibold transition-all duration-200 flex items-center gap-2">
                BaseScan
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* QR Panel */}
          {showQR && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-white/[0.08]"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-48 h-48 bg-white rounded-xl p-4 flex items-center justify-center">
                  {/* Simple QR placeholder - in production would use actual QR library */}
                  <div className="w-full h-full grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`${Math.random() > 0.5 ? 'bg-primary' : 'bg-white'}`}
                      />
                    ))}
                  </div>
                </div>
                <code
                  className="text-sm text-muted-foreground"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  https://skillstamp.xyz/{shortAddress}
                </code>
              </div>
            </motion.div>
          )}
        </GlassCard>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <GlassCard className="p-6 text-center">
                <div
                  className="text-4xl mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                  style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Gas Savings Banner */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-success/20 border border-success/40">
            <Fuel className="w-4 h-4 text-success" />
            <span className="text-success font-semibold">Total gas saved: 0.042 ETH via UGF</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-white/[0.08]">
          <button
            onClick={() => setActiveTab('certificates')}
            className={`pb-4 px-2 font-semibold transition-all duration-200 relative ${
              activeTab === 'certificates' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="flex items-center gap-2">
              🏅 Certificates
            </span>
            {activeTab === 'certificates' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`pb-4 px-2 font-semibold transition-all duration-200 relative ${
              activeTab === 'achievements' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="flex items-center gap-2">
              🏆 Achievements
            </span>
            {activeTab === 'achievements' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
              />
            )}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'certificates' ? (
          <div className="space-y-6">
            {certificates.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <GlassCard className="p-6 relative overflow-hidden">
                  {/* Holographic top gradient line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{
                      background: 'linear-gradient(90deg, #7C3AED 0%, #06B6D4 100%)',
                    }}
                  />

                  <div className="flex items-center gap-6">
                    {/* Medal emoji with glow */}
                    <div className="relative">
                      <div
                        className="absolute inset-0 blur-2xl"
                        style={{
                          background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)',
                          transform: 'scale(1.5)',
                        }}
                      />
                      <div className="relative text-5xl">{cert.emoji}</div>
                    </div>

                    <div className="flex-1">
                      <h3
                        className="text-xl mb-1"
                        style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
                      >
                        {cert.skill}
                      </h3>
                      <code
                        className="text-xs text-muted-foreground"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        Issued by {cert.issuer}
                      </code>
                      <div className="text-xs text-muted-foreground mt-1">{cert.date}</div>
                    </div>

                    <div
                      className="text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                      style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}
                    >
                      {cert.score}%
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <GlassCard
                  className={`p-6 text-center ${achievement.locked ? 'opacity-50 grayscale' : ''}`}
                  style={
                    !achievement.locked
                      ? {
                          border: `2px solid ${achievement.color}`,
                          boxShadow: `0 0 20px ${achievement.color}40`,
                        }
                      : {}
                  }
                >
                  <div className="text-4xl mb-3">
                    {achievement.locked ? '🔒' : achievement.icon}
                  </div>
                  <div
                    className="text-xs font-bold mb-2"
                    style={
                      !achievement.locked
                        ? {
                            color: achievement.color,
                          }
                        : {}
                    }
                  >
                    {achievement.tier}
                  </div>
                  <div className="text-sm font-semibold">{achievement.name}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
