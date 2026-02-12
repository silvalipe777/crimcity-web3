'use client';

import { Pill, TrendingUp, TrendingDown, FlaskConical, DollarSign, Clock, Package } from 'lucide-react';

const drugs = [
  { name: 'Cannabis', price: 120, change: +5.2, supply: 'High' },
  { name: 'Cocaine', price: 850, change: -2.1, supply: 'Medium' },
  { name: 'Methamphetamine', price: 1200, change: +12.8, supply: 'Low' },
  { name: 'Ecstasy', price: 340, change: -0.5, supply: 'High' },
  { name: 'LSD', price: 560, change: +3.7, supply: 'Medium' },
  { name: 'Heroin', price: 1500, change: +8.4, supply: 'Scarce' },
];

const recipes = [
  { name: 'Basic Cannabis Grow', inputs: '5x Seeds + 2x Fertilizer', time: '2h', output: '10x Cannabis' },
  { name: 'Cocaine Processing', inputs: '10x Coca Leaves + 1x Chemicals', time: '4h', output: '5x Cocaine' },
  { name: 'Meth Cooking', inputs: '3x Pseudoephedrine + 2x Chemicals', time: '6h', output: '3x Methamphetamine' },
];

export default function DrugsPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Pill className="w-7 h-7 text-crims-primary" />
        <h1 className="text-3xl font-bold font-crime tracking-wider">DRUG DEALING</h1>
      </div>

      {/* Description */}
      <div className="crims-card mb-6 bg-crims-primary/5 border-crims-primary/20">
        <p className="text-sm text-crims-text-dim">
          Buy low, sell high. Build your drug empire by trading substances on the street market,
          or set up your own production lab to manufacture and distribute. Prices fluctuate based
          on supply and demand across all players. Corner the market and dominate the underground economy.
        </p>
      </div>

      {/* Price Ticker */}
      <div className="mb-8">
        <h2 className="text-lg font-crime font-semibold text-crims-text-dim mb-3 uppercase tracking-wider flex items-center gap-2">
          <DollarSign className="w-5 h-5" /> Price Ticker
        </h2>
        <div className="crims-card overflow-hidden">
          <div className="grid grid-cols-4 gap-4 text-xs text-crims-muted font-semibold uppercase tracking-wider pb-3 border-b border-crims-border mb-3">
            <span>Substance</span>
            <span className="text-right">Price</span>
            <span className="text-right">24h Change</span>
            <span className="text-right">Supply</span>
          </div>
          <div className="space-y-3">
            {drugs.map((drug) => (
              <div key={drug.name} className="grid grid-cols-4 gap-4 items-center text-sm">
                <span className="font-semibold">{drug.name}</span>
                <span className="text-right text-crims-neon font-mono">${drug.price}</span>
                <span className={`text-right flex items-center justify-end gap-1 font-mono ${drug.change >= 0 ? 'text-crims-neon' : 'text-crims-danger'}`}>
                  {drug.change >= 0 ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  {drug.change >= 0 ? '+' : ''}{drug.change}%
                </span>
                <span className={`text-right text-xs ${
                  drug.supply === 'Scarce' ? 'text-crims-danger' :
                  drug.supply === 'Low' ? 'text-crims-accent' :
                  drug.supply === 'Medium' ? 'text-crims-secondary' :
                  'text-crims-neon'
                }`}>
                  {drug.supply}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-crims-border flex gap-3">
            <button className="crims-btn-primary flex-1 text-xs py-2">BUY</button>
            <button className="crims-btn-ghost flex-1 text-xs py-2">SELL</button>
          </div>
        </div>
      </div>

      {/* Production Lab */}
      <div>
        <h2 className="text-lg font-crime font-semibold text-crims-text-dim mb-3 uppercase tracking-wider flex items-center gap-2">
          <FlaskConical className="w-5 h-5" /> Production Lab
        </h2>
        <p className="text-sm text-crims-muted mb-4">
          Set up production lines to manufacture drugs from raw materials. Higher-level labs unlock
          more potent recipes and faster production times.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <div key={recipe.name} className="crims-card hover:border-crims-primary/50 transition-all">
              <h3 className="font-semibold text-sm mb-2">{recipe.name}</h3>
              <div className="space-y-2 text-xs mb-4">
                <div className="flex justify-between">
                  <span className="text-crims-muted flex items-center gap-1">
                    <Package className="w-3 h-3" /> Inputs
                  </span>
                  <span className="text-crims-text-dim">{recipe.inputs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-crims-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Time
                  </span>
                  <span className="text-crims-accent">{recipe.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-crims-muted flex items-center gap-1">
                    <Pill className="w-3 h-3" /> Output
                  </span>
                  <span className="text-crims-neon">{recipe.output}</span>
                </div>
              </div>
              <button className="crims-btn-ghost w-full text-xs py-2 opacity-50 cursor-not-allowed">
                LAB REQUIRED
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
