'use client';

import { Wallet as WalletIcon, Gem, ArrowDownCircle, ArrowUpCircle, ExternalLink, Copy } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { usePlayerStore } from '@/stores/playerStore';
import { useState } from 'react';

export default function WalletPage() {
  const { publicKey } = useWallet();
  const { player } = usePlayerStore();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <WalletIcon className="w-7 h-7 text-crims-secondary" />
        <h1 className="text-3xl font-bold font-crime tracking-wider">WALLET</h1>
      </div>

      {/* Wallet Address */}
      <div className="crims-card mb-6">
        <p className="text-xs text-crims-muted mb-2">Connected Wallet</p>
        <div className="flex items-center gap-3">
          <code className="text-sm text-crims-text bg-crims-bg px-3 py-2 rounded-lg flex-1 font-mono">
            {publicKey?.toBase58() || 'Not connected'}
          </code>
          <button onClick={copyAddress} className="crims-btn-ghost text-xs px-3 py-2">
            <Copy className="w-4 h-4" />
          </button>
        </div>
        {copied && <p className="text-xs text-crims-neon mt-1">Copied!</p>}
      </div>

      {/* Balances */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="crims-card bg-crims-secondary/5 border-crims-secondary/20">
          <div className="flex items-center gap-2 mb-3">
            <Gem className="w-6 h-6 text-crims-secondary" />
            <span className="text-sm text-crims-muted">$CRIMS Balance</span>
          </div>
          <p className="text-3xl font-bold text-crims-secondary">
            {((player?.tokenBalance as number) || 0).toFixed(2)}
          </p>
          <p className="text-xs text-crims-muted mt-1">On-chain SPL Token</p>
        </div>
        <div className="crims-card bg-crims-neon/5 border-crims-neon/20">
          <div className="flex items-center gap-2 mb-3">
            <ArrowDownCircle className="w-6 h-6 text-crims-neon" />
            <span className="text-sm text-crims-muted">Pending Rewards</span>
          </div>
          <p className="text-3xl font-bold text-crims-neon">0.00</p>
          <button className="crims-btn-primary text-xs mt-3 w-full py-2">Claim Rewards</button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="crims-card">
        <h3 className="font-crime font-semibold mb-4 uppercase tracking-wider text-sm text-crims-muted">Transaction History</h3>
        <div className="text-center py-8 text-crims-muted">
          <WalletIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No transactions yet</p>
          <p className="text-xs mt-1">Start playing to earn $CRIMS tokens!</p>
        </div>
      </div>
    </div>
  );
}
