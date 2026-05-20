import { useUser } from '../context/UserContext';

export function Logo() {
  const { user } = useUser();

  // Pick gradient colors based on theme
  const themeGradients: Record<string, [string, string]> = {
    dark:     ['#7C3AED', '#06B6D4'],
    light:    ['#6D28D9', '#0891B2'],
    midnight: ['#3B82F6', '#06B6D4'],
    aurora:   ['#10B981', '#06B6D4'],
    cyber:    ['#F59E0B', '#EF4444'],
  };
  const [c1, c2] = themeGradients[user.settings?.theme ?? 'dark'] ?? ['#7C3AED', '#06B6D4'];
  const gradId = `logoGrad-${user.settings?.theme ?? 'dark'}`;

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <svg
        width="32" height="32" viewBox="0 0 36 36" fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 w-8 h-8 sm:w-9 sm:h-9"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
        </defs>
        {/* Hexagonal stamp seal */}
        <path
          d="M18 2L32 10V26L18 34L4 26V10L18 2Z"
          fill={`url(#${gradId})`} fillOpacity="0.15"
          stroke={`url(#${gradId})`} strokeWidth="1.5"
        />
        {/* Graduation cap */}
        <path d="M18 12L8 16L18 20L28 16L18 12Z" fill={`url(#${gradId})`} />
        <path
          d="M10 17.5V21.5C10 21.5 13 24 18 24C23 24 26 21.5 26 21.5V17.5"
          stroke={`url(#${gradId})`} strokeWidth="1.5" strokeLinecap="round" fill="none"
        />
        <path d="M28 17V22" stroke={`url(#${gradId})`} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div className="flex flex-col">
        <span
          className="text-lg sm:text-xl font-extrabold tracking-tight bg-clip-text text-transparent"
          style={{
            fontFamily: 'var(--font-heading)',
            backgroundImage: `linear-gradient(90deg, ${c1}, ${c2})`,
          }}
        >
          ZeroGas
        </span>
        <span className="hidden sm:block text-[10px] text-muted-foreground tracking-wide uppercase">
          Prove Skills. On-Chain. Gasless.
        </span>
      </div>
    </div>
  );
}
