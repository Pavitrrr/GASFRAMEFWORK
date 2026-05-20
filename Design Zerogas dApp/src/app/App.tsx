import { BrowserRouter, Routes, Route } from 'react-router';
import { BackgroundEffects } from './components/BackgroundEffects';
import { FloatingOrbs } from './components/FloatingOrbs';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { StampBot } from './components/StampBot';
import { OnboardingModal } from './components/OnboardingModal';
import { LiveWallpaper } from './components/LiveWallpaper';
import { HomePage } from './pages/HomePage';
import { ClaimBadgesPage } from './pages/ClaimBadgesPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { TransactionHistoryPage } from './pages/TransactionHistoryPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SecurityPage } from './pages/SecurityPage';
import { PaymentPage } from './pages/PaymentPage';
import { UserProvider } from './context/UserContext';

function AppInner() {
  // Theme is handled entirely by UserContext — no override needed here

  return (
    <div className="min-h-screen relative">
      <LiveWallpaper />
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
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Routes>
      </main>
      <Footer />
      <StampBot />
      {/* Onboarding modal — shows automatically on first visit */}
      <OnboardingModal />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppInner />
      </UserProvider>
    </BrowserRouter>
  );
}
