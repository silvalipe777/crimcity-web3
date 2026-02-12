'use client';

import { useState } from 'react';
import { ShoppingCart, Sword, Shield, Car, Zap, Star, Lock, DollarSign } from 'lucide-react';
import clsx from 'clsx';

type Category = 'weapons' | 'armor' | 'vehicles';

const categories: { key: Category; label: string; icon: typeof Sword }[] = [
  { key: 'weapons', label: 'Weapons', icon: Sword },
  { key: 'armor', label: 'Armor', icon: Shield },
  { key: 'vehicles', label: 'Vehicles', icon: Car },
];

const items: Record<Category, Array<{
  name: string;
  stat: string;
  statValue: number;
  price: number;
  level: number;
  rarity: string;
}>> = {
  weapons: [
    { name: 'Pocket Knife', stat: 'Attack', statValue: 5, price: 500, level: 1, rarity: 'Common' },
    { name: 'Baseball Bat', stat: 'Attack', statValue: 12, price: 1500, level: 3, rarity: 'Common' },
    { name: 'Brass Knuckles', stat: 'Attack', statValue: 18, price: 3000, level: 5, rarity: 'Uncommon' },
    { name: 'Switchblade', stat: 'Attack', statValue: 25, price: 5500, level: 8, rarity: 'Uncommon' },
    { name: '9mm Pistol', stat: 'Attack', statValue: 40, price: 12000, level: 12, rarity: 'Rare' },
    { name: 'Sawed-Off Shotgun', stat: 'Attack', statValue: 65, price: 25000, level: 18, rarity: 'Epic' },
  ],
  armor: [
    { name: 'Leather Jacket', stat: 'Defense', statValue: 5, price: 800, level: 1, rarity: 'Common' },
    { name: 'Chain Mail Vest', stat: 'Defense', statValue: 12, price: 2000, level: 3, rarity: 'Common' },
    { name: 'Kevlar Vest', stat: 'Defense', statValue: 22, price: 5000, level: 6, rarity: 'Uncommon' },
    { name: 'Tactical Armor', stat: 'Defense', statValue: 35, price: 10000, level: 10, rarity: 'Rare' },
    { name: 'Reinforced Body Armor', stat: 'Defense', statValue: 50, price: 20000, level: 15, rarity: 'Rare' },
    { name: 'Military Grade Suit', stat: 'Defense', statValue: 75, price: 45000, level: 20, rarity: 'Epic' },
  ],
  vehicles: [
    { name: 'Bicycle', stat: 'Escape', statValue: 3, price: 200, level: 1, rarity: 'Common' },
    { name: 'Scooter', stat: 'Escape', statValue: 8, price: 2500, level: 3, rarity: 'Common' },
    { name: 'Sedan', stat: 'Escape', statValue: 15, price: 8000, level: 6, rarity: 'Uncommon' },
    { name: 'Sports Car', stat: 'Escape', statValue: 30, price: 25000, level: 10, rarity: 'Rare' },
    { name: 'Muscle Car', stat: 'Escape', statValue: 45, price: 50000, level: 15, rarity: 'Rare' },
    { name: 'Supercar', stat: 'Escape', statValue: 70, price: 150000, level: 22, rarity: 'Epic' },
  ],
};

const rarityColors: Record<string, string> = {
  Common: 'text-gray-400',
  Uncommon: 'text-crims-neon',
  Rare: 'text-crims-secondary',
  Epic: 'text-purple-400',
  Legendary: 'text-crims-accent',
};

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('weapons');

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart className="w-7 h-7 text-crims-primary" />
        <h1 className="text-3xl font-bold font-crime tracking-wider">SHOP</h1>
      </div>

      {/* Description */}
      <div className="crims-card mb-6 bg-crims-primary/5 border-crims-primary/20">
        <p className="text-sm text-crims-text-dim">
          Equip yourself for the streets. Buy weapons to increase your attack power, armor to
          protect against assaults, and vehicles to improve your getaway chances during robberies.
          Better gear unlocks at higher levels. Rare items give significant combat advantages.
        </p>
      </div>

      {/* Balance */}
      <div className="crims-card mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-crims-neon" />
            <span className="text-sm text-crims-muted">Your Cash:</span>
            <span className="text-lg font-bold text-crims-neon">$--</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-crims-accent" />
            <span className="text-sm text-crims-muted">Level:</span>
            <span className="text-lg font-bold text-crims-accent">--</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all border',
                activeCategory === cat.key
                  ? 'bg-crims-primary/20 border-crims-primary text-crims-primary'
                  : 'border-crims-border text-crims-muted hover:border-crims-primary/30 hover:text-crims-text'
              )}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items[activeCategory].map((item) => (
          <div key={item.name} className="crims-card hover:border-crims-primary/50 transition-all">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-sm">{item.name}</h3>
              <span className={clsx('text-xs font-semibold', rarityColors[item.rarity])}>
                {item.rarity}
              </span>
            </div>

            <div className="space-y-1.5 text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-crims-muted flex items-center gap-1">
                  <Zap className="w-3 h-3" /> {item.stat}
                </span>
                <span className="text-crims-neon font-mono">+{item.statValue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-crims-muted flex items-center gap-1">
                  <Star className="w-3 h-3" /> Level Required
                </span>
                <span className="text-crims-accent">{item.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-crims-muted flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> Price
                </span>
                <span className="font-mono">${item.price.toLocaleString()}</span>
              </div>
            </div>

            <button className="crims-btn-primary w-full text-xs py-2 opacity-50 cursor-not-allowed flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> BUY
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
