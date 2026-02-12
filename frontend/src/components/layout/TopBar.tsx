'use client';

import { Heart, Zap, DollarSign, Gem, Star, Flame } from 'lucide-react';
import { usePlayerStore } from '@/stores/playerStore';

function StatBar({ icon: Icon, label, value, max, color, showMax = true }: {
  icon: React.ElementType;
  label: string;
  value: number;
  max?: number;
  color: string;
  showMax?: boolean;
}) {
  const percentage = max ? (value / max) * 100 : 100;

  return (
    <div className="flex items-center gap-2">
      <Icon className={`w-4 h-4 ${color}`} />
      <div className="flex flex-col">
        <span className="text-[10px] text-crims-muted uppercase tracking-wider">{label}</span>
        <div className="flex items-center gap-1.5">
          {max ? (
            <>
              <div className="w-20 h-1.5 bg-crims-bg rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    percentage > 50 ? 'bg-crims-neon' : percentage > 25 ? 'bg-crims-accent' : 'bg-crims-danger'
                  }`}
                  style={{ width: `${Math.min(100, percentage)}%` }}
                />
              </div>
              {showMax && <span className="text-xs font-semibold">{value}/{max}</span>}
            </>
          ) : (
            <span className={`text-sm font-bold ${color}`}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TopBar() {
  const { player } = usePlayerStore();

  if (!player) return null;

  return (
    <header className="fixed top-0 left-56 right-0 h-14 bg-crims-surface border-b border-crims-border flex items-center px-6 gap-6 z-40">
      <StatBar
        icon={Heart}
        label="Health"
        value={player.health as number}
        max={player.maxHealth as number}
        color="text-crims-danger"
      />
      <StatBar
        icon={Zap}
        label="Stamina"
        value={player.stamina as number}
        max={player.maxStamina as number}
        color="text-crims-accent"
      />
      <StatBar
        icon={Flame}
        label="Addiction"
        value={player.addiction as number}
        max={100}
        color="text-orange-400"
        showMax={false}
      />

      <div className="h-6 w-px bg-crims-border" />

      <StatBar
        icon={DollarSign}
        label="Cash"
        value={Math.floor(player.money as number)}
        color="text-crims-neon"
      />
      <StatBar
        icon={Gem}
        label="$CRIMS"
        value={Number((player.tokenBalance as number || 0).toFixed(2))}
        color="text-crims-secondary"
      />
      <StatBar
        icon={Star}
        label="Respect"
        value={player.respect as number}
        color="text-crims-accent"
      />

      <div className="ml-auto flex items-center gap-3">
        <div className="text-right">
          <span className="text-[10px] text-crims-muted uppercase">Level</span>
          <p className="text-lg font-bold text-crims-primary leading-none">{player.level as number}</p>
        </div>
      </div>
    </header>
  );
}
