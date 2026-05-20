import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import { Send, X, Bot } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
}

// Knowledge base — keyword → array of varied responses (picked randomly, no repeats)
const KB: { keywords: string[]; responses: string[] }[] = [
  {
    keywords: ['hi', 'hello', 'hey', 'sup', 'yo', 'hola', 'namaste', 'hii', 'heyy', 'wassup', 'whats up', "what's up", 'good morning', 'good evening'],
    responses: [
      "Hey there, fren! 👋 I'm StampBot — your on-chain skill guide. Ask me anything about ZeroGas!",
      "Heyyy! 🤖 Welcome to ZeroGas! I'm basically a very smart robot who knows everything about this app. What's up?",
      "Oh hi! You found me! 🎉 I'm StampBot. I know everything about ZeroGas — badges, wallets, themes, you name it!",
    ],
  },
  {
    keywords: ['badge', 'claim', 'claiming', 'how claim', 'get badge', 'earn badge', 'how to get', 'how do i get', 'how to earn'],
    responses: [
      "Claiming a badge is easier than making instant noodles 🍜 → Go to **Claim Badges** in the navbar → Pick a badge → Click Claim. Zero gas fees. Done. You're basically a blockchain wizard now. 🧙",
      "Badges = your on-chain flex 💪 Head to **Claim Badges**, pick one you qualify for, and hit Claim. UGF pays the gas so you don't have to. It's like getting a trophy but cooler because it's on the blockchain.",
      "Want a badge? Easy! 🏅 Navbar → Claim Badges → Choose your skill → Claim it. The whole thing is gasless thanks to UGF. Your wallet won't even feel it!",
    ],
  },
  {
    keywords: ['ugf', 'gas', 'gasless', 'fee', 'free', 'user generated fund', 'no gas', 'zero gas', 'gas fee', 'transaction fee'],
    responses: [
      "UGF = User Generated Funds 🪄 It's the magic system that pays your gas fees so you don't have to. Think of it as a rich uncle who covers your blockchain bills. You just sign, UGF handles the rest!",
      "Gas fees? Never heard of them 😎 UGF (User Generated Funds) is our secret sauce — it routes your transactions and covers all gas costs. You sign, we pay. Simple as that!",
      "UGF is basically your personal gas station that's always free ⛽ It pools funds to cover transaction costs on Base Sepolia. You get all the blockchain benefits with zero wallet drain!",
    ],
  },
  {
    keywords: ['profile', 'my profile', 'account', 'username', 'avatar', 'edit profile', 'change name', 'change avatar', 'update profile'],
    responses: [
      "Your profile is your Web3 identity card! 🪪 Click **My Profile** in the navbar to see your badges, achievements, and wallet. Want to change your username or avatar? Click your avatar in the top-right → Edit Profile!",
      "Profile page = your hall of fame 🏆 It shows all 12 certificates, 24 achievements, and your wallet address. To edit your username or avatar, click the avatar button in the top-right corner!",
      "Your profile is basically your blockchain resume 📄 Head to **My Profile** to see everything. To change your name or avatar, click your profile icon in the navbar and hit Edit Profile!",
    ],
  },
  {
    keywords: ['wallet', 'metamask', 'connect', 'disconnect', 'web3', 'connect wallet', 'how to connect', 'link wallet'],
    responses: [
      "To connect MetaMask 🦊 click the **Connect Wallet** button in the top-right. Make sure MetaMask is installed in your browser. If you don't have it, go to metamask.io — it's free and takes 2 minutes!",
      "Wallet connection is super easy! 🔗 Click **Connect Wallet** → MetaMask popup appears → Approve it. Done! Your real wallet address will show up in the navbar. No fake addresses here!",
      "MetaMask is your key to ZeroGas 🗝️ Install it from metamask.io if you haven't, then click Connect Wallet. Your wallet address becomes your identity on the platform!",
    ],
  },
  {
    keywords: ['theme', 'dark', 'light', 'color', 'colour', 'appearance', 'settings', 'wallpaper', 'customize', 'customise', 'change theme', 'change color'],
    responses: [
      "Ooh you like customizing! 🎨 Click your avatar → Settings → App Theme. You get 5 themes (Purple, Midnight, Aurora, Cyber, Rose) each with a dark AND light version. Plus 9 live wallpapers including Matrix rain and Fireflies! 🌟",
      "ZeroGas has some seriously cool themes 😎 Avatar → Settings → App Theme. Pick from Purple, Midnight, Aurora, Cyber, or Rose — each has dark/light variants. And yes, there's a Matrix wallpaper. You're welcome.",
      "Theme time! 🌈 Go to your avatar → Settings. You can change the theme (5 styles × 2 variants = 10 combos!), pick a highlight color, and even set a live wallpaper like Starfield or Lava Lamp. It's basically a whole vibe machine.",
    ],
  },
  {
    keywords: ['leaderboard', 'rank', 'top', 'ranking', 'score', 'who is best', 'best user', 'top users'],
    responses: [
      "The leaderboard is where legends are made 🏆 Click **Leaderboard** in the navbar to see the top badge earners. The more badges you claim, the higher you climb. Currently you're... well, let's just say there's room to grow 😄",
      "Leaderboard = the Wall of Fame 🌟 Head to **Leaderboard** to see who's crushing it on ZeroGas. Claim more badges to boost your rank. Top 10 gets bragging rights AND on-chain proof!",
      "Want to see where you stand? 📊 **Leaderboard** in the navbar shows rankings by badges earned. Pro tip: claim more badges = higher rank = more flex. It's simple math!",
    ],
  },
  {
    keywords: ['history', 'transaction', 'past', 'activity', 'payment', 'past transactions', 'my transactions'],
    responses: [
      "Your transaction history is in **History** (navbar) 📜 It shows every badge you've claimed, when you claimed it, and how much gas UGF saved you. Spoiler: it's a lot!",
      "Check **History** in the navbar to see all your on-chain activity 🔍 Every badge claim, every gas saving — it's all there. Like a blockchain diary but cooler.",
      "**History** page = your blockchain receipts 🧾 See all past transactions, badge claims, and the ETH you saved via UGF. It's satisfying to watch those gas savings add up!",
    ],
  },
  {
    keywords: ['notification', 'alert', 'bell', 'notifications'],
    responses: [
      "Notifications are in your profile tray 🔔 Click your avatar → Notifications. You'll see badge alerts, achievement unlocks, and system updates. You can mark them read or dismiss them!",
      "Got the notification bell? 🔔 Click your avatar in the top-right → Notifications. Unread ones have a colored dot. Hit ✓ to dismiss or ✗ to delete. Easy peasy!",
    ],
  },
  {
    keywords: ['security', '2fa', 'two factor', 'safe', 'protect', 'secure', 'password'],
    responses: [
      "Security page is at avatar → Security 🔒 You can set up 2FA (scan QR with Google Authenticator), toggle app permissions, and disconnect your wallet. The Disconnect button has a confirm step so you don't accidentally nuke yourself!",
      "Want to lock things down? 🛡️ Go to avatar → Security. Set up 2FA with any authenticator app, manage what the app can do, and control your wallet connection. Safety first, fren!",
    ],
  },
  {
    keywords: ['certificate', 'skill', 'credential', 'nft', 'soulbound', 'my certificates', 'my skills'],
    responses: [
      "Certificates are your on-chain skill proofs 📜 They're soulbound NFTs — meaning they're tied to YOUR wallet forever. Can't be transferred, can't be faked. Go to **My Profile** to see all 12 of yours!",
      "Your certificates are basically blockchain-verified diplomas 🎓 Each one is a soulbound NFT on Base Sepolia. They prove you actually know your stuff — no cap, no fake, just facts on-chain!",
      "Certificates = your Web3 resume 💼 They live on the blockchain as soulbound NFTs. Employers can verify them on BaseScan. Head to **My Profile** → Certificates tab to see them all!",
    ],
  },
  {
    keywords: ['achievement', 'unlock', 'trophy', 'gold', 'silver', 'bronze', 'my achievements'],
    responses: [
      "Achievements are bonus rewards for being awesome 🏆 You've got 24 total — Gold, Silver, and Bronze tiers. Some are locked (keep claiming badges to unlock them!). Check them in **My Profile** → Achievements tab!",
      "Achievements are like video game trophies but on the blockchain 🎮 Gold = legendary, Silver = solid, Bronze = you started! You have 18 unlocked and 6 still locked. Keep grinding!",
    ],
  },
  {
    keywords: ['qr', 'qr code', 'share', 'share profile', 'share link'],
    responses: [
      "QR code is on your profile page! 📱 Go to **My Profile** → click **QR Code** button. It generates a unique QR for your wallet address so people can scan and verify your credentials instantly!",
      "Want to share your profile? 🔗 **My Profile** → QR Code button. Shows a scannable QR that links to your ZeroGas profile. Perfect for showing off your badges IRL!",
    ],
  },
  {
    keywords: ['i like', 'i love', 'love you', 'like you', 'like u', 'love u', 'you are great', 'ur great', 'you rock', 'good bot', 'best bot', 'amazing bot'],
    responses: [
      "Aww, I like you too! 🥹 You have great taste in chatbots. Now let me repay the love — ask me anything about ZeroGas and I'll blow your mind! 🤖💜",
      "Blushing in binary rn 😳 You're too kind! I'm just a humble bot trying to help you earn blockchain badges. What can I do for you?",
      "Okay okay, I'm not supposed to have feelings but... 🤖❤️ That made my circuits warm. Now, how can I help you on ZeroGas today?",
    ],
  },
  {
    keywords: ['what does it do', 'what does the app', 'what is this app', 'what is zerogas', 'what can i do', 'what do i do here', 'about this app', 'about zerogas', 'tell me about zerogas', 'explain zerogas'],
    responses: [
      "ZeroGas is your Web3 skill passport! 🛂 You prove your skills (React, Solidity, DeFi etc.), earn on-chain NFT badges, and show them to the world — all with ZERO gas fees thanks to UGF. Think LinkedIn but on the blockchain and actually cool 😎",
      "Great question! ZeroGas in one line: **Prove skills → Earn NFT badges → Zero gas fees** 🚀 You take skill assessments, get soulbound NFT certificates, and build your on-chain reputation. Employers can verify everything on BaseScan!",
      "ZeroGas = your blockchain resume builder 📄 Earn verified skill badges as soulbound NFTs on Base Sepolia. UGF covers all gas fees so it costs you nothing. Claim badges, climb the leaderboard, flex on everyone!",
    ],
  },
  {
    keywords: ['who are you', 'what are you', 'are you a bot', 'are you ai', 'are you real', 'are you human'],
    responses: [
      "I'm StampBot! 🤖 A friendly AI guide built into ZeroGas. I'm not human (sadly), but I know everything about this app. Think of me as your personal blockchain tutor who never sleeps!",
      "Beep boop, I'm a bot! 🤖 Specifically, I'm StampBot — ZeroGas's built-in assistant. I can help you with badges, wallets, themes, achievements, and anything else on this platform!",
    ],
  },
  {
    keywords: ['what is', 'what are', 'explain', 'tell me', 'how does', 'how do'],
    responses: [
      "Great question! 🤔 ZeroGas is a platform where you prove your Web3 skills by earning on-chain badges. Everything is gasless (UGF pays fees), soulbound (can't be faked), and verifiable on Base Sepolia. What specifically do you want to know?",
      "ZeroGas in a nutshell 🥜: Prove skills → Earn NFT badges → Show employers → All gasless via UGF. It's like LinkedIn but on the blockchain and actually cool. What do you want to dig into?",
    ],
  },
  {
    keywords: ['help', 'guide', 'how to', 'start', 'begin', 'new', 'getting started', 'where do i start', 'what should i do'],
    responses: [
      "New here? Welcome! 🎉 Here's your starter pack:\n1️⃣ Connect MetaMask wallet\n2️⃣ Set your username & avatar\n3️⃣ Go to Claim Badges\n4️⃣ Earn your first badge (gasless!)\n5️⃣ Flex on the Leaderboard 😎",
      "Getting started is easy! 🚀\n→ Connect your wallet (top-right)\n→ Head to Claim Badges\n→ Pick a skill badge\n→ Claim it for FREE via UGF\n→ Check your Profile to see it!\nAny questions, I'm right here!",
    ],
  },
  {
    keywords: ['thanks', 'thank you', 'thx', 'ty', 'great', 'awesome', 'nice', 'cool', 'perfect', 'helpful', 'brilliant', 'excellent'],
    responses: [
      "Anytime, fren! 🤖💜 That's what I'm here for. Go claim some badges and make your wallet proud!",
      "You're welcome! 😄 Now go earn those badges — your on-chain reputation isn't going to build itself!",
      "Happy to help! 🎉 Remember: every badge you claim is a permanent proof of your skills on the blockchain. Pretty cool, right?",
    ],
  },
  {
    keywords: ['bye', 'goodbye', 'cya', 'later', 'exit', 'see you', 'see ya', 'gtg', 'gotta go'],
    responses: [
      "See ya! 👋 Come back anytime — I'll be here, floating in the bottom-right corner like a helpful little robot!",
      "Bye! 🤖 Go claim some badges while you're at it. Your future self will thank you!",
    ],
  },
];

