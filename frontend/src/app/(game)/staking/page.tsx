'use client';

import { TrendingUp, Gem, Zap, Crosshair, Lock, Star, ArrowUpCircle } from 'lucide-react';
import clsx from 'clsx';

const tiers = [
  { name: 'BRONZE', min: 100, color: 'text-amber-600', bonuses: ['+5% Stamina Recovery'] },
  { name: 'SILVER', min: 500, color: 'text-gray-300', bonuses: ['+10% Stamina', '+5% Robbery Success'] },
  { name: 'GOLD', min: 2000, color: 'text-yellow-400', bonuses: ['+20% Stamina', '+10% Robbery', '-10% Prison Time'] },
  { name: 'DIAMOND', min: 10000, color: 'text-cyan-300', bonuses: ['+30% Stamina', '+15% Robbery', '-20% Prison', '+10% Respect'] },
];

export default function StakingPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-7 h-7 text-crims-secondary" />
        <h1 className="text-3xl font-bold font-crime tracking-wider">STAKING</h1>
      </div>

      {/* Info */}
      <div className="crims-card mb-6 bg-crims-secondary/5 border-crims-secondary/20">
        <div className="flex items-center gap-3 mb-3">
          <Gem className="w-6 h-6 text-crims-secondary" />
          <h2 className="font-crime font-semibold text-lg">Stake $CRIMS for In-Game Bonuses</h2>
        </div>
        <p className="text-sm text-crims-text-dim">
          Lock your $CRIMS tokens in the staking vault to unlock powerful bonuses.
          Higher tiers give bigger advantages in robberies, stamina recovery, and more.
        </p>
      </div>

      {/* Current Status */}
      <div className="crims-card mb-6">
        <h3 className="font-crime font-semibold mb-4 uppercase tracking-wider text-sm text-crims-muted">Your Staking</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-crims-muted mb-1">Staked</p>
            <p className="text-2xl font-bold text-crims-secondary">0</p>
            <p className="text-xs text-crims-muted">$CRIMS</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-crims-muted mb-1">Current Tier</p>
            <p className="text-2xl font-bold text-crims-muted">NONE</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-crims-muted mb-1">Rewards</p>
            <p className="text-2xl font-bold text-crims-neon">0</p>
            <p className="text-xs text-crims-muted">$CRIMS</p>
          </div>
        </div>
      </div>

      {/* Stake Input (placeholder - needs Web3 integration) */}
      <div className="crims-card mb-6">
        <h3 className="font-crime font-semibold mb-4 uppercase tracking-wider text-sm text-crims-muted">Stake Tokens</h3>
        <div className="flex gap-3">
          <input type="number" placeholder="Amount to stake" className="crims-input flex-1" />
          <button className="crims-btn-secondary px-6 flex items-center gap-2">
            <ArrowUpCircle className="w-4 h-4" /> Stake
          </button>
        </div>
        <p className="text-xs text-crims-muted mt-2">Requires wallet signature for on-chain transaction</p>
      </div>

      {/* Tiers */}
      <h3 className="font-crime font-semibold mb-3 uppercase tracking-wider text-sm text-crims-muted">Staking Tiers</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map((tier) => (
          <div key={tier.name} className="crims-card hover:border-crims-secondary/30 transition-all">
            <div className="text-center mb-3">
              <Gem className={clsx('w-8 h-8 mx-auto mb-2', tier.color)} />
              <h4 className={clsx('font-bold font-crime text-lg', tier.color)}>{tier.name}</h4>
              <p className="text-xs text-crims-muted">{tier.min.toLocaleString()}+ $CRIMS</p>
            </div>
            <div className="space-y-2">
              {tier.bonuses.map((bonus, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-1 h-1 rounded-full bg-crims-neon" />
                  <span className="text-crims-text-dim">{bonus}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
