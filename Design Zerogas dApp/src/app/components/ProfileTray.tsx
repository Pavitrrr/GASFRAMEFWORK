import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  User, Settings, LogOut, Copy, Pencil, Shield, Bell,
  ChevronRight, Check, Wallet, ChevronLeft, Palette, Image, Monitor,
  Moon, Sun, Sparkles,
} from 'lucide-react';
import { useUser, AVATAR_OPTIONS, AppTheme, AppWallpaper } from '../context/UserContext';

interface ProfileTrayProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}

type TrayPanel = 'main' | 'editProfile' | 'settings';

// Each theme has a dark + light variant shown as a split card
interface ThemeGroup {
  name: string;
  emoji: string;
  darkId: AppTheme;
  lightId: AppTheme;
  dark: { bg: string; accent: string; secondary: string; text: string };
  light: { bg: string; accent: string; secondary: string; text: string };
}

const THEME_GROUPS: ThemeGroup[] = [
  {
    name: 'Purple', emoji: '💜',
    darkId: 'purple-dark', lightId: 'purple-light',
    dark:  { bg: '#080B14', accent: '#7C3AED', secondary: '#06B6D4', text: '#F8FAFC' },
    light: { bg: '#FAFBFF', accent: '#6D28D9', secondary: '#0891B2', text: '#0F172A' },
  },
  {
    name: 'Midnight', emoji: '🌊',
    darkId: 'midnight-dark', lightId: 'midnight-light',
    dark:  { bg: '#00061A', accent: '#3B82F6', secondary: '#38BDF8', text: '#CBD5E1' },
    light: { bg: '#EFF6FF', accent: '#2563EB', secondary: '#0EA5E9', text: '#1E3A5F' },
  },
  {
    name: 'Aurora', emoji: '🌿',
    darkId: 'aurora-dark', lightId: 'aurora-light',
    dark:  { bg: '#010D08', accent: '#10B981', secondary: '#06B6D4', text: '#D1FAE5' },
    light: { bg: '#ECFDF5', accent: '#059669', secondary: '#0891B2', text: '#064E3B' },
  },
  {
    name: 'Cyber', emoji: '⚡',
    darkId: 'cyber-dark', lightId: 'cyber-light',
    dark:  { bg: '#080400', accent: '#F59E0B', secondary: '#EF4444', text: '#FEF3C7' },
    light: { bg: '#FFFBEB', accent: '#D97706', secondary: '#DC2626', text: '#451A03' },
  },
  {
    name: 'Rose', emoji: '🌸',
    darkId: 'rose-dark', lightId: 'rose-light',
    dark:  { bg: '#0D0508', accent: '#EC4899', secondary: '#F43F5E', text: '#FCE7F3' },
    light: { bg: '#FFF1F5', accent: '#E11D48', secondary: '#DB2777', text: '#881337' },
  },
];

const WALLPAPERS: { id: AppWallpaper; label: string; icon: string; desc: string; gradient: string }[] = [
  { id: 'none',      label: 'None',      icon: '⬛', desc: 'Clean',      gradient: 'linear-gradient(135deg,#111,#1a1a2e)' },
  { id: 'particles', label: 'Particles', icon: '✨', desc: 'Nodes',      gradient: 'linear-gradient(135deg,#0a0020,#1a0a3d)' },
  { id: 'matrix',    label: 'Matrix',    icon: '🟩', desc: 'Code rain',  gradient: 'linear-gradient(135deg,#000,#001a00)' },
  { id: 'nebula',    label: 'Nebula',    icon: '🌌', desc: 'Cosmic',     gradient: 'linear-gradient(135deg,#0a0020,#200040)' },
  { id: 'grid',      label: 'Grid',      icon: '🔷', desc: 'Scrolling',  gradient: 'linear-gradient(135deg,#080B14,#0d1a2e)' },
  { id: 'waves',     label: 'Waves',     icon: '🌊', desc: 'Rotating',   gradient: 'linear-gradient(135deg,#000510,#001020)' },
  { id: 'fireflies', label: 'Fireflies', icon: '🌟', desc: 'Glowing',    gradient: 'linear-gradient(135deg,#050010,#0a0520)' },
  { id: 'starfield', label: 'Starfield', icon: '🚀', desc: 'Warp speed', gradient: 'linear-gradient(135deg,#000005,#05000f)' },
  { id: 'lava',      label: 'Lava Lamp', icon: '🫧', desc: 'Morphing',   gradient: 'linear-gradient(135deg,#0d0020,#001020)' },
];
const ACCENT_COLORS = [
  { color: '#7C3AED', name: 'Violet' },  { color: '#06B6D4', name: 'Cyan' },
  { color: '#10B981', name: 'Emerald' }, { color: '#F59E0B', name: 'Amber' },
  { color: '#EF4444', name: 'Red' },     { color: '#EC4899', name: 'Pink' },
  { color: '#8B5CF6', name: 'Purple' },  { color: '#3B82F6', name: 'Blue' },
  { color: '#F97316', name: 'Orange' },  { color: '#14B8A6', name: 'Teal' },
];

