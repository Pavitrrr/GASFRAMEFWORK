import { Logo } from './Logo';
import { Link } from 'react-router';
import { Github } from 'lucide-react';

export function Footer() {
  const platformLinks = [
    { label: 'Claim Badges', path: '/claim'       },
    { label: 'Leaderboard',  path: '/leaderboard' },
    { label: 'My Profile',   path: '/profile'     },
    { label: 'History',      path: '/history'     },
  ];

  return (
    <footer className="border-t border-white/[0.06] backdrop-blur-[20px] bg-card/30 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <Logo />
            <p className="text-sm text-muted-foreground mt-4 max-w-sm">
              Prove your skills on-chain. Earn soulbound NFT credentials with zero gas fees,
              powered by User Generated Funds on Base Sepolia.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="https://github.com/Pavitrrr/GASFRAMEFWORK" target="_blank" rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 transition-all">
                <Github className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
              </a>
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="text-sm font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Platform</h4>
            <ul className="space-y-2.5">
              {platformLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-sm text-muted-foreground">© 2026 ZeroGas. All rights reserved.</p>
          <div className="flex gap-5 text-sm text-muted-foreground">
            <span>Built on Base Sepolia</span>
            <span>·</span>
            <span>Powered by UGF</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
