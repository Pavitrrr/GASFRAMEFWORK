import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { Wallet } from 'lucide-react';
import { Link, useLocation } from 'react-router';

export function Navbar() {
  const location = useLocation();

  const navLinks = [
    { id: 'claim', label: 'Claim Badges', path: '/claim' },
    { id: 'leaderboard', label: 'Leaderboard', path: '/leaderboard' },
    { id: 'profile', label: 'My Profile', path: '/profile' },
    { id: 'history', label: 'History', path: '/history' },
  ];

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
              className={`px-5 py-2 rounded-full transition-all duration-200 ${
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
          <button className="hidden sm:flex group px-4 sm:px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold items-center gap-2 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_4px_20px_rgba(124,58,237,0.35)] hover:shadow-[0_6px_24px_rgba(124,58,237,0.45)] relative overflow-hidden">
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <Wallet className="w-4 h-4 relative" />
            <span className="relative hidden sm:inline">Connect Wallet</span>
          </button>
          {/* Mobile wallet button */}
          <button className="sm:hidden w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground flex items-center justify-center shadow-[0_4px_20px_rgba(124,58,237,0.35)]">
            <Wallet className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
