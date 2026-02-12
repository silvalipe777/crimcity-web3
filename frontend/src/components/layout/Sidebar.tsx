'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Crosshair, Music, Pill, Swords, Hospital, GraduationCap,
  Dice5, Users, Lock, ShoppingCart, Store, Trophy, TrendingUp,
  Wallet, User, LogOut
} from 'lucide-react';
import { usePlayerStore } from '@/stores/playerStore';
import clsx from 'clsx';

const navItems = [
  { href: '/robbery', label: 'Robbery', icon: Crosshair },
  { href: '/nightlife', label: 'Nightlife', icon: Music },
  { href: '/drugs', label: 'Drug Dealing', icon: Pill },
  { href: '/assault', label: 'Assault', icon: Swords },
  { href: '/hospital', label: 'Hospital', icon: Hospital },
  { href: '/university', label: 'University', icon: GraduationCap },
  { href: '/casino', label: 'Casino', icon: Dice5 },
  { href: '/gang', label: 'Gang', icon: Users },
  { href: '/prison', label: 'Prison', icon: Lock },
  { href: '/shop', label: 'Shop', icon: ShoppingCart },
  { href: '/marketplace', label: 'Marketplace', icon: Store },
  { href: '/ranking', label: 'Ranking', icon: Trophy },
  { href: '/staking', label: 'Staking', icon: TrendingUp },
  { href: '/wallet', label: 'Wallet', icon: Wallet },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { player, logout } = usePlayerStore();

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-crims-surface border-r border-crims-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-4 border-b border-crims-border">
        <Link href="/robbery" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-crims-primary rounded-lg flex items-center justify-center">
            <Crosshair className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold font-crime tracking-wider text-crims-primary text-glow-red">
            CRIMCITY
          </span>
        </Link>
      </div>

      {/* Player Info */}
      {player && (
        <div className="p-3 border-b border-crims-border">
          <Link href="/profile" className="flex items-center gap-2 hover:bg-crims-surface-light rounded-lg p-2 transition-colors">
            <div className="w-8 h-8 bg-crims-primary/20 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-crims-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{player.username as string}</p>
              <p className="text-xs text-crims-muted">Lvl {player.level as number} {player.profession as string}</p>
            </div>
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 mb-0.5',
                isActive
                  ? 'bg-crims-primary/10 text-crims-primary border-l-2 border-crims-primary'
                  : 'text-crims-text-dim hover:text-crims-text hover:bg-crims-surface-light'
              )}
            >
              <Icon className={clsx('w-4 h-4', isActive && 'text-crims-primary')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-crims-border">
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-crims-muted hover:text-crims-danger hover:bg-crims-surface-light rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Disconnect</span>
        </button>
      </div>
    </aside>
  );
}
