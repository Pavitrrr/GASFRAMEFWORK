import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AppTheme = 'purple-dark' | 'purple-light' | 'midnight-dark' | 'midnight-light' | 'aurora-dark' | 'aurora-light' | 'cyber-dark' | 'cyber-light' | 'rose-dark' | 'rose-light';
export type AppWallpaper = 'none' | 'matrix' | 'particles' | 'nebula' | 'grid' | 'waves' | 'fireflies' | 'starfield' | 'lava';

export interface UserSettings {
  theme: AppTheme;
  wallpaper: AppWallpaper;
  accentColor: string;
  compactMode: boolean;
  animationsEnabled: boolean;
}

export interface UserProfile {
  username: string;
  avatar: string;
  walletAddress: string;
  isConnected: boolean;
  hasOnboarded: boolean;
  settings: UserSettings;
}

interface UserContextType {
  user: UserProfile;
  setUsername: (name: string) => void;
  setAvatar: (avatar: string) => void;
  connectWallet: (address: string) => void;
  connectMetaMask: () => Promise<void>;
  disconnectWallet: () => void;
  completeOnboarding: () => void;
  updateProfile: (updates: Partial<Pick<UserProfile, 'username' | 'avatar'>>) => void;
  updateSettings: (updates: Partial<UserSettings>) => void;
}

const STORAGE_KEY = 'skillstamp-user';

const defaultSettings: UserSettings = {
  theme: 'purple-dark',
  wallpaper: 'none',
  accentColor: '#7C3AED',
  compactMode: false,
  animationsEnabled: true,
};

const defaultUser: UserProfile = {
  username: '',
  avatar: '🦊',
  walletAddress: '',
  isConnected: false,
  hasOnboarded: false,
  settings: defaultSettings,
};

export const AVATAR_OPTIONS = ['🦊', '🐉', '🦁', '🐺', '🦅', '🐬', '🦋', '🐙', '🦄', '🐸', '🤖', '👾'];

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migrate old theme format ('dark'/'light'/'midnight' etc) to new format
        const themeMap: Record<string, AppTheme> = {
          'dark': 'purple-dark', 'light': 'purple-light',
          'midnight': 'midnight-dark', 'aurora': 'aurora-dark', 'cyber': 'cyber-dark',
        };
        const rawTheme = parsed.settings?.theme ?? 'purple-dark';
        const migratedTheme: AppTheme = (rawTheme in themeMap ? themeMap[rawTheme] : rawTheme) as AppTheme;
        return {
          ...defaultUser, ...parsed,
          settings: { ...defaultSettings, ...(parsed.settings || {}), theme: migratedTheme },
        };
      }
      return defaultUser;
    } catch {
      return defaultUser;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  // Apply theme + accent color to document
  useEffect(() => {
    const root = document.documentElement;
    // Remove all theme classes
    root.classList.remove(
      'dark', 'theme-light',
      'theme-midnight-dark', 'theme-midnight-light',
      'theme-aurora-dark', 'theme-aurora-light',
      'theme-cyber-dark', 'theme-cyber-light',
      'theme-rose-dark', 'theme-rose-light',
    );

    const t = user.settings.theme;
    if (t === 'purple-dark')      root.classList.add('dark');
    else if (t === 'purple-light') root.classList.add('theme-light');
    else if (t === 'midnight-dark')  root.classList.add('dark', 'theme-midnight-dark');
    else if (t === 'midnight-light') root.classList.add('theme-midnight-light');
    else if (t === 'aurora-dark')    root.classList.add('dark', 'theme-aurora-dark');
    else if (t === 'aurora-light')   root.classList.add('theme-aurora-light');
    else if (t === 'cyber-dark')     root.classList.add('dark', 'theme-cyber-dark');
    else if (t === 'cyber-light')    root.classList.add('theme-cyber-light');
    else if (t === 'rose-dark')      root.classList.add('dark', 'theme-rose-dark');
    else if (t === 'rose-light')     root.classList.add('theme-rose-light');

    // Apply accent/highlight color
    const accent = user.settings.accentColor;
    root.style.setProperty('--primary', accent);
    root.style.setProperty('--ring', accent);
    root.style.setProperty('--accent-user', accent);
    root.style.setProperty('--border', `${accent}30`);
    root.style.setProperty('--input', `${accent}18`);

    // Directly set body background/color so light themes work immediately
    // (Tailwind compiles bg-background at build time; CSS vars need direct application)
    const themeColors: Record<string, [string, string]> = {
      'purple-dark':    ['#080B14', '#F8FAFC'],
      'purple-light':   ['#FAFBFF', '#0F172A'],
      'midnight-dark':  ['#00061A', '#CBD5E1'],
      'midnight-light': ['#EFF6FF', '#1E3A5F'],
      'aurora-dark':    ['#010D08', '#D1FAE5'],
      'aurora-light':   ['#ECFDF5', '#064E3B'],
      'cyber-dark':     ['#080400', '#FEF3C7'],
      'cyber-light':    ['#FFFBEB', '#451A03'],
      'rose-dark':      ['#0D0508', '#FCE7F3'],
      'rose-light':     ['#FFF1F5', '#881337'],
    };
    const [bg, fg] = themeColors[t] ?? ['#080B14', '#F8FAFC'];
    document.body.style.backgroundColor = bg;
    document.body.style.color = fg;
    root.style.setProperty('--background', bg);
    root.style.setProperty('--foreground', fg);
  }, [user.settings.theme, user.settings.accentColor]);

  const setUsername = (name: string) => setUser((p) => ({ ...p, username: name }));
  const setAvatar = (avatar: string) => setUser((p) => ({ ...p, avatar }));
  const connectWallet = (address: string) => setUser((p) => ({ ...p, walletAddress: address, isConnected: true }));
  const disconnectWallet = () => setUser((p) => ({ ...p, walletAddress: '', isConnected: false }));
  const completeOnboarding = () => setUser((p) => ({ ...p, hasOnboarded: true }));

  const connectMetaMask = async () => {
    const eth = (window as unknown as { ethereum?: { request: (args: { method: string }) => Promise<string[]> } }).ethereum;
    if (!eth) {
      alert('MetaMask not found. Please install the MetaMask browser extension.');
      return;
    }
    try {
      const accounts = await eth.request({ method: 'eth_requestAccounts' });
      if (accounts[0]) connectWallet(accounts[0]);
    } catch (err: unknown) {
      const e = err as { code?: number };
      if (e.code !== 4001) console.error('MetaMask error', err);
    }
  };
  const updateProfile = (updates: Partial<Pick<UserProfile, 'username' | 'avatar'>>) =>
    setUser((p) => ({ ...p, ...updates }));
  const updateSettings = (updates: Partial<UserSettings>) =>
    setUser((p) => ({ ...p, settings: { ...p.settings, ...updates } }));

  return (
    <UserContext.Provider
      value={{ user, setUsername, setAvatar, connectWallet, connectMetaMask, disconnectWallet, completeOnboarding, updateProfile, updateSettings }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
