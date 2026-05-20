import { useRef, useState } from 'react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { ProfileTray } from './ProfileTray';
import { Wallet, X } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useUser } from '../context/UserContext';

export function Navbar() {
  const location = useLocation();
  const { user, connectWallet, connectMetaMask, disconnectWallet } = useUser();
  const [trayOpen, setTrayOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const profileBtnRef = useRef<HTMLButtonElement>(null);

  const navLinks = [
    { id: 'claim', label: 'Claim Badges', path: '/claim' },
    { id: 'payment', label: 'Payment', path: '/payment' },
    { id: 'leaderboard', label: 'Leaderboard', path: '/leaderboard' },
    { id: 'profile', label: 'My Profile', path: '/profile' },
    { id: 'history', label: 'History', path: '/history' },
  ];

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    await connectMetaMask();
    setIsConnecting(false);
  };

  const shortAddress = user.walletAddress
    ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
    : null;

  return (
    <nav className="sticky top-0 z-50 h-[68px] border-b border-white/[0.06] backdrop-blur-[20px] bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <Logo />
        </Link>

        {/* Center Navigation */}
        <div className="hidden lg:flex items-center gap-2 bg-white/[0.03] rounded-full p-1.5 border border-white/[0.06]">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              to={link.path}
              className={`px-5 py-2 rounded-full text-sm transition-all duration-200 ${
                location.pathname === link.path
                  ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user.hasOnboarded && user.isConnected ? (
            /* Connected state — matches original: avatar pill + address + X */
            <div className="relative flex items-center gap-2">
              {/* Avatar + username + address pill — click opens tray */}
              <button
                ref={profileBtnRef}
                onClick={() => setTrayOpen((v) => !v)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.10] hover:bg-white/[0.09] hover:border-primary/40 transition-all duration-200"
              >
                {/* Avatar circle */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-base relative shrink-0"
                  style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)' }}
                >
                  {user.avatar}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-background" />
                </div>
                {/* Address text — show username if available, else address */}
                <span className="text-sm font-semibold text-foreground max-w-[100px] truncate">
                  {user.username || shortAddress}
                </span>
                {/* Chevron */}
                <svg
                  className={`w-3 h-3 text-muted-foreground transition-transform duration-200 ${trayOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* X disconnect button — matches original design */}
              <button
                onClick={() => disconnectWallet()}
                className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.10] hover:bg-red-500/20 hover:border-red-500/40 flex items-center justify-center transition-all duration-200"
                title="Disconnect"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground hover:text-red-400" />
              </button>

              <ProfileTray
                isOpen={trayOpen}
                onClose={() => setTrayOpen(false)}
                anchorRef={profileBtnRef}
              />
            </div>
          ) : user.hasOnboarded && !user.isConnected ? (
            /* Onboarded but wallet disconnected */
            <div className="relative flex items-center gap-2">
              <button
                ref={profileBtnRef}
                onClick={() => setTrayOpen((v) => !v)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.10] hover:bg-white/[0.09] transition-all duration-200"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0"
                  style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.4) 0%, rgba(6,182,212,0.4) 100%)' }}
                >
                  {user.avatar}
                </div>
                <span className="text-sm font-semibold text-foreground/70">{user.username}</span>
              </button>

              <ProfileTray
                isOpen={trayOpen}
                onClose={() => setTrayOpen(false)}
                anchorRef={profileBtnRef}
              />

              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="flex group px-3 sm:px-5 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold items-center gap-2 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_4px_20px_rgba(124,58,237,0.35)] relative overflow-hidden disabled:opacity-70 text-sm"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                {isConnecting
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <Wallet className="w-4 h-4 relative" />}
                <span className="relative hidden sm:inline">{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            </div>
          ) : (
            /* Not onboarded — connect wallet button works on all screen sizes */
            <>
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="flex group px-3 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold items-center gap-2 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_4px_20px_rgba(124,58,237,0.35)] hover:shadow-[0_6px_24px_rgba(124,58,237,0.45)] relative overflow-hidden disabled:opacity-70"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                {isConnecting
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin relative" />
                  : <Wallet className="w-4 h-4 relative" />}
                <span className="relative hidden sm:inline">{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
