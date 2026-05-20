# SkillStamp - Web3 Skill Certification dApp

A premium dark crypto UI for on-chain skill certification, powered by User Generated Funds (UGF) for gasless transactions.

## Features

### Pages

1. **Home Page** (`/`)
   - Hero section with animated gradient text "Gasless"
   - Floating certificate card with holographic shimmer effect
   - UGF explainer with 3-step flow visualization
   - "How It Works" feature cards

2. **Claim Badges Page** (`/claim`)
   - Category filter pills (All, Event, Certificate, Achievement, Special)
   - 3-column badge grid with animated emoji glows
   - Interactive claim panel with UGF status bar
   - 5-step transaction progress (Auth → Quote → Settle → Execute → Done)
   - Success/Error overlays with animations

3. **Leaderboard Page** (`/leaderboard`)
   - Animated podium for top 3 (Gold/Silver/Bronze)
   - Full table with animated score bars
   - Top 3 rows highlighted with purple tint
   - Wallet addresses in monospace font

4. **Profile Page** (`/profile`)
   - Gradient avatar with wallet address
   - QR code panel (expandable)
   - 4 stat cards with gradient numbers
   - Gas savings banner
   - Tabs: Certificates & Achievements
   - Holographic certificate cards
   - Achievement tiers (Bronze/Silver/Gold) with colored borders

5. **Transaction History Page** (`/history`)
   - Vertical list with emoji icons and status dots
   - Skill tags, scores, and dates
   - Gas savings per transaction
   - Staggered fade-in animations

### Components

#### Interactive Elements
- **StampBot Chatbot**: Floating 🤖 button with chat panel, typing indicators, quick replies
- **SuccessOverlay**: Animated checkmark with confetti burst, auto-dismisses in 3s
- **ErrorOverlay**: Animated red X for errors, wifi bars for network issues
- **ThemeToggle**: Sun/Moon icon with animated rotation, localStorage persistence

#### Visual Effects
- **BackgroundEffects**: Particle network (dark), aurora waves (light)
- **FloatingOrbs**: Animated gradient orbs that float and pulse
- **GlassCard**: Glass morphism with backdrop blur, hover effects, top gradient line

#### Layout
- **Navbar**: Frosted glass sticky header with logo, navigation pills, theme toggle, Connect Wallet button
- **Footer**: Social links, site map, legal links
- **Logo**: Hexagonal stamp seal with graduation cap, gradient fill

## Design System

### Colors
**Dark Theme (default)**:
- Background: `#080B14`
- Primary: `#7C3AED` (purple)
- Secondary: `#06B6D4` (cyan)
- Success: `#10B981`
- Text: `#F8FAFC`

**Light Theme**:
- Background: `#F0F4FF`
- Primary: `#6D28D9`
- Secondary: `#0891B2`

### Typography
- Headings: Space Grotesk (800/700)
- Body: Inter (400/600)
- Monospace: JetBrains Mono (wallet addresses, code)

### Animations
- Shimmer sweep on gradient buttons (hover)
- Badge emoji glow rings (pulse)
- Certificate cards float (bob up/down)
- UGF status bar progress indicators (pulse)
- Confetti burst on success (12 particles)

## Tech Stack

- React 18.3.1
- React Router 7.13.0
- Motion (Framer Motion) 12.23.24
- Tailwind CSS 4.1.12
- Lucide React (icons)
- TypeScript

## Key Features

### UGF (User Generated Funds)
- Gasless transactions for badge claims
- Gas savings tracking and display
- 5-step transaction flow visualization

### Blockchain Integration
- Base Sepolia network
- Soulbound NFT certificates
- On-chain verification links

### User Experience
- Dark mode by default with toggle
- Responsive design (mobile-first)
- Glass morphism UI
- Smooth page transitions
- Interactive chatbot assistance
- Real-time transaction status

## Development

The app uses Vite for development. The dev server runs automatically in the Figma Make environment.

## File Structure

```
src/app/
├── App.tsx                 # Main router setup
├── components/
│   ├── BackgroundEffects.tsx
│   ├── ErrorOverlay.tsx
│   ├── FloatingOrbs.tsx
│   ├── Footer.tsx
│   ├── GlassCard.tsx
│   ├── Logo.tsx
│   ├── Navbar.tsx
│   ├── StampBot.tsx
│   ├── SuccessOverlay.tsx
│   └── ThemeToggle.tsx
└── pages/
    ├── ClaimBadgesPage.tsx
    ├── HomePage.tsx
    ├── LeaderboardPage.tsx
    ├── ProfilePage.tsx
    └── TransactionHistoryPage.tsx
```

## Credits

Design inspired by Linear.app, Uniswap, and Vercel aesthetics.
Built with Claude Code for Figma Make.