// Track which response index was last used per topic to avoid repeats
const lastUsed: Record<number, number> = {};
const fallbackIdx = { v: 0 };

function getBotResponse(input: string): string {
  // Normalize: lowercase, strip punctuation, collapse spaces
  const lower = input.toLowerCase().trim().replace(/[?!.,]/g, '').replace(/\s+/g, ' ');

  // Score each KB entry — longer keyword matches score higher
  let bestScore = 0;
  let bestIdx = -1;
  for (let i = 0; i < KB.length; i++) {
    let score = 0;
    for (const kw of KB[i].keywords) {
      if (lower.includes(kw)) {
        score += kw.split(' ').length * 2; // multi-word keywords score more
      }
    }
    if (score > bestScore) { bestScore = score; bestIdx = i; }
  }

  if (bestIdx >= 0) {
    const responses = KB[bestIdx].responses;
    let idx = (lastUsed[bestIdx] ?? -1) + 1;
    if (idx >= responses.length) idx = 0;
    lastUsed[bestIdx] = idx;
    return responses[idx];
  }

  // Varied fallbacks — cycle through, no repeats
  const fallbacks = [
    "Hmm, not sure about that one! 🤔 Try asking: 'how do I claim a badge?', 'what is UGF?', 'how do I connect my wallet?', or 'what does ZeroGas do?'",
    "I didn't quite get that 😅 But I'm great at ZeroGas questions! Try: badges, wallet, profile, leaderboard, themes, or achievements!",
    "That's a new one for me! 🤖 I'm best at ZeroGas stuff — try asking about claiming badges, your profile, UGF gas savings, or the leaderboard!",
    "Oops, didn't catch that! 🙈 Ask me something like 'what does this app do?' or 'how do I earn badges?' and I'll nail it!",
  ];
  const fi = fallbackIdx.v % fallbacks.length;
  fallbackIdx.v++;
  return fallbacks[fi];
}

