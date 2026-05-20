import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import GlassCard from "./GlassCard";
import { Send, X } from "lucide-react";

// ── Knowledge base ────────────────────────────────────────────────────────────
const KB = [
  {
    keys: ["hello", "hi", "hey", "start", "help", "what can"],
    answer: "Hey! 👋 I'm StampBot. I can help you with:\n• Claiming badges gaslessly\n• Understanding UGF & gas fees\n• Your profile & certificates\n• Leaderboard & achievements\n• Making payments with Mock USD\n\nWhat do you want to know?",
  },
  {
    keys: ["claim", "badge", "how to get", "earn"],
    answer: "Claiming a badge is simple! 🏅\n\n1. Go to **Claim Badges** page\n2. Pick any badge you want\n3. Click 'Claim Badge'\n4. Sign with your wallet (no ETH needed!)\n5. UGF handles the gas — done!\n\nYour soulbound NFT lands on Base Sepolia in ~30 seconds.",
  },
  {
    keys: ["ugf", "universal gas", "gasless", "no eth", "gas fee", "free"],
    answer: "UGF = Universal Gas Framework ⚡\n\nNormally every blockchain action needs ETH for gas. UGF removes that:\n\n✅ You pay in Mock USD (TYI)\n✅ UGF sponsors the ETH\n✅ Action lands on-chain\n✅ You never touch ETH\n\nFlow: You Sign → UGF Routes → Action On-Chain",
  },
  {
    keys: ["pay", "payment", "donate", "send money", "mock usd", "tyi"],
    answer: "ZeroGas has a gasless payment feature! 💸\n\nYou can send Mock USD (TYI) to any wallet address — completely gasless via UGF.\n\nGo to the **Payment** page from the navbar. Enter an address and amount, sign once, and UGF routes it on-chain. No ETH needed!",
  },
  {
    keys: ["soulbound", "transfer", "sell", "nontransfer", "permanent"],
    answer: "ZeroGas certs are soulbound — permanently tied to your wallet 🔒\n\n❌ Cannot be sold\n❌ Cannot be transferred\n✅ Proves YOU earned it\n✅ Lives on-chain forever\n✅ Anyone can verify it\n\nThis makes ZeroGas certs actually meaningful — they can't be faked.",
  },
  {
    keys: ["profile", "resume", "portfolio", "share", "qr"],
    answer: "Your profile is your Web3 resume! 📄\n\nIt shows all your certificates, scores, and achievements. Share it with anyone via:\n• Copy link button\n• QR code (real scannable code!)\n• Twitter / LinkedIn share\n\nEveryone can verify your certs on BaseScan.",
  },
  {
    keys: ["leaderboard", "rank", "top", "score", "compete"],
    answer: "The leaderboard shows top earners! 🏆\n\n🥇 Gold — highest score\n🥈 Silver — second place  \n🥉 Bronze — third place\n\nScores are stored on-chain — completely transparent. Compete with others and climb the ranks!",
  },
  {
    keys: ["achievement", "bronze", "silver", "gold", "unlock"],
    answer: "Achievements are unlocked based on your activity! 🎖️\n\n🥉 Bronze — First Steps (1 cert)\n🥈 Silver — Knowledge Seeker (3 certs)\n🥇 Gold — Skill Master (5 certs)\n💯 Gold — Perfectionist (100% score)\n⚡ Silver — Web3 Native (gasless tx)\n\nCheck your Achievements tab on your Profile page.",
  },
  {
    keys: ["history", "transaction", "past", "previous"],
    answer: "Your Transaction History shows all on-chain activity 📋\n\nFor each transaction you'll see:\n• What was claimed/minted\n• The skill and score\n• Date and time\n• How much ETH you saved via UGF\n\nGo to the History page in the navbar.",
  },
  {
    keys: ["wallet", "metamask", "connect", "account"],
    answer: "To connect your wallet 🦊\n\n1. Install MetaMask browser extension\n2. Create or import a wallet\n3. Click 'Connect Wallet' in the navbar\n4. Approve the connection\n5. MetaMask auto-switches to Base Sepolia\n\nGet MetaMask at metamask.io",
  },
  {
    keys: ["base", "sepolia", "network", "chain", "testnet"],
    answer: "ZeroGas runs on Base Sepolia 🔵\n\nBase Sepolia is a testnet (for testing — no real money). It's built on Ethereum by Coinbase, fast and cheap.\n\nAll certificates are real on-chain data — just on the test network. Perfect for hackathon demos!",
  },
  {
    keys: ["issuer", "create", "quiz", "teacher", "deploy", "issue"],
    answer: "Want to issue certificates? 🎓\n\nGo to Issue Certs in the navbar:\n1. Click 'Create Quiz'\n2. Add questions and options\n3. Set the passing score\n4. Deploy on-chain — gaslessly!\n\nLearners take your quiz and earn verified certificates from you.",
  },
];

