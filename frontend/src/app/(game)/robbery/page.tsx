'use client';

import { useState, useEffect, useCallback } from 'react';
import { Crosshair, Lock, Clock, Zap, DollarSign, Star, Gem, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api';
import { usePlayerStore } from '@/stores/playerStore';
import clsx from 'clsx';

interface Robbery {
  id: string;
  name: string;
  description: string;
  levelRequired: number;
  staminaCost: number;
  baseDifficulty: number;
  minRewardMoney: number;
  maxRewardMoney: number;
  minRewardRespect: number;
  maxRewardRespect: number;
  tokenReward: number;
  cooldownSeconds: number;
  isGangRobbery: boolean;
  minGangMembers: number;
  available: boolean;
  locked: boolean;
}

interface RobberyResult {
  success: boolean;
  moneyEarned: number;
  respectEarned: number;
  tokensEarned: number;
  wasCaught: boolean;
  message: string;
  updatedStats: Record<string, unknown>;
}

export default function RobberyPage() {
  const [robberies, setRobberies] = useState<Robbery[]>([]);
  const [result, setResult] = useState<RobberyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [attemptingId, setAttemptingId] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  const { updateStats, player } = usePlayerStore();

  const fetchRobberies = useCallback(async () => {
    try {
      const { data } = await api.get('/robbery');
      setRobberies(data.data);
    } catch (err) {
      console.error('Failed to fetch robberies:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRobberies(); }, [fetchRobberies]);

  // Cooldown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldowns(prev => {
        const updated = { ...prev };
        for (const key of Object.keys(updated)) {
          updated[key] = Math.max(0, updated[key] - 1);
          if (updated[key] === 0) delete updated[key];
        }
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const attemptRobbery = async (robberyId: string, cooldownSeconds: number) => {
    if (attemptingId || cooldowns[robberyId]) return;
    setAttemptingId(robberyId);
    setResult(null);

    try {
      const { data } = await api.post(`/robbery/${robberyId}/attempt`);
      setResult(data.data);
      updateStats(data.data.updatedStats);
      setCooldowns(prev => ({ ...prev, [robberyId]: cooldownSeconds }));
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Robbery failed';
      setResult({ success: false, moneyEarned: 0, respectEarned: 0, tokensEarned: 0, wasCaught: false, message, updatedStats: {} });
    } finally {
      setAttemptingId(null);
    }
  };

  const difficultyStars = (difficulty: number) => {
    const stars = Math.round((1 - difficulty) * 5);
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < stars ? 'text-crims-accent' : 'text-crims-border'}>*</span>
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-crims-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Crosshair className="w-7 h-7 text-crims-primary" />
        <h1 className="text-3xl font-bold font-crime tracking-wider">ROBBERY</h1>
      </div>

      {/* Result Banner */}
      {result && (
        <div className={clsx(
          'crims-card mb-6 border-l-4 animate-in fade-in',
          result.success ? 'border-l-crims-neon bg-crims-neon/5' :
          result.wasCaught ? 'border-l-crims-danger bg-crims-danger/5' :
          'border-l-crims-accent bg-crims-accent/5'
        )}>
          <div className="flex items-start gap-3">
            {result.wasCaught && <AlertTriangle className="w-5 h-5 text-crims-danger flex-shrink-0 mt-0.5" />}
            <div>
              <p className={clsx(
                'font-semibold',
                result.success ? 'text-crims-neon' : result.wasCaught ? 'text-crims-danger' : 'text-crims-accent'
              )}>
                {result.success ? 'SUCCESS!' : result.wasCaught ? 'BUSTED!' : 'FAILED'}
              </p>
              <p className="text-sm text-crims-text-dim mt-1">{result.message}</p>
              {result.success && (
                <div className="flex gap-4 mt-2">
                  <span className="text-crims-neon text-sm flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" /> +${result.moneyEarned}
                  </span>
                  <span className="text-crims-accent text-sm flex items-center gap-1">
                    <Star className="w-3.5 h-3.5" /> +{result.respectEarned}
                  </span>
                  {result.tokensEarned > 0 && (
                    <span className="text-crims-secondary text-sm flex items-center gap-1">
                      <Gem className="w-3.5 h-3.5" /> +{result.tokensEarned} $CRIMS
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Solo Robberies */}
      <div className="mb-8">
        <h2 className="text-lg font-crime font-semibold text-crims-text-dim mb-3 uppercase tracking-wider">Solo Crimes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {robberies.filter(r => !r.isGangRobbery).map((robbery) => (
            <div
              key={robbery.id}
              className={clsx(
                'crims-card transition-all duration-200',
                robbery.locked ? 'opacity-50' : 'hover:border-crims-primary/50 hover:shadow-lg hover:shadow-crims-primary/5'
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-sm">{robbery.name}</h3>
                {robbery.locked && <Lock className="w-4 h-4 text-crims-muted" />}
              </div>
              <p className="text-xs text-crims-muted mb-3">{robbery.description}</p>

              <div className="space-y-1.5 text-xs mb-3">
                <div className="flex justify-between">
                  <span className="text-crims-muted">Difficulty</span>
                  <span className="font-mono">{difficultyStars(robbery.baseDifficulty)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-crims-muted flex items-center gap-1"><Zap className="w-3 h-3" /> Stamina</span>
                  <span className="text-crims-accent">{robbery.staminaCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-crims-muted flex items-center gap-1"><DollarSign className="w-3 h-3" /> Reward</span>
                  <span className="text-crims-neon">${robbery.minRewardMoney}-${robbery.maxRewardMoney}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-crims-muted flex items-center gap-1"><Star className="w-3 h-3" /> Respect</span>
                  <span className="text-crims-accent">{robbery.minRewardRespect}-{robbery.maxRewardRespect}</span>
                </div>
                {robbery.tokenReward > 0 && (
                  <div className="flex justify-between">
                    <span className="text-crims-muted flex items-center gap-1"><Gem className="w-3 h-3" /> $CRIMS</span>
                    <span className="text-crims-secondary">{robbery.tokenReward}</span>
                  </div>
                )}
              </div>

              {robbery.locked ? (
                <div className="text-center text-xs text-crims-muted py-2 border border-crims-border rounded-lg">
                  Requires Level {robbery.levelRequired}
                </div>
              ) : cooldowns[robbery.id] ? (
                <div className="flex items-center justify-center gap-1 text-xs text-crims-accent py-2 border border-crims-border rounded-lg">
                  <Clock className="w-3 h-3" /> {cooldowns[robbery.id]}s
                </div>
              ) : (
                <button
                  onClick={() => attemptRobbery(robbery.id, robbery.cooldownSeconds)}
                  disabled={attemptingId === robbery.id || (player?.stamina as number) < robbery.staminaCost}
                  className="crims-btn-primary w-full text-xs py-2 disabled:opacity-50"
                >
                  {attemptingId === robbery.id ? (
                    <span className="flex items-center justify-center gap-1">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Robbing...
                    </span>
                  ) : (
                    'ROB'
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Gang Robberies */}
      {robberies.some(r => r.isGangRobbery) && (
        <div>
          <h2 className="text-lg font-crime font-semibold text-crims-text-dim mb-3 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-5 h-5" /> Gang Heists
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {robberies.filter(r => r.isGangRobbery).map((robbery) => (
              <div key={robbery.id} className={clsx('crims-card', robbery.locked && 'opacity-50')}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{robbery.name}</h3>
                  <span className="text-xs text-crims-secondary bg-crims-secondary/10 px-2 py-0.5 rounded">
                    {robbery.minGangMembers}+ members
                  </span>
                </div>
                <p className="text-xs text-crims-muted mb-3">{robbery.description}</p>
                <div className="text-xs space-y-1 mb-3">
                  <div className="flex justify-between">
                    <span className="text-crims-muted">Reward</span>
                    <span className="text-crims-neon">${robbery.minRewardMoney.toLocaleString()}-${robbery.maxRewardMoney.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-crims-muted">$CRIMS</span>
                    <span className="text-crims-secondary">{robbery.tokenReward}</span>
                  </div>
                </div>
                <div className="text-center text-xs text-crims-muted py-2 border border-crims-border rounded-lg">
                  {robbery.locked ? `Requires Level ${robbery.levelRequired}` : 'Requires Gang Membership'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Users({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
