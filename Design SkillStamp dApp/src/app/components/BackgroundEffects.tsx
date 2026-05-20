export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Dark theme effects */}
      <div className="dark:block hidden">
        {/* Purple nebula glow top-left */}
        <div
          className="absolute -top-1/2 -left-1/2 w-[1000px] h-[1000px] rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)',
          }}
        />

        {/* Cyan glow bottom-right */}
        <div
          className="absolute -bottom-1/2 -right-1/2 w-[1000px] h-[1000px] rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)',
          }}
        />

        {/* Particle network */}
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <defs>
            <pattern id="particle-grid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="0" cy="0" r="1.5" fill="#7C3AED" opacity="0.4" />
              <circle cx="50" cy="50" r="1.5" fill="#06B6D4" opacity="0.4" />
              <circle cx="100" cy="0" r="1.5" fill="#7C3AED" opacity="0.4" />
              <circle cx="0" cy="100" r="1.5" fill="#06B6D4" opacity="0.4" />
              <line x1="0" y1="0" x2="50" y2="50" stroke="#7C3AED" strokeWidth="0.5" opacity="0.2" />
              <line x1="50" y1="50" x2="100" y2="0" stroke="#06B6D4" strokeWidth="0.5" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#particle-grid)" />
        </svg>
      </div>

      {/* Light theme effects */}
      <div className="dark:hidden block">
        {/* Pastel purple blob */}
        <div
          className="absolute -top-1/3 -left-1/4 w-[800px] h-[800px] rounded-full opacity-30 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #C4B5FD 0%, transparent 70%)',
          }}
        />

        {/* Pastel cyan blob */}
        <div
          className="absolute -bottom-1/3 -right-1/4 w-[800px] h-[800px] rounded-full opacity-30 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #A5F3FC 0%, transparent 70%)',
          }}
        />

        {/* Aurora waves */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <linearGradient id="aurora1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C4B5FD" />
              <stop offset="50%" stopColor="#A5F3FC" />
              <stop offset="100%" stopColor="#C4B5FD" />
            </linearGradient>
          </defs>
          <path
            d="M0,300 Q250,200 500,300 T1000,300 L1000,400 L0,400 Z"
            fill="url(#aurora1)"
            opacity="0.3"
          />
          <path
            d="M0,400 Q250,350 500,400 T1000,400 L1000,500 L0,500 Z"
            fill="url(#aurora1)"
            opacity="0.2"
          />
        </svg>
      </div>
    </div>
  );
}
