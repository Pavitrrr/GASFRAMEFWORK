import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('skillstamp-theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'dark';

    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('skillstamp-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 transition-all duration-200 group"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-secondary group-hover:rotate-90 transition-transform duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-primary group-hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
}
