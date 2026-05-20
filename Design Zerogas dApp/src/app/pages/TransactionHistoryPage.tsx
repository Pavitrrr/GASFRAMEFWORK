import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { Fuel, Clock } from 'lucide-react';
import { useUser } from '../context/UserContext';

export function TransactionHistoryPage() {
  const { user } = useUser();
  const isConnected = !!user.walletAddress;

  // Only show transactions if wallet is connected
  // In production these would come from on-chain events for this specific wallet
  const transactions = isConnected ? [] : [];

  const totalGasSaved = transactions.reduce((acc, tx: { gasSaved: string }) => acc + parseFloat(tx.gasSaved), 0);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
            Transaction History
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-success/20 border border-success/40">
            <Fuel className="w-4 h-4 text-success" />
            <span className="text-success font-semibold">
              {isConnected
                ? `Total gas saved: ${totalGasSaved.toFixed(3)} ETH via UGF`
                : 'Connect wallet to track gas savings'}
            </span>
          </div>
        </div>

        <GlassCard className="p-6" hover={false}>
          {!isConnected ? (
            <div className="text-center py-16 text-muted-foreground">
              <div className="text-5xl mb-4">🔗</div>
              <p className="font-semibold text-lg mb-2">No wallet connected</p>
              <p className="text-sm">Connect your MetaMask wallet to see your transaction history</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-semibold text-lg mb-2">No transactions yet</p>
              <p className="text-sm">Your badge claims and payments will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* transactions would render here */}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
