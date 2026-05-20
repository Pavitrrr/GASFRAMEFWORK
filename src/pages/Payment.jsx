import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { Fuel, Send, CheckCircle } from "lucide-react";
import GlassCard from "../components/GlassCard";
import SuccessOverlay from "../components/SuccessOverlay";
import ErrorOverlay from "../components/ErrorOverlay";
import { useWallet } from "../context/WalletContext";
import { useUGF } from "../hooks/useUGF";

const PRESET_AMOUNTS = ["1", "5", "10", "25", "50", "100"];

const ugfSteps = [
  { id: 1, label: "Auth" },
  { id: 2, label: "Quote" },
  { id: 3, label: "Settle" },
  { id: 4, label: "Execute" },
  { id: 5, label: "Done" },
];

export default function Payment() {
  const [searchParams] = useSearchParams();
  const { address, signer, connect } = useWallet();
  const { gaslessMint, status, isLoading } = useUGF();

  // Pre-fill from URL params passed by Quick Pay modal
  const [recipient, setRecipient] = useState(searchParams.get("to") || "");
  const [amount, setAmount] = useState(searchParams.get("amount") || "");
  const [note, setNote] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [errors, setErrors] = useState({});

  const activeStep =
    status === "authenticating" ? 1 :
    status === "quoting" ? 2 :
    status === "settling" ? 3 :
    status === "executing" ? 4 :
    status === "done" ? 5 : 0;

  function validate() {
    const e = {};
    if (!recipient.trim()) e.recipient = "Recipient address is required";
    else if (!/^0x[a-fA-F0-9]{40}$/.test(recipient.trim())) e.recipient = "Invalid Ethereum address";
    if (!amount || parseFloat(amount) <= 0) e.amount = "Enter a valid amount";
    return e;
  }

  async function handleSend() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (!address) { connect(); return; }
    setErrors({});

    try {
      // Demo: use gaslessMint flow to show UGF lifecycle
      const issuerPrivKey = import.meta.env.VITE_ISSUER_PRIVATE_KEY;
      if (issuerPrivKey) {
        const { ethers } = await import("ethers");
        const issuerWallet = new ethers.Wallet(issuerPrivKey);
        const messageHash = ethers.solidityPackedKeccak256(
          ["address", "uint256", "uint8"],
          [address, BigInt(1), 100]
        );
        const sig = await issuerWallet.signMessage(ethers.getBytes(messageHash));
        const hash = await gaslessMint(signer, 1, 100, sig);
        setTxHash(hash);
      }
      setShowSuccess(true);
    } catch {
      setShowError(true);
    }
  }

  return (
    <div className="min-h-screen">
      <SuccessOverlay
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Payment Sent! 💸"
        subMessage={`${amount} TYI sent to ${recipient.slice(0,6)}...${recipient.slice(-4)} gaslessly via UGF`}
      />
      <ErrorOverlay
        show={showError}
        onClose={() => setShowError(false)}
        message="Payment failed. Please try again."
      />

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            style={{ fontFamily: "var(--font-heading)", fontWeight: 800 }}>
            Send Payment
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-success/20 border border-success/40">
            <Fuel className="w-4 h-4 text-success" />
            <span className="text-success font-semibold text-sm">Gasless via UGF — pay in Mock USD, no ETH needed</span>
          </div>
        </div>

        <GlassCard className="p-8" hover={false}>
          {/* Recipient */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Recipient Address
            </label>
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-foreground placeholder:text-muted-foreground outline-none transition-all text-sm font-mono ${
                errors.recipient ? "border-destructive/60 focus:border-destructive" : "border-white/[0.08] focus:border-primary/40"
              }`}
              style={{ fontFamily: "var(--font-mono)" }}
            />
            {errors.recipient && (
              <p className="text-destructive text-xs mt-1">{errors.recipient}</p>
            )}
          </div>

          {/* Amount */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Amount (TYI Mock USD)
            </label>
            <div className="relative">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                type="number"
                min="0"
                className={`w-full px-4 py-3 pr-16 rounded-xl bg-white/[0.04] border text-foreground placeholder:text-muted-foreground outline-none transition-all text-lg font-bold ${
                  errors.amount ? "border-destructive/60" : "border-white/[0.08] focus:border-primary/40"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">TYI</span>
            </div>
            {errors.amount && <p className="text-destructive text-xs mt-1">{errors.amount}</p>}

            {/* Preset amounts */}
            <div className="flex flex-wrap gap-2 mt-3">
              {PRESET_AMOUNTS.map((a) => (
                <button key={a} onClick={() => setAmount(a)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    amount === a
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
                      : "bg-white/[0.04] border border-white/[0.08] text-muted-foreground hover:text-foreground hover:border-primary/30"
                  }`}>
                  {a} TYI
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Note (optional)
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's this payment for?"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-primary/40 text-foreground placeholder:text-muted-foreground outline-none transition-all text-sm"
            />
          </div>

          {/* Summary */}
          {recipient && amount && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
              <h4 className="text-sm font-semibold mb-3 text-foreground">Transaction Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">To</span>
                  <span className="font-mono text-foreground text-xs">{recipient.slice(0,10)}...{recipient.slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-bold text-foreground">{amount} TYI</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gas fee</span>
                  <span className="text-success font-semibold">FREE (via UGF)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ETH required</span>
                  <span className="text-success font-semibold">0 ETH</span>
                </div>
                {note && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Note</span>
                    <span className="text-foreground">{note}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Send button */}
          {!address ? (
            <button onClick={connect}
              className="w-full group px-6 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all shadow-[0_4px_20px_rgba(124,58,237,0.35)] relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="relative">Connect Wallet to Send</span>
            </button>
          ) : (
            <button onClick={handleSend} disabled={isLoading}
              className="w-full group px-6 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all shadow-[0_4px_20px_rgba(124,58,237,0.35)] relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed">
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <Send className="w-5 h-5 relative" />
              <span className="relative">{isLoading ? "Sending..." : "Send Gaslessly"}</span>
            </button>
          )}

          {/* UGF Status Bar */}
          {isLoading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
              <h4 className="text-sm font-semibold mb-4 text-muted-foreground">UGF Transaction Status</h4>
              <div className="relative">
                <div className="absolute top-6 left-0 right-0 h-0.5 bg-white/10" />
                <div className="relative flex justify-between">
                  {ugfSteps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center">
                      <motion.div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 mb-2 z-10 ${
                          step.id < activeStep ? "bg-success border-success" :
                          step.id === activeStep ? "bg-primary border-primary" :
                          "bg-white/5 border-white/20"
                        }`}
                        animate={step.id === activeStep ? {
                          scale: [1, 1.1, 1],
                          boxShadow: ["0 0 0 0 rgba(124,58,237,0.7)", "0 0 0 10px rgba(124,58,237,0)", "0 0 0 0 rgba(124,58,237,0)"],
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}>
                        {step.id < activeStep
                          ? <CheckCircle className="w-6 h-6 text-white" />
                          : <span className="text-xs font-bold text-white">{step.id}</span>
                        }
                      </motion.div>
                      <span className="text-xs text-muted-foreground">{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Success tx hash */}
          {txHash && !isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mt-4 p-3 rounded-lg bg-success/10 border border-success/20 text-center">
              <p className="text-success text-sm font-semibold mb-1">✓ Payment confirmed on-chain!</p>
              <a href={`https://sepolia.basescan.org/tx/${txHash}`} target="_blank" rel="noreferrer"
                className="text-xs text-muted-foreground hover:text-secondary font-mono underline">
                View on BaseScan ↗
              </a>
            </motion.div>
          )}
        </GlassCard>

        {/* Info cards */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            ["⚡", "Instant", "Transactions settle in ~30 seconds"],
            ["🔒", "Secure", "ERC-3009 signature authorization"],
            ["💸", "Free Gas", "UGF sponsors all ETH fees"],
          ].map(([icon, title, desc], i) => (
            <GlassCard key={i} className="p-4 text-center">
              <div className="text-2xl mb-2">{icon}</div>
              <div className="text-sm font-bold text-foreground mb-1" style={{ fontFamily: "var(--font-heading)" }}>{title}</div>
              <div className="text-xs text-muted-foreground">{desc}</div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
