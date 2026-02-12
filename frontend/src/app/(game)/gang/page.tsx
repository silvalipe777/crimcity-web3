'use client';

import { Users, Plus, Search, Shield, Star, Crown, Skull, TrendingUp, DollarSign } from 'lucide-react';

const topGangs = [
  { name: 'The Syndicate', leader: 'DarkLord99', members: 48, respect: 245000, level: 15, tag: 'SYN' },
  { name: 'Shadow Cartel', leader: 'GhostFace', members: 35, respect: 189000, level: 12, tag: 'SC' },
  { name: 'Street Kings', leader: 'KingPin_X', members: 52, respect: 167000, level: 11, tag: 'SK' },
  { name: 'Night Wolves', leader: 'AlphaWolf', members: 28, respect: 98000, level: 8, tag: 'NW' },
  { name: 'Blood Diamonds', leader: 'DiamondCut', members: 41, respect: 134000, level: 10, tag: 'BD' },
];

const gangPerks = [
  { name: 'Gang Heists', description: 'Unlock exclusive high-reward group robberies', icon: Skull },
  { name: 'Territory Control', description: 'Claim neighborhoods for passive income', icon: Shield },
  { name: 'Gang Wars', description: 'Battle rival gangs for dominance', icon: Users },
  { name: 'Shared Stash', description: 'Pool resources and share the profits', icon: DollarSign },
];

export default function GangPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-7 h-7 text-crims-primary" />
        <h1 className="text-3xl font-bold font-crime tracking-wider">GANG</h1>
      </div>

      {/* Description */}
      <div className="crims-card mb-6 bg-crims-primary/5 border-crims-primary/20">
        <p className="text-sm text-crims-text-dim">
          Create or join a gang to unlock group activities, territory wars, and exclusive heists.
          Rise through the ranks, recruit members, and build the most feared criminal organization
          on the blockchain. Gang leaders earn a cut of all member activities.
        </p>
      </div>

      {/* Your Gang Status */}
      <div className="crims-card mb-6 border-crims-accent/20">
        <div className="text-center py-4">
          <Users className="w-10 h-10 mx-auto text-crims-muted mb-2" />
          <p className="text-crims-muted text-sm mb-4">You are not in a gang</p>
          <div className="flex gap-3 justify-center">
            <button className="crims-btn-primary text-sm py-2.5 px-6 flex items-center gap-2 opacity-50 cursor-not-allowed">
              <Plus className="w-4 h-4" /> Create Gang
            </button>
            <button className="crims-btn-ghost text-sm py-2.5 px-6 flex items-center gap-2 opacity-50 cursor-not-allowed">
              <Search className="w-4 h-4" /> Browse Invites
            </button>
          </div>
        </div>
      </div>

      {/* Create Gang Preview */}
      <div className="mb-8">
        <h2 className="text-lg font-crime font-semibold text-crims-text-dim mb-3 uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-5 h-5" /> Create Gang
        </h2>
        <div className="crims-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-crims-muted mb-1">Gang Name</label>
              <input type="text" placeholder="Enter gang name..." className="crims-input w-full" disabled />
            </div>
            <div>
              <label className="block text-xs text-crims-muted mb-1">Tag (3-4 chars)</label>
              <input type="text" placeholder="e.g. SYN" className="crims-input w-full" maxLength={4} disabled />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-crims-muted mb-1">Description</label>
            <textarea placeholder="Describe your gang..." className="crims-input w-full h-20 resize-none" disabled />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-crims-muted">Creation cost: <span className="text-crims-accent">$50,000</span> + <span className="text-crims-secondary">100 $CRIMS</span></p>
            <button className="crims-btn-primary text-xs py-2 px-4 opacity-50 cursor-not-allowed">CREATE GANG</button>
          </div>
        </div>
      </div>

      {/* Gang Perks */}
      <div className="mb-8">
        <h2 className="text-lg font-crime font-semibold text-crims-text-dim mb-3 uppercase tracking-wider">Gang Perks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {gangPerks.map((perk) => {
            const Icon = perk.icon;
            return (
              <div key={perk.name} className="crims-card text-center">
                <Icon className="w-8 h-8 mx-auto mb-2 text-crims-primary" />
                <h3 className="font-semibold text-sm mb-1">{perk.name}</h3>
                <p className="text-xs text-crims-muted">{perk.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Browse Gangs */}
      <div>
        <h2 className="text-lg font-crime font-semibold text-crims-text-dim mb-3 uppercase tracking-wider flex items-center gap-2">
          <Search className="w-5 h-5" /> Browse Gangs
        </h2>
        <div className="crims-card">
          <div className="flex gap-3 mb-4">
            <input type="text" placeholder="Search gangs..." className="crims-input flex-1" disabled />
            <button className="crims-btn-ghost text-xs px-4 opacity-50 cursor-not-allowed">SEARCH</button>
          </div>
          <div className="space-y-2">
            {topGangs.map((gang, i) => (
              <div key={gang.name} className="flex items-center justify-between p-3 rounded-lg border border-crims-border hover:border-crims-primary/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-crims-primary/20 flex items-center justify-center font-bold text-xs text-crims-primary">
                    #{i + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{gang.name}</span>
                      <span className="text-xs text-crims-muted bg-crims-border/50 px-1.5 py-0.5 rounded">[{gang.tag}]</span>
                    </div>
                    <p className="text-xs text-crims-muted flex items-center gap-1">
                      <Crown className="w-3 h-3" /> {gang.leader} | {gang.members} members
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-crims-muted">Respect</p>
                    <p className="text-sm font-bold text-crims-accent flex items-center gap-1">
                      <Star className="w-3 h-3" /> {gang.respect.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-crims-muted">Level</p>
                    <p className="text-sm font-bold text-crims-neon flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {gang.level}
                    </p>
                  </div>
                  <button className="crims-btn-ghost text-xs py-1.5 px-3 opacity-50 cursor-not-allowed">
                    REQUEST
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
