import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { WalletProvider } from "./context/WalletContext";
import Navbar from "./components/Navbar";
import StampBot from "./components/StampBot";
import BackgroundEffects from "./components/BackgroundEffects";
import Home from "./pages/Home";
import IssuerDashboard from "./pages/IssuerDashboard";
import CreateQuiz from "./pages/CreateQuiz";
import ClaimBadge from "./pages/ClaimBadge";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import TransactionHistory from "./pages/TransactionHistory";
import Payment from "./pages/Payment";

export default function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("zergas-theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("zergas-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <WalletProvider>
      <div className="min-h-screen bg-background text-foreground">
        <BackgroundEffects />
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/badges" element={<ClaimBadge />} />
          <Route path="/issuer" element={<IssuerDashboard />} />
          <Route path="/issuer/create" element={<CreateQuiz />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/leaderboard/:quizId" element={<Leaderboard />} />
          <Route path="/profile/:address" element={<Profile />} />
          <Route path="/history" element={<TransactionHistory />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
        <StampBot />
      </div>
    </WalletProvider>
  );
}
