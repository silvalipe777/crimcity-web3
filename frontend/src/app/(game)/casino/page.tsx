'use client';

import { Dice5, Coins, RotateCcw, Cherry, DollarSign, Shield, TrendingUp } from 'lucide-react';

const gameOptions = [
  {
    name: 'Coin Flip',
    icon: Coins,
    description: 'Classic 50/50 bet. Pick heads or tails and double your money.',
    multiplier: '2x',
    minBet: 10,
    maxBet: 10000,
    edge: '1%',
  },
  {
    name: 'Dice Roll',
    icon: Dice5,
    description: 'Roll the dice and predict the outcome. Adjustable risk for variable payouts.',
    multiplier: '1.1x - 9.9x',
    minBet: 10,
    maxBet: 50000,
    edge: '2%',
  },
  {
    name: 'Slots',
    icon: Cherry,
    description: 'Spin the reels for a chance at massive jackpots. Match symbols to win big.',
    multiplier: 'Up to 100x',
    minBet: 25,
    maxBet: 5000,
    edge: '3%',
  },
];

const recentWins = [
  { player: 'LuckyDev', game: 'Slots', amount: 25000, multiplier: '50x' },
  { player: 'RiskTaker', game: 'Dice Roll', amount: 8400, multiplier: '4.2x' },
  { player: 'FlipMaster', game: 'Coin Flip', amount: 2000, multiplier: '2x' },
  { player: 'WhaleWatch', game: 'Slots', amount: 120000, multiplier: '100x' },
];

export default function CasinoPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Dice5 className="w-7 h-7 text-crims-primary" />
        <h1 className="text-3xl font-bold font-crime tracking-wider">CASINO</h1>
      </div>

      {/* Description */}
      <div className="crims-card mb-6 bg-crims-primary/5 border-crims-primary/20">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-crims-secondary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-crims-text-dim">
              Provably fair gambling powered by blockchain verification. Every roll, flip, and spin
              can be independently verified on-chain. Bet with in-game cash or $CRIMS tokens.
              The house edge is transparent and among the lowest in crypto gaming.
            </p>
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="crims-card mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-crims-muted mb-1">Cash Balance</p>
            <p className="text-2xl font-bold text-crims-neon">$--</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-crims-muted mb-1">$CRIMS Balance</p>
            <p className="text-2xl font-bold text-crims-secondary">--</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-crims-muted mb-1">Session P/L</p>
            <p className="text-2xl font-bold text-crims-muted">$0</p>
          </div>
        </div>
      </div>

      {/* Game Options */}
      <h2 className="text-lg font-crime font-semibold text-crims-text-dim mb-3 uppercase tracking-wider">Choose Your Game</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {gameOptions.map((game) => {
          const Icon = game.icon;
          return (
            <div key={game.name} className="crims-card hover:border-crims-primary/50 transition-all group">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto rounded-xl bg-crims-primary/10 flex items-center justify-center mb-3 group-hover:bg-crims-primary/20 transition-all">
                  <Icon className="w-8 h-8 text-crims-primary" />
                </div>
                <h3 className="font-bold font-crime text-lg">{game.name}</h3>
                <p className="text-xs text-crims-muted mt-1">{game.description}</p>
              </div>

              <div className="space-y-2 text-xs mb-4">
                <div className="flex justify-between">
                  <span className="text-crims-muted">Multiplier</span>
                  <span className="text-crims-neon font-mono">{game.multiplier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-crims-muted">Min Bet</span>
                  <span className="font-mono">${game.minBet}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-crims-muted">Max Bet</span>
                  <span className="font-mono">${game.maxBet.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-crims-muted">House Edge</span>
                  <span className="text-crims-accent">{game.edge}</span>
                </div>
              </div>

              <button className="crims-btn-primary w-full text-sm py-2.5 opacity-50 cursor-not-allowed">
                COMING SOON
              </button>
            </div>
          );
        })}
      </div>

      {/* Recent Big Wins */}
      <h2 className="text-lg font-crime font-semibold text-crims-text-dim mb-3 uppercase tracking-wider flex items-center gap-2">
        <TrendingUp className="w-5 h-5" /> Recent Big Wins
      </h2>
      <div className="crims-card">
        <div className="space-y-3">
          {recentWins.map((win, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-crims-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-crims-neon/10 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-crims-neon" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{win.player}</p>
                  <p className="text-xs text-crims-muted">{win.game}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-crims-neon">${win.amount.toLocaleString()}</p>
                <p className="text-xs text-crims-accent">{win.multiplier}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
