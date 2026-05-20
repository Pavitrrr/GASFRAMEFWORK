import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { BackgroundEffects } from './components/BackgroundEffects';
import { FloatingOrbs } from './components/FloatingOrbs';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { StampBot } from './components/StampBot';
import { HomePage } from './pages/HomePage';
import { ClaimBadgesPage } from './pages/ClaimBadgesPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { TransactionHistoryPage } from './pages/TransactionHistoryPage';

export default function App() {
  useEffect(() => {
    // Initialize dark mode by default
    const savedTheme = localStorage.getItem('skillstamp-theme');
    if (!savedTheme) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen relative">
        <BackgroundEffects />
        <FloatingOrbs />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/claim" element={<ClaimBadgesPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/history" element={<TransactionHistoryPage />} />
          </Routes>
        </main>
        <Footer />
        <StampBot />
      </div>
    </BrowserRouter>
  );
}