# Zerogas🎓

> Gasless on-chain skill certification. Powered by UGF on Base Sepolia.

## What It Does

- **Issuers** (teachers, orgs) create skill quizzes deployed on-chain — gaslessly
- **Learners** take quizzes and mint soulbound NFT certificates on passing — no ETH needed
- **Leaderboard** shows top scorers per quiz, stored on-chain
- **Profile page** at `/profile/0xYourWallet` — shareable, publicly verifiable resume

Gas is paid in Mock USD (TYI) via UGF. Users never touch ETH.

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Get Mock USD (TYI) from faucet
Visit: https://universalgasframework.com/faucets
Connect your wallet and claim TYI_MOCK_USD on Base Sepolia.

### 3. Get Base Sepolia ETH (for deployment only)
Visit: https://faucets.chain.link/base-sepolia
You need a small amount of ETH just to deploy the contract once.

### 4. Configure environment
Copy `.env.example` to `.env` and fill in:
```
PRIVATE_KEY=your_wallet_private_key
VITE_ISSUER_PRIVATE_KEY=your_wallet_private_key  (same key for hackathon)
```

### 5. Deploy the contract
```bash
npx hardhat run scripts/deploy.cjs --network baseSepolia
```
Copy the deployed address and add to `.env`:
```
VITE_CONTRACT_ADDRESS=0x...
```

### 6. Run the app
```bash
npm run dev
```

---

## How UGF Works Here

Every on-chain action (create quiz, mint certificate) goes through the full UGF lifecycle:

```
1. auth.login()          — prove wallet ownership
2. quote.get()           — price the transaction
3. payment.x402.execute() — sign ERC-3009 (no ETH from user)
4. sponsorAndExecute()   — UGF sponsors gas, action lands on-chain
```

The `UGFStatusBar` component shows this flow live to the user.

---

## Project Structure

```
src/
  context/WalletContext.jsx   — wallet connection + Base Sepolia auto-switch
  contract/abi.js             — contract ABI + address
  hooks/useContract.js        — read/write contract hooks
  hooks/useUGF.js             — full UGF lifecycle hook
  components/
    Navbar.jsx
    UGFStatusBar.jsx          — live UGF step progress
    CertificateCard.jsx
    QuizCard.jsx
  pages/
    Home.jsx
    BrowseQuizzes.jsx
    TakeQuiz.jsx              — quiz + gasless mint
    CreateQuiz.jsx            — issuer quiz creation
    IssuerDashboard.jsx
    Leaderboard.jsx
    Profile.jsx               — shareable resume link
contracts/
  SkillStamp.sol              — soulbound NFT + quiz registry
scripts/
  deploy.cjs
```

---

## Tech Stack

- React + Vite
- ethers.js v6
- @tychilabs/ugf-testnet-js
- Hardhat
- Solidity 0.8.20
- Base Sepolia testnet
