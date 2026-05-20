import { Sun, Moon } from 'lucide-react';
import { useUser } from '../context/UserContext';

// ThemeToggle now toggles between the dark and light variant of the current theme
// It uses UserContext so it stays in sync with the settings panel
export function ThemeToggle() {
  const { user, updateSettings } = useUser();

  const theme = user.settings?.theme ?? 'purple-dark';
  const isDark = theme.endsWith('-dark');

  const toggleTheme = () => {
    // Swap between dark and light variant of the same theme family
    let newTheme = theme;
    if (isDark) {
      newTheme = theme.replace('-dark', '-light');
    } else {
      newTheme = theme.replace('-light', '-dark');
    }
    // Also update accent color to match the variant
    const accentMap: Record<string, string> = {
      'purple-dark': '#7C3AED', 'purple-light': '#6D28D9',
      'midnight-dark': '#3B82F6', 'midnight-light': '#2563EB',
      'aurora-dark': '#10B981', 'aurora-light': '#059669',
      'cyber-dark': '#F59E0B', 'cyber-light': '#D97706',
      'rose-dark': '#EC4899', 'rose-light': '#E11D48',
    };
    updateSettings({
      theme: newTheme as import('../context/UserContext').AppTheme,
      accentColor: accentMap[newTheme] ?? user.settings.accentColor,
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 transition-all duration-200 group"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-secondary group-hover:rotate-90 transition-transform duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-primary group-hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
}
