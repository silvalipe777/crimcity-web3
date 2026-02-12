'use client';

import { User, Star, Zap, DollarSign, Shield, Sword, Car, Heart, Trophy, Gem, TrendingUp, Clock, GraduationCap } from 'lucide-react';
import { usePlayerStore } from '@/stores/playerStore';

export default function ProfilePage() {
  const { player } = usePlayerStore();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <User className="w-7 h-7 text-crims-primary" />
        <h1 className="text-3xl font-bold font-crime tracking-wider">PROFILE</h1>
      </div>

      {/* Player Identity */}
      <div className="crims-card mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-crims-primary/20 flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8 text-crims-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold font-crime">
              {(player?.username as string) || 'Unknown Criminal'}
            </h2>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-xs text-crims-accent flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Level {(player?.level as number) || 1}
              </span>
              <span className="text-xs text-crims-muted flex items-center gap-1">
                <GraduationCap className="w-3 h-3" /> {(player?.profession as string) || 'No Profession'}
              </span>
              <span className="text-xs text-crims-muted flex items-center gap-1">
                <Clock className="w-3 h-3" /> Joined {(player?.createdAt as string) ? new Date(player?.createdAt as string).toLocaleDateString() : '--'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-crims-muted">Respect</p>
            <p className="text-2xl font-bold text-crims-accent flex items-center gap-1">
              <Star className="w-5 h-5" /> {(player?.respect as number)?.toLocaleString() || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Core Stats */}
      <h2 className="text-lg font-crime font-semibold text-crims-text-dim mb-3 uppercase tracking-wider">Player Stats</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="crims-card text-center">
          <Heart className="w-6 h-6 mx-auto mb-1 text-crims-danger" />
          <p className="text-xs text-crims-muted">Health</p>
          <p className="text-xl font-bold">
            {(player?.health as number) || '--'}/{(player?.maxHealth as number) || '--'}
          </p>
        </div>
        <div className="crims-card text-center">
          <Zap className="w-6 h-6 mx-auto mb-1 text-crims-accent" />
          <p className="text-xs text-crims-muted">Stamina</p>
          <p className="text-xl font-bold">
            {(player?.stamina as number) || '--'}/{(player?.maxStamina as number) || '--'}
          </p>
        </div>
        <div className="crims-card text-center">
          <DollarSign className="w-6 h-6 mx-auto mb-1 text-crims-neon" />
          <p className="text-xs text-crims-muted">Cash</p>
          <p className="text-xl font-bold text-crims-neon">
            ${(player?.money as number)?.toLocaleString() || 0}
          </p>
        </div>
        <div className="crims-card text-center">
          <Gem className="w-6 h-6 mx-auto mb-1 text-crims-secondary" />
          <p className="text-xs text-crims-muted">$CRIMS</p>
          <p className="text-xl font-bold text-crims-secondary">
            {(player?.tokens as number)?.toLocaleString() || 0}
          </p>
        </div>
      </div>

      {/* Combat Stats & Profession */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Combat Stats */}
        <div>
          <h2 className="text-lg font-crime font-semibold text-crims-text-dim mb-3 uppercase tracking-wider">Combat Stats</h2>
          <div className="crims-card">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm">
                  <Sword className="w-4 h-4 text-crims-primary" /> Attack Power
                </span>
                <span className="font-bold font-mono">{(player?.attack as number) || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-crims-secondary" /> Defense Power
                </span>
                <span className="font-bold font-mono">{(player?.defense as number) || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm">
                  <Car className="w-4 h-4 text-crims-accent" /> Escape Chance
                </span>
                <span className="font-bold font-mono">{(player?.escape as number) || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm">
                  <Trophy className="w-4 h-4 text-crims-neon" /> Win Rate
                </span>
                <span className="font-bold font-mono text-crims-neon">--%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profession Info */}
        <div>
          <h2 className="text-lg font-crime font-semibold text-crims-text-dim mb-3 uppercase tracking-wider">Profession</h2>
          <div className="crims-card">
            <div className="text-center py-4">
              <GraduationCap className="w-10 h-10 mx-auto mb-2 text-crims-muted" />
              <p className="font-semibold text-lg font-crime">
                {(player?.profession as string) || 'No Profession'}
              </p>
              <p className="text-xs text-crims-muted mt-1">
                Visit the University to learn skills and unlock a profession.
              </p>
              <div className="mt-4 space-y-2 text-xs text-left">
                <div className="flex justify-between p-2 rounded border border-crims-border">
                  <span className="text-crims-muted">Robberies Completed</span>
                  <span className="font-mono">{(player?.totalRobberies as number) || 0}</span>
                </div>
                <div className="flex justify-between p-2 rounded border border-crims-border">
                  <span className="text-crims-muted">Assaults Won</span>
                  <span className="font-mono">{(player?.assaultsWon as number) || 0}</span>
                </div>
                <div className="flex justify-between p-2 rounded border border-crims-border">
                  <span className="text-crims-muted">Times Jailed</span>
                  <span className="font-mono">{(player?.timesJailed as number) || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Equipped Items */}
      <h2 className="text-lg font-crime font-semibold text-crims-text-dim mb-3 uppercase tracking-wider">Equipped Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="crims-card">
          <div className="flex items-center gap-3 mb-3">
            <Sword className="w-5 h-5 text-crims-primary" />
            <h3 className="font-semibold text-sm">Weapon</h3>
          </div>
          <div className="text-center py-4 border border-dashed border-crims-border rounded-lg">
            <Sword className="w-8 h-8 mx-auto text-crims-muted mb-2" />
            <p className="text-xs text-crims-muted">
              {(player?.equippedWeapon as string) || 'No weapon equipped'}
            </p>
          </div>
        </div>
        <div className="crims-card">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5 text-crims-secondary" />
            <h3 className="font-semibold text-sm">Armor</h3>
          </div>
          <div className="text-center py-4 border border-dashed border-crims-border rounded-lg">
            <Shield className="w-8 h-8 mx-auto text-crims-muted mb-2" />
            <p className="text-xs text-crims-muted">
              {(player?.equippedArmor as string) || 'No armor equipped'}
            </p>
          </div>
        </div>
        <div className="crims-card">
          <div className="flex items-center gap-3 mb-3">
            <Car className="w-5 h-5 text-crims-accent" />
            <h3 className="font-semibold text-sm">Vehicle</h3>
          </div>
          <div className="text-center py-4 border border-dashed border-crims-border rounded-lg">
            <Car className="w-8 h-8 mx-auto text-crims-muted mb-2" />
            <p className="text-xs text-crims-muted">
              {(player?.equippedVehicle as string) || 'No vehicle equipped'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
