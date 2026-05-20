import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { Bell, Award, Zap, Shield, Trophy, X, Check, Settings } from 'lucide-react';

interface Notification {
  id: number;
  type: 'badge' | 'achievement' | 'security' | 'system' | 'reward' | 'payment';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
}

const INITIAL: Notification[] = [
  { id: 1,  type: 'payment',    title: '💸 ETH Debited',             message: '0.1 SepoliaETH sent to 0x8Ba1...BA72. Transaction confirmed on Sepolia. Tx: 0xabc1...def2',  time: 'Just now',    read: false, icon: '📤' },
  { id: 2,  type: 'payment',    title: '💰 ETH Credited',            message: '0.05 SepoliaETH received from 0x742d...bEb4. Your balance has been updated.',                 time: '10 min ago',  read: false, icon: '📥' },
  { id: 3,  type: 'badge',      title: 'New Badge Available',        message: 'You qualify for the "Smart Contract Auditor" badge. Complete the assessment to claim it.',    time: '2 hours ago', read: false, icon: '🔐' },
  { id: 4,  type: 'achievement',title: 'Achievement Unlocked',       message: '"Speed Runner" achievement earned! You completed 3 assessments in under 24 hours.',           time: '3 hours ago', read: false, icon: '⚡' },
  { id: 5,  type: 'reward',     title: 'Gas Savings Milestone',      message: 'You\'ve saved 0.05 ETH in gas fees via UGF. Keep claiming badges to save more!',             time: '5 hours ago', read: false, icon: '⛽' },
  { id: 6,  type: 'payment',    title: '⛽ UGF Contribution Sent',   message: '0.01 ETH contributed to the UGF pool. Thank you for keeping ZeroGas free for everyone!',     time: '1 day ago',   read: true,  icon: '🌊' },
  { id: 7,  type: 'security',   title: 'New Wallet Connected',       message: 'Wallet 0x8Ba1...BA72 connected from Chrome on Windows.',                                     time: '1 day ago',   read: true,  icon: '🔒' },
  { id: 8,  type: 'badge',      title: 'Badge Expiring Soon',        message: 'Your "React Developer" badge expires in 30 days. Renew it to keep your credentials active.',  time: '2 days ago',  read: true,  icon: '⚛️' },
  { id: 9,  type: 'system',     title: 'Platform Update',            message: 'ZeroGas v2.1 is live! New: Payment page, QR sharing, and leaderboard filters.',              time: '3 days ago',  read: true,  icon: '🚀' },
  { id: 10, type: 'achievement',title: 'Leaderboard Rank Up',        message: 'You moved up to rank #42 on the global leaderboard. Top 50 — keep going!',                   time: '4 days ago',  read: true,  icon: '🏆' },
];

const TYPE_COLORS: Record<string, string> = {
  badge: '#7C3AED', achievement: '#F59E0B', security: '#EF4444', system: '#06B6D4', reward: '#10B981', payment: '#3B82F6',
};
const TYPE_ICONS: Record<string, React.ReactNode> = {
  badge: <Award className="w-4 h-4" />, achievement: <Trophy className="w-4 h-4" />,
  security: <Shield className="w-4 h-4" />, system: <Zap className="w-4 h-4" />, reward: <Bell className="w-4 h-4" />,
  payment: <Zap className="w-4 h-4" />,
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayed = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  const markRead = (id: number) => {
    // Mark as read, then auto-dismiss after short delay
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
    setTimeout(() => setNotifications(ns => ns.filter(n => n.id !== id)), 600);
  };
  const dismiss = (id: number) => setNotifications(ns => ns.filter(n => n.id !== id));
  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })));

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,var(--primary),var(--secondary))' }}>
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold" style={{ fontFamily: 'var(--font-heading)' }}>Notifications</h1>
              <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead}
                className="px-4 py-2 rounded-lg text-sm font-semibold border border-white/10 hover:bg-white/[0.06] transition-colors flex items-center gap-2">
                <Check className="w-4 h-4" /> Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'unread'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 capitalize ${filter === f ? 'text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground bg-white/[0.04] border border-white/[0.06]'}`}
              style={filter === f ? { background: 'linear-gradient(135deg,var(--primary),var(--secondary))' } : {}}>
              {f} {f === 'unread' && unreadCount > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs" style={{ background: 'var(--primary)', color: '#fff' }}>{unreadCount}</span>}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {displayed.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No {filter === 'unread' ? 'unread ' : ''}notifications</p>
              </motion.div>
            ) : displayed.map((n, i) => (
              <motion.div key={n.id} layout
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40, scaleY: 0.8 }}
                transition={{ duration: 0.22, delay: i * 0.03 }}>
                <GlassCard className={`p-4 relative overflow-hidden ${!n.read ? 'border-l-2' : ''}`}
                  style={!n.read ? { borderLeftColor: TYPE_COLORS[n.type] } : {}}>
                  {!n.read && <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ background: TYPE_COLORS[n.type] }} />}

                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 relative"
                      style={{ background: `${TYPE_COLORS[n.type]}20` }}>
                      {n.icon}
                      {!n.read && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background"
                        style={{ background: TYPE_COLORS[n.type] }} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                          style={{ background: `${TYPE_COLORS[n.type]}20`, color: TYPE_COLORS[n.type] }}>
                          {TYPE_ICONS[n.type]} {n.type}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">{n.time}</span>
                      </div>
                      <p className={`font-bold mb-1 ${n.read ? 'opacity-60' : ''}`}>{n.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{n.message}</p>
                    </div>

                    <div className="flex flex-col gap-1 shrink-0">
                      {!n.read && (
                        <button onClick={() => markRead(n.id)} title="Mark as read"
                          className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-green-500/20 flex items-center justify-center transition-colors">
                          <Check className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      )}
                      <button onClick={() => dismiss(n.id)} title="Dismiss"
                        className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-red-500/20 flex items-center justify-center transition-colors">
                        <X className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Notification settings link */}
        {notifications.length > 0 && (
          <div className="mt-8 text-center">
            <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Settings className="w-4 h-4" /> Manage notification preferences
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