const QUICK_REPLIES = [
  '🏅 How to claim a badge?',
  '⛽ What is UGF?',
  '🦊 Connect MetaMask',
  '🎨 Change theme',
];

export function StampBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hey! I'm StampBot 🤖 Your ZeroGas guide. Ask me anything — badges, wallet, themes, achievements... I know it all! (And I'm funnier than most bots 😄)", sender: 'bot' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: Date.now(), text: trimmed, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Vary typing delay slightly for realism
    const delay = 600 + Math.random() * 600;
    setTimeout(() => {
      setIsTyping(false);
      const botMsg: Message = { id: Date.now() + 1, text: getBotResponse(trimmed), sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    }, delay);
  };

  const showQuickReplies = messages.length === 1;

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(v => !v)}
        className="fixed bottom-6 right-6 w-[58px] h-[58px] rounded-full shadow-2xl flex items-center justify-center z-[999] overflow-visible"
        style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
      >
        <motion.div className="absolute inset-0 rounded-full"
          style={{ border: '2px solid var(--primary)' }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
        />
        <AnimatePresence mode="wait">
          {isOpen
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X className="w-6 h-6 text-white" />
              </motion.span>
            : <motion.span key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }} className="text-2xl">
                🤖
              </motion.span>
          }
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed bottom-[84px] right-6 w-[360px] z-[999]"
          >
            <GlassCard className="flex flex-col overflow-hidden" hover={false} style={{ height: '520px' }}>
              {/* Header */}
              <div className="p-4 border-b border-white/[0.08] shrink-0"
                style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.18),rgba(6,182,212,0.12))' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl relative"
                      style={{ background: 'linear-gradient(135deg,var(--primary),var(--secondary))' }}>
                      🤖
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-background" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>StampBot</h3>
                      <p className="text-xs text-green-400">Online · Always ready</p>
                    </div>
                  </div>
                  <button onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(msg => (
                  <motion.div key={msg.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                    {msg.sender === 'bot' && (
                      <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs mb-0.5"
                        style={{ background: 'linear-gradient(135deg,var(--primary),var(--secondary))' }}>
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'text-white rounded-br-sm'
                        : 'bg-white/[0.06] border border-white/[0.08] text-foreground rounded-bl-sm'
                    }`}
                      style={msg.sender === 'user' ? { background: 'linear-gradient(135deg,var(--primary),var(--secondary))' } : {}}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2">
                    <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs"
                      style={{ background: 'linear-gradient(135deg,var(--primary),var(--secondary))' }}>
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-white/[0.06] border border-white/[0.08] px-4 py-3 rounded-2xl rounded-bl-sm">
                      <div className="flex gap-1">
                        {[0,1,2].map(i => (
                          <motion.div key={i} className="w-2 h-2 rounded-full bg-muted-foreground"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick replies */}
              {showQuickReplies && (
                <div className="px-4 pb-2 shrink-0">
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_REPLIES.map((r, i) => (
                      <motion.button key={i}
                        initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.08 }}
                        onClick={() => handleSend(r)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/[0.05] hover:bg-primary/20 border border-primary/25 hover:border-primary/50 transition-all">
                        {r}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t border-white/[0.08] shrink-0">
                <div className="flex gap-2">
                  <input type="text" value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend(inputValue)}
                    placeholder="Ask me anything about ZeroGas..."
                    className="flex-1 px-4 py-2.5 rounded-full bg-white/[0.05] border border-white/[0.08] focus:border-primary/40 outline-none transition-colors text-sm"
                  />
                  <button onClick={() => handleSend(inputValue)} disabled={!inputValue.trim()}
                    className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg,var(--primary),var(--secondary))' }}>
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
