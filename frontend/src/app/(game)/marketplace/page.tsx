'use client';

import { useState } from 'react';
import { Store, Search, Filter, ArrowUpDown, Gem, Tag, Clock, Shield, Sword, Car, User } from 'lucide-react';
import clsx from 'clsx';

type FilterType = 'all' | 'weapons' | 'armor' | 'vehicles' | 'drugs' | 'misc';

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All Items' },
  { key: 'weapons', label: 'Weapons' },
  { key: 'armor', label: 'Armor' },
  { key: 'vehicles', label: 'Vehicles' },
  { key: 'drugs', label: 'Drugs' },
  { key: 'misc', label: 'Misc' },
];

const mockListings = [
  { id: 1, item: 'Golden Desert Eagle', category: 'weapons', seller: 'WarLord42', price: 500, priceToken: true, rarity: 'Legendary', stat: '+85 Attack', listed: '2h ago' },
  { id: 2, item: 'Titanium Body Armor', category: 'armor', seller: 'IronWall', price: 350, priceToken: true, rarity: 'Epic', stat: '+60 Defense', listed: '4h ago' },
  { id: 3, item: 'Modified Lamborghini', category: 'vehicles', seller: 'SpeedDemon', price: 1200, priceToken: true, rarity: 'Legendary', stat: '+90 Escape', listed: '1h ago' },
  { id: 4, item: 'Kevlar Vest', category: 'armor', seller: 'TankMode', price: 80, priceToken: true, rarity: 'Rare', stat: '+30 Defense', listed: '6h ago' },
  { id: 5, item: 'Assault Rifle', category: 'weapons', seller: 'ArmDealer', price: 220, priceToken: true, rarity: 'Rare', stat: '+50 Attack', listed: '30m ago' },
  { id: 6, item: 'Muscle Car', category: 'vehicles', seller: 'GearHead', price: 180, priceToken: true, rarity: 'Rare', stat: '+45 Escape', listed: '5h ago' },
];

const rarityColors: Record<string, string> = {
  Common: 'text-gray-400',
  Uncommon: 'text-crims-neon',
  Rare: 'text-crims-secondary',
  Epic: 'text-purple-400',
  Legendary: 'text-crims-accent',
};

const categoryIcons: Record<string, typeof Sword> = {
  weapons: Sword,
  armor: Shield,
  vehicles: Car,
};

export default function MarketplacePage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredListings = activeFilter === 'all'
    ? mockListings
    : mockListings.filter((l) => l.category === activeFilter);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Store className="w-7 h-7 text-crims-primary" />
        <h1 className="text-3xl font-bold font-crime tracking-wider">MARKETPLACE</h1>
      </div>

      {/* Description */}
      <div className="crims-card mb-6 bg-crims-primary/5 border-crims-primary/20">
        <p className="text-sm text-crims-text-dim">
          The peer-to-peer marketplace for trading items with $CRIMS tokens. List your unwanted gear,
          browse for upgrades, and negotiate deals with other players. All trades are secured
          through smart contracts -- no scams, no chargebacks, fully trustless.
        </p>
      </div>

      {/* Marketplace Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="crims-card text-center">
          <p className="text-xs text-crims-muted mb-1">Active Listings</p>
          <p className="text-xl font-bold text-crims-primary">247</p>
        </div>
        <div className="crims-card text-center">
          <p className="text-xs text-crims-muted mb-1">24h Volume</p>
          <p className="text-xl font-bold text-crims-neon flex items-center justify-center gap-1">
            <Gem className="w-4 h-4" /> 12,450
          </p>
        </div>
        <div className="crims-card text-center">
          <p className="text-xs text-crims-muted mb-1">Floor Price</p>
          <p className="text-xl font-bold text-crims-secondary flex items-center justify-center gap-1">
            <Gem className="w-4 h-4" /> 15
          </p>
        </div>
        <div className="crims-card text-center">
          <p className="text-xs text-crims-muted mb-1">Marketplace Fee</p>
          <p className="text-xl font-bold text-crims-accent">2.5%</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-crims-muted" />
          <input
            type="text"
            placeholder="Search items..."
            className="crims-input w-full pl-10"
            disabled
          />
        </div>
        <button className="crims-btn-ghost text-xs px-4 flex items-center gap-2 opacity-50 cursor-not-allowed">
          <ArrowUpDown className="w-3.5 h-3.5" /> Sort
        </button>
        <button className="crims-btn-primary text-xs px-4 flex items-center gap-2 opacity-50 cursor-not-allowed">
          <Tag className="w-3.5 h-3.5" /> List Item
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border',
              activeFilter === filter.key
                ? 'bg-crims-primary/20 border-crims-primary text-crims-primary'
                : 'border-crims-border text-crims-muted hover:border-crims-primary/30'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Listings */}
      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-6 gap-4 px-4 py-2 text-xs text-crims-muted font-semibold uppercase tracking-wider">
          <span className="col-span-2">Item</span>
          <span>Stat</span>
          <span>Seller</span>
          <span>Price</span>
          <span className="text-right">Listed</span>
        </div>

        {/* Rows */}
        {filteredListings.map((listing) => {
          const Icon = categoryIcons[listing.category] || Store;
          return (
            <div key={listing.id} className="crims-card grid grid-cols-6 gap-4 items-center hover:border-crims-primary/30 transition-all">
              <div className="col-span-2 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-crims-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-crims-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{listing.item}</p>
                  <p className={clsx('text-xs', rarityColors[listing.rarity])}>{listing.rarity}</p>
                </div>
              </div>
              <div>
                <span className="text-xs text-crims-neon">{listing.stat}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-crims-muted">
                <User className="w-3 h-3" /> {listing.seller}
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-crims-secondary">
                <Gem className="w-3.5 h-3.5" /> {listing.price}
              </div>
              <div className="flex items-center justify-end gap-2">
                <span className="text-xs text-crims-muted flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {listing.listed}
                </span>
                <button className="crims-btn-primary text-xs py-1 px-3 opacity-50 cursor-not-allowed">
                  BUY
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
