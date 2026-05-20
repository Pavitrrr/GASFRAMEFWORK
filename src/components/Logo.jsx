export default function Logo() {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="shrink-0">
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" fill="url(#logoGrad)" fillOpacity="0.15" stroke="url(#logoGrad)" strokeWidth="1.5" />
        <path d="M18 12L8 16L18 20L28 16L18 12Z" fill="url(#logoGrad)" />
        <path d="M10 17.5V21.5C10 21.5 13 24 18 24C23 24 26 21.5 26 21.5V17.5" stroke="url(#logoGrad)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M28 17V22" stroke="url(#logoGrad)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div className="flex flex-col">
        <span className="text-lg sm:text-xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          ZeroGas
        </span>
        <span className="hidden sm:block text-[10px] text-muted-foreground tracking-wide uppercase">
          Prove Skills. On-Chain. Gasless.
        </span>
      </div>
    </div>
  );
}
