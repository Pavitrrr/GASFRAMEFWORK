import { Link, useLocation, useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import Logo from "./Logo";
import { Sun, Moon, Wallet } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar({ theme, toggleTheme }) {
  const { address, connect, disconnect, connecting } = useWallet();
  const location = useLocation();
  const navigate = useNavigate();

  const short = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  // Show saved name if user set one, otherwise show short address
  const savedName = address ? localStorage.getItem(`zerogas-name-${address}`) : null;
  const displayLabel = savedName || (address ? short(address) : "");

  // Re-read name whenever it changes (Profile page saves it)
  const [displayName, setDisplayName] = useState(displayLabel);

  useEffect(() => {
    function refresh() {
      const n = address ? localStorage.getItem(`zerogas-name-${address}`) : null;
      setDisplayName(n || (address ? short(address) : ""));
    }
    refresh();
    window.addEventListener("zerogas-name-updated", refresh);
    return () => window.removeEventListener("zerogas-name-updated", refresh);
  }, [address]);

  const navLinks = [
    { label: "Claim Badges", path: "/badges" },
    { label: "Payment", path: "/payment" },
    { label: "Leaderboard", path: "/leaderboard" },
    { label: "My Profile", path: address ? `/profile/${address}` : "/profile" },
    { label: "History", path: "/history" },
  ];

  return (
    <nav className="sticky top-0 z-50 h-[68px] border-b border-white/[0.06] backdrop-blur-[20px] bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <Logo />
        </Link>

        {/* Center nav */}
        <div className="hidden lg:flex items-center gap-2 bg-white/[0.03] rounded-full p-1.5 border border-white/[0.06]">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                location.pathname === link.path || location.pathname.startsWith(link.path + "/")
                  ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
              }`}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 transition-all duration-200 group">
            {theme === "dark"
              ? <Sun className="w-5 h-5 text-secondary group-hover:rotate-90 transition-transform duration-300" />
              : <Moon className="w-5 h-5 text-primary group-hover:-rotate-12 transition-transform duration-300" />
            }
          </button>

          {/* Wallet */}
          {address ? (
            <div className="flex items-center gap-2">
              <button onClick={() => navigate(`/profile/${address}`)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.10] hover:border-primary/40 hover:bg-primary/10 transition-all duration-200 group">
                {/* Avatar dot */}
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}>
                  {displayName && !displayName.includes("...")
                    ? displayName.slice(0, 2).toUpperCase()
                    : address.slice(2, 4).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors"
                  style={{ fontFamily: displayName && !displayName.includes("...") ? "var(--font-heading)" : "var(--font-mono)", fontSize: displayName && !displayName.includes("...") ? "0.88rem" : "0.78rem" }}>
                  {displayName}
                </span>
                <div className="w-2 h-2 rounded-full bg-success" title="Connected" />
              </button>
              <button onClick={disconnect}
                className="w-9 h-9 rounded-full bg-white/[0.05] border border-white/[0.08] hover:border-destructive/40 hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-all text-xs font-bold">
                ✕
              </button>
            </div>
          ) : (
            <button onClick={connect} disabled={connecting}
              className="group hidden sm:flex px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold items-center gap-2 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_4px_20px_rgba(124,58,237,0.35)] hover:shadow-[0_6px_24px_rgba(124,58,237,0.45)] relative overflow-hidden disabled:opacity-50">
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <Wallet className="w-4 h-4 relative" />
              <span className="relative">{connecting ? "Connecting..." : "Connect Wallet"}</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
