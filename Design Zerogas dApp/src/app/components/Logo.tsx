export function Logo() {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <svg
        width="32"
        height="32"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 w-8 h-8 sm:w-9 sm:h-9"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        {/* Hexagonal stamp seal */}
        <path
          d="M18 2L32 10V26L18 34L4 26V10L18 2Z"
          fill="url(#logoGradient)"
          fillOpacity="0.15"
          stroke="url(#logoGradient)"
          strokeWidth="1.5"
        />
        {/* Graduation cap */}
        <path
          d="M18 12L8 16L18 20L28 16L18 12Z"
          fill="url(#logoGradient)"
        />
        <path
          d="M10 17.5V21.5C10 21.5 13 24 18 24C23 24 26 21.5 26 21.5V17.5"
          stroke="url(#logoGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M28 17V22"
          stroke="url(#logoGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <div className="flex flex-col">
        <span className="text-lg sm:text-xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          SkillStamp
        </span>
        <span className="hidden sm:block text-[10px] text-muted-foreground tracking-wide uppercase">
          Prove Skills. On-Chain. Gasless.
        </span>
      </div>
    </div>
  );
}