function getAnswer(input) {
  const lower = input.toLowerCase();
  for (const item of KB) {
    if (item.keys.some((k) => lower.includes(k))) return item.answer;
  }
  return "I'm not sure about that one 🤔\n\nTry asking about:\n• Claiming badges\n• UGF gasless transactions\n• Your profile or certificates\n• Payments with Mock USD\n• Leaderboard rankings";
}

const INITIAL_QUICK = [
  "How do I claim a badge?",
  "What is UGF?",
  "How does payment work?",
  "What is soulbound?",
];

export default function StampBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey! I'm ZeroBot 🤖\n\nAsk me anything about ZeroGas — badges, gasless transactions, payments, or your profile!",
      sender: "bot",
      showQuick: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, typing]);

  function send(text) {
    if (!text.trim()) return;
    // Add user message — hide all quick replies
    setMessages((prev) =>
      prev.map((m) => ({ ...m, showQuick: false })).concat({
        id: Date.now(),
        text,
        sender: "user",
      })
    );
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: getAnswer(text), sender: "bot", showQuick: false },
      ]);
    }, 900);
  }

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "58px",
          height: "58px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
          boxShadow: "0 8px 24px rgba(124,58,237,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999,
          border: "none",
          cursor: "pointer",
          overflow: "hidden",
        }}
      >
        {/* Pulse ring */}
        {!open && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary"
            animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        <span className="relative z-10 text-2xl">
          {open ? <X className="w-6 h-6 text-white" /> : "🤖"}
        </span>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{ position: "fixed", bottom: "88px", right: "24px", width: "360px", zIndex: 99998 }}
          >
            <GlassCard className="flex flex-col overflow-hidden" hover={false}
              style={{ height: "520px" }}>
              {/* Header */}
              <div className="p-4 border-b border-white/[0.08] shrink-0"
                style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.2))" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-xl">🤖</div>
                    <div>
                      <p className="font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>StampBot</p>
                      <p className="text-xs text-success">● Online</p>
                    </div>
                  </div>
                  <button onClick={() => setOpen(false)}
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[85%]">
                      <div className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-primary to-secondary text-white rounded-br-sm"
                          : "bg-white/[0.06] border border-white/[0.08] text-foreground rounded-bl-sm"
                      }`}>
                        {msg.text}
                      </div>
                      {/* Quick replies — only on first bot message */}
                      {msg.showQuick && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {INITIAL_QUICK.map((q, i) => (
                            <motion.button key={i}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.08 }}
                              onClick={() => send(q)}
                              className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/[0.05] hover:bg-primary/20 border border-primary/30 hover:border-primary/60 transition-all text-foreground">
                              {q}
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {typing && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-white/[0.06] border border-white/[0.08] px-4 py-3 rounded-2xl rounded-bl-sm">
                      <div className="flex gap-1 items-center">
                        {[0, 1, 2].map((i) => (
                          <motion.div key={i} className="w-2 h-2 rounded-full bg-muted-foreground"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/[0.08] shrink-0">
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
                    placeholder="Ask me anything..."
                    className="flex-1 px-4 py-2.5 rounded-full bg-white/[0.05] border border-white/[0.08] focus:border-primary/40 outline-none text-sm text-foreground placeholder:text-muted-foreground transition-colors"
                  />
                  <button onClick={() => send(input)} disabled={!input.trim()}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_4px_12px_rgba(124,58,237,0.4)] transition-shadow shrink-0">
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