export function ProfileTray({ isOpen, onClose, anchorRef }: ProfileTrayProps) {
  const { user, disconnectWallet, updateProfile, updateSettings } = useUser();
  const navigate = useNavigate();
  const trayRef = useRef<HTMLDivElement>(null);
  const [panel, setPanel] = useState<TrayPanel>('main');
  const [editUsername, setEditUsername] = useState(user.username);
  const [editAvatar, setEditAvatar] = useState(user.avatar);
  const [copied, setCopied] = useState(false);
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);
  const [particles, setParticles] = useState<{id:number;x:number;y:number;color:string}[]>([]);

  useEffect(() => { if (!isOpen) setTimeout(() => setPanel('main'), 200); }, [isOpen]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (trayRef.current && !trayRef.current.contains(e.target as Node) &&
          anchorRef.current && !anchorRef.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [isOpen, onClose, anchorRef]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [isOpen, onClose]);

  // Spawn sparkle particles on theme click
  const spawnParticles = (x: number, y: number, color: string) => {
    const newP = Array.from({length: 8}, (_, i) => ({ id: Date.now() + i, x, y, color }));
    setParticles(p => [...p, ...newP]);
    setTimeout(() => setParticles(p => p.filter(pp => !newP.find(n => n.id === pp.id))), 800);
  };

  const shortAddress = user.walletAddress
    ? `${user.walletAddress.slice(0,6)}...${user.walletAddress.slice(-4)}` : null;

  const handleCopyAddress = () => {
    if (user.walletAddress) { navigator.clipboard.writeText(user.walletAddress); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };
  const handleSaveProfile = () => { updateProfile({ username: editUsername.trim() || user.username, avatar: editAvatar }); setPanel('main'); };
  const handleNavigate = (path: string) => { navigate(path); onClose(); };
  const handleDisconnect = () => { disconnectWallet(); onClose(); };

  // Find current theme group
  const currentGroup = THEME_GROUPS.find(g => g.darkId === user.settings.theme || g.lightId === user.settings.theme) ?? THEME_GROUPS[0];
  const isDarkVariant = user.settings.theme === currentGroup.darkId;
  const currentVariant = isDarkVariant ? currentGroup.dark : currentGroup.light;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div ref={trayRef}
          initial={{ opacity: 0, scale: 0.88, y: -16, rotateX: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: -16, rotateX: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-0 top-full mt-2 rounded-2xl border overflow-hidden z-[200]"
          style={{
            width: '320px',
            background: 'linear-gradient(160deg,rgba(12,7,24,0.99) 0%,rgba(5,5,14,0.99) 100%)',
            borderColor: `${currentVariant.accent}30`,
            boxShadow: `0 32px 80px rgba(0,0,0,0.85), 0 0 0 1px ${currentVariant.accent}20, 0 0 40px ${currentVariant.accent}10`,
          }}
        >
          {/* Animated rainbow top bar */}
          <motion.div className="h-[3px] w-full"
            style={{ background: `linear-gradient(90deg, ${currentVariant.accent}, ${currentVariant.secondary}, ${currentVariant.accent}, ${currentVariant.secondary})`, backgroundSize: '200% 100%' }}
            animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          />

          {/* Floating sparkle particles */}
          {particles.map((p, i) => (
            <motion.div key={p.id} className="absolute w-2 h-2 rounded-full pointer-events-none z-50"
              style={{ left: p.x, top: p.y, background: p.color }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: [0, 1.5, 0], opacity: [1, 0.8, 0], x: [(i%2===0?1:-1)*Math.random()*40], y: [-Math.random()*50-20] }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
          ))}

          <AnimatePresence mode="wait">
            {panel === 'main' && (
              <motion.div key="main" initial={{ opacity:0, x:-15 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-15 }} transition={{ duration:0.18 }}>
                <div className="p-4 border-b border-white/[0.07]">
                  <div className="flex items-center gap-3">
                    <motion.div className="relative shrink-0" whileHover={{ scale:1.06, rotate:3 }}>
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                        style={{ background:`linear-gradient(135deg,${currentVariant.accent},${currentVariant.secondary})` }}>
                        {user.avatar}
                      </div>
                      {user.isConnected && <motion.span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#0c0718]"
                        animate={{ scale:[1,1.3,1], boxShadow:['0 0 0px #4ade80','0 0 8px #4ade80','0 0 0px #4ade80'] }}
                        transition={{ duration:2, repeat:Infinity }} />}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-base truncate">{user.username}</p>
                      {shortAddress
                        ? <button onClick={handleCopyAddress} className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors mt-0.5 group">
                            <span className="font-mono">{shortAddress}</span>
                            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                          </button>
                        : <p className="text-xs text-white/30 mt-0.5">No wallet connected</p>}
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <TrayItem icon={<User className="w-4 h-4"/>} iconColor={currentVariant.accent} label="My Profile" sub="View badges & achievements" onClick={() => handleNavigate('/profile')} arrow />
                  <TrayItem icon={<Pencil className="w-4 h-4"/>} iconColor="#22D3EE" label="Edit Profile" sub="Change username & avatar" onClick={() => { setEditUsername(user.username); setEditAvatar(user.avatar); setPanel('editProfile'); }} arrow />
                  <TrayItem icon={<Wallet className="w-4 h-4"/>} iconColor="#A78BFA" label="Transaction History" sub="View on-chain activity" onClick={() => handleNavigate('/history')} arrow />
                  <TrayItem icon={<Bell className="w-4 h-4"/>} iconColor="#FBBF24" label="Notifications" sub="Badge alerts & updates" badge="3" onClick={() => handleNavigate('/notifications')} arrow />
                  <TrayItem icon={<Shield className="w-4 h-4"/>} iconColor="#34D399" label="Security" sub="Manage wallet & permissions" onClick={() => handleNavigate('/security')} arrow />
                  <TrayItem icon={<Settings className="w-4 h-4"/>} iconColor="#94A3B8" label="Settings" sub="Themes, wallpapers & more" onClick={() => setPanel('settings')} arrow />
                </div>
                <div className="px-2 pb-2 border-t border-white/[0.06] pt-2">
                  <button onClick={handleDisconnect} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors group text-left">
                    <LogOut className="w-4 h-4 text-red-400/50 group-hover:text-red-400 transition-colors" />
                    <span className="text-sm font-semibold text-red-400/50 group-hover:text-red-400 transition-colors">
                      {user.isConnected ? 'Disconnect Wallet' : 'Sign Out'}
                    </span>
                  </button>
                </div>
              </motion.div>
            )}

            {panel === 'editProfile' && (
              <motion.div key="editProfile" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:20 }} transition={{ duration:0.18 }}>
                <PanelHeader title="Edit Profile" onBack={() => setPanel('main')} accent={currentVariant.accent} />
                <div className="p-4 space-y-4">
                  <div className="flex justify-center">
                    <motion.div whileHover={{ scale:1.1, rotate:8 }} whileTap={{ scale:0.95 }}
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl cursor-pointer"
                      style={{ background:`linear-gradient(135deg,${currentVariant.accent},${currentVariant.secondary})`, boxShadow:`0 8px 24px ${currentVariant.accent}50` }}>
                      {editAvatar}
                    </motion.div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/40 mb-2 uppercase tracking-wider">Avatar</p>
                    <div className="grid grid-cols-6 gap-1.5">
                      {AVATAR_OPTIONS.map((emoji, i) => (
                        <motion.button key={emoji} onClick={() => setEditAvatar(emoji)}
                          initial={{ opacity:0, scale:0.5 }} animate={{ opacity:1, scale:1 }} transition={{ delay:i*0.025 }}
                          whileHover={{ scale:1.2, rotate:5 }} whileTap={{ scale:0.85 }}
                          className="aspect-square rounded-lg text-xl flex items-center justify-center"
                          style={editAvatar===emoji ? { borderWidth:2, borderStyle:'solid', borderColor:currentVariant.accent, background:`${currentVariant.accent}25`, transform:'scale(1.1)' } : { background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)' }}>
                          {emoji}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/40 mb-2 uppercase tracking-wider">Username</p>
                    <input type="text" value={editUsername} onChange={e => setEditUsername(e.target.value)} maxLength={20}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none transition-all"
                      onFocus={e => e.target.style.borderColor=`${currentVariant.accent}80`}
                      onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'} />
                  </div>
                  <motion.button onClick={handleSaveProfile} whileHover={{ scale:1.02, y:-2 }} whileTap={{ scale:0.97 }}
                    className="w-full py-2.5 rounded-xl font-semibold text-white text-sm relative overflow-hidden"
                    style={{ background:`linear-gradient(135deg,${currentVariant.accent},${currentVariant.secondary})`, boxShadow:`0 4px 20px ${currentVariant.accent}50` }}>
                    <motion.div className="absolute inset-0 -translate-x-full"
                      animate={{ translateX:['-100%','100%'] }} transition={{ duration:1.5, repeat:Infinity, repeatDelay:1 }}
                      style={{ background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)' }} />
                    Save Changes
                  </motion.button>
                </div>
              </motion.div>
            )}

            {panel === 'settings' && (
              <motion.div key="settings" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:20 }} transition={{ duration:0.18 }}>
                <PanelHeader title="Settings" onBack={() => setPanel('main')} accent={currentVariant.accent} />
                <div className="p-4 space-y-6 max-h-[74vh] overflow-y-auto" style={{ scrollbarWidth:'thin' }}>

                  {/* ── APP THEME — dual dark/light cards ── */}
                  <div>
                    <SectionLabel icon={<Palette className="w-3.5 h-3.5"/>} label="App Theme" />
                    <p className="text-[10px] text-white/30 mb-3">Each theme has a dark 🌑 and light ☀️ variant</p>
                    <div className="space-y-2">
                      {THEME_GROUPS.map((group, gi) => {
                        const isGroupActive = user.settings.theme === group.darkId || user.settings.theme === group.lightId;
                        const activeDark = user.settings.theme === group.darkId;
                        const activeLight = user.settings.theme === group.lightId;
                        return (
                          <motion.div key={group.name}
                            initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:gi*0.06 }}
                            className="rounded-xl overflow-hidden border-2 transition-all duration-300"
                            style={{ borderColor: isGroupActive ? group.dark.accent : 'rgba(255,255,255,0.07)', boxShadow: isGroupActive ? `0 0 20px ${group.dark.accent}30` : 'none' }}
                          >
                            {/* Theme name header */}
                            <div className="flex items-center gap-2 px-3 py-1.5 border-b border-white/[0.06]"
                              style={{ background:`linear-gradient(90deg,${group.dark.accent}15,${group.light.accent}10)` }}>
                              <span className="text-sm">{group.emoji}</span>
                              <span className="text-xs font-bold text-white/70">{group.name}</span>
                              {isGroupActive && <motion.div initial={{ scale:0 }} animate={{ scale:1 }} className="ml-auto">
                                <Sparkles className="w-3 h-3" style={{ color: group.dark.accent }} />
                              </motion.div>}
                            </div>
                            {/* Dark + Light split */}
                            <div className="grid grid-cols-2">
                              {/* Dark variant */}
                              <motion.button
                                onClick={(e) => {
                                  const rect = (e.target as HTMLElement).getBoundingClientRect();
                                  const trayRect = trayRef.current?.getBoundingClientRect();
                                  if (trayRect) spawnParticles(rect.left - trayRect.left + 20, rect.top - trayRect.top, group.dark.accent);
                                  updateSettings({ theme: group.darkId, accentColor: group.dark.accent });
                                }}
                                onHoverStart={() => setHoveredTheme(group.darkId)}
                                onHoverEnd={() => setHoveredTheme(null)}
                                whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                                className="flex flex-col items-center gap-1.5 p-3 relative overflow-hidden transition-all duration-200"
                                style={{ background: activeDark ? `${group.dark.accent}20` : group.dark.bg }}
                              >
                                {activeDark && <motion.div className="absolute inset-0"
                                  style={{ background:`radial-gradient(circle at 50% 50%,${group.dark.accent}25,transparent 70%)` }}
                                  animate={{ opacity:[0.5,1,0.5] }} transition={{ duration:2, repeat:Infinity }} />}
                                <Moon className="w-4 h-4 relative z-10" style={{ color: activeDark ? group.dark.accent : 'rgba(255,255,255,0.4)' }} />
                                <span className="text-[10px] font-bold relative z-10" style={{ color: group.dark.text }}>Dark</span>
                                <div className="flex gap-1 relative z-10">
                                  <div className="w-3 h-3 rounded-full" style={{ background:group.dark.accent }} />
                                  <div className="w-3 h-3 rounded-full" style={{ background:group.dark.secondary }} />
                                </div>
                                {activeDark && <motion.div initial={{ scale:0 }} animate={{ scale:1 }} className="relative z-10">
                                  <Check className="w-3 h-3" style={{ color:group.dark.accent }} />
                                </motion.div>}
                              </motion.button>

                              {/* Light variant */}
                              <motion.button
                                onClick={(e) => {
                                  const rect = (e.target as HTMLElement).getBoundingClientRect();
                                  const trayRect = trayRef.current?.getBoundingClientRect();
                                  if (trayRect) spawnParticles(rect.left - trayRect.left + 20, rect.top - trayRect.top, group.light.accent);
                                  updateSettings({ theme: group.lightId, accentColor: group.light.accent });
                                }}
                                onHoverStart={() => setHoveredTheme(group.lightId)}
                                onHoverEnd={() => setHoveredTheme(null)}
                                whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                                className="flex flex-col items-center gap-1.5 p-3 relative overflow-hidden border-l border-white/[0.06] transition-all duration-200"
                                style={{ background: activeLight ? `${group.light.accent}15` : group.light.bg }}
                              >
                                {activeLight && <motion.div className="absolute inset-0"
                                  style={{ background:`radial-gradient(circle at 50% 50%,${group.light.accent}20,transparent 70%)` }}
                                  animate={{ opacity:[0.5,1,0.5] }} transition={{ duration:2, repeat:Infinity }} />}
                                <Sun className="w-4 h-4 relative z-10" style={{ color: activeLight ? group.light.accent : 'rgba(0,0,0,0.3)' }} />
                                <span className="text-[10px] font-bold relative z-10" style={{ color: group.light.text }}>Light</span>
                                <div className="flex gap-1 relative z-10">
                                  <div className="w-3 h-3 rounded-full" style={{ background:group.light.accent }} />
                                  <div className="w-3 h-3 rounded-full" style={{ background:group.light.secondary }} />
                                </div>
                                {activeLight && <motion.div initial={{ scale:0 }} animate={{ scale:1 }} className="relative z-10">
                                  <Check className="w-3 h-3" style={{ color:group.light.accent }} />
                                </motion.div>}
                              </motion.button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                    {/* Hover preview bar */}
                    <AnimatePresence>
                      {hoveredTheme && (() => {
                        const g = THEME_GROUPS.find(g => g.darkId===hoveredTheme || g.lightId===hoveredTheme);
                        const isDark = g?.darkId === hoveredTheme;
                        const v = isDark ? g?.dark : g?.light;
                        if (!g || !v) return null;
                        return (
                          <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:4 }}
                            className="mt-2 p-2 rounded-lg text-center text-xs border"
                            style={{ background:v.bg, borderColor:`${v.accent}30`, color:v.text }}>
                            <span style={{ color:v.accent }}>{g.emoji} {g.name} {isDark?'Dark':'Light'}</span>
                            {' '}— click to apply
                          </motion.div>
                        );
                      })()}
                    </AnimatePresence>
                  </div>

                  {/* ── HIGHLIGHT COLOR ── */}
                  <div>
                    <SectionLabel icon={<Palette className="w-3.5 h-3.5"/>} label="Highlight Color" />
                    <p className="text-[10px] text-white/30 mb-3">Overrides buttons, borders & active states</p>
                    <div className="flex gap-2 flex-wrap">
                      {ACCENT_COLORS.map((ac, i) => (
                        <motion.button key={ac.color}
                          onClick={() => updateSettings({ accentColor: ac.color })}
                          initial={{ opacity:0, scale:0, rotate:-180 }}
                          animate={{ opacity:1, scale:1, rotate:0 }}
                          transition={{ delay:i*0.04, type:'spring', stiffness:400, damping:20 }}
                          whileHover={{ scale:1.25, y:-3, rotate:10 }}
                          whileTap={{ scale:0.85 }}
                          title={ac.name}
                          className="w-8 h-8 rounded-full border-2 flex items-center justify-center relative"
                          style={{
                            background: ac.color,
                            borderColor: user.settings.accentColor===ac.color ? 'white' : 'transparent',
                            boxShadow: user.settings.accentColor===ac.color
                              ? `0 0 0 3px ${ac.color}40, 0 0 20px ${ac.color}80`
                              : `0 2px 8px ${ac.color}50`,
                          }}>
                          {user.settings.accentColor===ac.color && (
                            <motion.div initial={{ scale:0, rotate:-90 }} animate={{ scale:1, rotate:0 }} transition={{ type:'spring', stiffness:500 }}>
                              <Check className="w-3.5 h-3.5 text-white drop-shadow-lg" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* ── LIVE WALLPAPER ── */}
                  <div>
                    <SectionLabel icon={<Image className="w-3.5 h-3.5"/>} label="Live Wallpaper" />
                    <div className="grid grid-cols-3 gap-2">
                      {WALLPAPERS.map((w, i) => {
                        const active = user.settings.wallpaper === w.id;
                        return (
                          <motion.button key={w.id}
                            onClick={() => updateSettings({ wallpaper: w.id })}
                            initial={{ opacity:0, scale:0.7, y:10 }}
                            animate={{ opacity:1, scale:1, y:0 }}
                            transition={{ delay:i*0.06, type:'spring', stiffness:300 }}
                            whileHover={{ scale:1.07, y:-3 }}
                            whileTap={{ scale:0.93 }}
                            className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 relative overflow-hidden"
                            style={{
                              background: w.gradient,
                              borderColor: active ? currentVariant.accent : 'rgba(255,255,255,0.08)',
                              boxShadow: active ? `0 0 20px ${currentVariant.accent}60, inset 0 0 20px ${currentVariant.accent}10` : 'none',
                            }}>
                            {active && <>
                              <motion.div className="absolute inset-0 rounded-xl"
                                style={{ background:`linear-gradient(135deg,${currentVariant.accent}20,transparent)` }}
                                animate={{ opacity:[0.4,0.9,0.4] }} transition={{ duration:1.5, repeat:Infinity }} />
                              <motion.div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                                style={{ background:currentVariant.accent }}
                                animate={{ scale:[1,1.5,1], opacity:[1,0.5,1] }} transition={{ duration:1, repeat:Infinity }} />
                            </>}
                            <span className="text-2xl relative z-10">{w.icon}</span>
                            <span className="text-[10px] font-bold text-white/90 relative z-10">{w.label}</span>
                            <span className="text-[9px] text-white/40 relative z-10">{w.desc}</span>
                            {active && <motion.div initial={{ scale:0 }} animate={{ scale:1 }} className="relative z-10">
                              <Check className="w-3 h-3" style={{ color:currentVariant.accent }} />
                            </motion.div>}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── APP PREFERENCES ── */}
                  <div>
                    <SectionLabel icon={<Monitor className="w-3.5 h-3.5"/>} label="App Preferences" />
                    <div className="space-y-2">
                      <ToggleRow label="Compact Mode" sub="Reduce spacing & padding"
                        value={user.settings.compactMode} accent={currentVariant.accent}
                        onChange={v => updateSettings({ compactMode: v })} />
                      <ToggleRow label="Animations" sub="Motion effects & transitions"
                        value={user.settings.animationsEnabled} accent={currentVariant.accent}
                        onChange={v => updateSettings({ animationsEnabled: v })} />
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Sub-components ── */
function PanelHeader({ title, onBack, accent }: { title: string; onBack: () => void; accent: string }) {
  return (
    <div className="p-3 border-b border-white/[0.07] flex items-center gap-2">
      <motion.button onClick={onBack} whileHover={{ scale:1.1, x:-3 }} whileTap={{ scale:0.9 }}
        className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.12] transition-colors">
        <ChevronLeft className="w-4 h-4 text-white/50" />
      </motion.button>
      <p className="font-bold text-white text-sm">{title}</p>
      <motion.div className="ml-auto flex gap-1">
        {[0,1,2].map(i => (
          <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: accent }}
            animate={{ scale:[1,1.4,1], opacity:[0.4,1,0.4] }}
            transition={{ duration:1.2, repeat:Infinity, delay:i*0.2 }} />
        ))}
      </motion.div>
    </div>
  );
}

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      <span className="text-white/40">{icon}</span>
      <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function TrayItem({ icon, iconColor, label, sub, onClick, arrow, badge }: {
  icon: React.ReactNode; iconColor: string; label: string; sub: string;
  onClick?: () => void; arrow?: boolean; badge?: string;
}) {
  return (
    <motion.button onClick={onClick} whileHover={{ x:3 }}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors duration-150 group text-left">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background:`${iconColor}18`, color:iconColor }}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-white/90">{label}</p>
        <p className="text-xs text-white/35">{sub}</p>
      </div>
      {badge && <motion.span animate={{ scale:[1,1.15,1] }} transition={{ duration:2, repeat:Infinity }}
        className="text-xs px-1.5 py-0.5 rounded-full font-bold"
        style={{ background:`${iconColor}25`, color:iconColor }}>{badge}</motion.span>}
      {arrow && <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />}
    </motion.button>
  );
}

function ToggleRow({ label, sub, value, onChange, accent }: {
  label: string; sub: string; value: boolean; onChange: (v: boolean) => void; accent: string;
}) {
  return (
    <motion.div whileHover={{ scale:1.01 }}
      className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
      <div>
        <p className="text-sm font-semibold text-white/80">{label}</p>
        <p className="text-xs text-white/30">{sub}</p>
      </div>
      <motion.button onClick={() => onChange(!value)} whileTap={{ scale:0.88 }}
        className="rounded-full relative"
        style={{ height:'22px', width:'40px', background:value ? accent : 'rgba(255,255,255,0.1)', boxShadow:value ? `0 0 12px ${accent}70` : 'none', transition:'background 0.3s, box-shadow 0.3s' }}>
        <motion.span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-lg"
          animate={{ left: value ? '20px' : '2px' }}
          transition={{ type:'spring', stiffness:600, damping:35 }} />
      </motion.button>
    </motion.div>
  );
}
