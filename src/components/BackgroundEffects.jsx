export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Dark theme */}
      <div className="dark:block hidden">
        <div className="absolute -top-1/2 -left-1/2 w-[1000px] h-[1000px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)" }} />
        <div className="absolute -bottom-1/2 -right-1/2 w-[1000px] h-[1000px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #06B6D4 0%, transparent 70%)" }} />
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
      {/* Light theme */}
      <div className="dark:hidden block">
        <div className="absolute -top-1/3 -left-1/4 w-[800px] h-[800px] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #C4B5FD 0%, transparent 70%)" }} />
        <div className="absolute -bottom-1/3 -right-1/4 w-[800px] h-[800px] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #A5F3FC 0%, transparent 70%)" }} />
      </div>
    </div>
  );
}
