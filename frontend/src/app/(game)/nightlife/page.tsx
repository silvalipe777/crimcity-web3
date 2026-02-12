'use client';

import { useState, useEffect, useCallback } from 'react';
import { Music, Zap, Flame, DollarSign, Ticket, ShoppingCart } from 'lucide-react';
import { api } from '@/lib/api';
import { usePlayerStore } from '@/stores/playerStore';
import clsx from 'clsx';

interface Drug {
  id: string;
  name: string;
  description: string;
  staminaRestore: number;
  addictionRate: number;
  buyPrice: number;
  sellPrice: number;
  ticketsRequired: number;
  levelRequired: number;
  owned: number;
}

export default function NightlifePage() {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const { player, updateStats, fetchPlayer } = usePlayerStore();

  const fetchDrugs = useCallback(async () => {
    try {
      const { data } = await api.get('/nightlife/drugs');
      setDrugs(data.data);
    } catch (err) {
      console.error('Failed to fetch drugs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDrugs(); }, [fetchDrugs]);

  const useDrug = async (drugId: string) => {
    setActionId(drugId);
    setMessage(null);
    try {
      const { data } = await api.post('/nightlife/use-drug', { drugId, quantity: 1 });
      setMessage({ text: data.data.message, type: 'success' });
      await fetchPlayer();
      fetchDrugs();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed';
      setMessage({ text: msg, type: 'error' });
    } finally {
      setActionId(null);
    }
  };

  const buyDrug = async (drugId: string) => {
    setActionId(`buy-${drugId}`);
    setMessage(null);
    try {
      const { data } = await api.post('/nightlife/buy', { drugId, quantity: 5 });
      setMessage({ text: data.data.message, type: 'success' });
      await fetchPlayer();
      fetchDrugs();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed';
      setMessage({ text: msg, type: 'error' });
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-crims-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Music className="w-7 h-7 text-crims-secondary" />
        <h1 className="text-3xl font-bold font-crime tracking-wider">NIGHTLIFE</h1>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="crims-card flex items-center gap-3">
          <Zap className="w-8 h-8 text-crims-accent" />
          <div>
            <p className="text-xs text-crims-muted">Stamina</p>
            <p className="text-2xl font-bold text-crims-accent">{player?.stamina as number}/{player?.maxStamina as number}</p>
          </div>
        </div>
        <div className="crims-card flex items-center gap-3">
          <Flame className="w-8 h-8 text-orange-400" />
          <div>
            <p className="text-xs text-crims-muted">Addiction</p>
            <p className="text-2xl font-bold text-orange-400">{(player?.addiction as number)?.toFixed(1)}%</p>
          </div>
        </div>
        <div className="crims-card flex items-center gap-3">
          <Ticket className="w-8 h-8 text-crims-neon" />
          <div>
            <p className="text-xs text-crims-muted">Tickets</p>
            <p className="text-2xl font-bold text-crims-neon">{player?.tickets as number}</p>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={clsx(
          'crims-card mb-6 border-l-4',
          message.type === 'success' ? 'border-l-crims-neon bg-crims-neon/5' : 'border-l-crims-danger bg-crims-danger/5'
        )}>
          <p className={message.type === 'success' ? 'text-crims-neon' : 'text-crims-danger'}>{message.text}</p>
        </div>
      )}

      {/* Addiction Warning */}
      {(player?.addiction as number) > 50 && (
        <div className="crims-card mb-6 border-l-4 border-l-crims-danger bg-crims-danger/5">
          <p className="text-crims-danger font-semibold flex items-center gap-2">
            <Flame className="w-4 h-4" /> High addiction! Visit the hospital for detox.
          </p>
        </div>
      )}

      {/* Drug Grid */}
      <h2 className="text-lg font-crime font-semibold text-crims-text-dim mb-3 uppercase tracking-wider">Available Substances</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {drugs.map((drug) => (
          <div key={drug.id} className="crims-card hover:border-crims-secondary/50 transition-all">
            <h3 className="font-semibold mb-1">{drug.name}</h3>
            <p className="text-xs text-crims-muted mb-3">{drug.description}</p>

            <div className="space-y-1 text-xs mb-3">
              <div className="flex justify-between">
                <span className="text-crims-muted">Stamina</span>
                <span className="text-crims-neon">+{drug.staminaRestore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-crims-muted">Addiction</span>
                <span className="text-orange-400">+{drug.addictionRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-crims-muted">Tickets</span>
                <span>{drug.ticketsRequired}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-crims-muted">Owned</span>
                <span className={drug.owned > 0 ? 'text-crims-neon' : 'text-crims-muted'}>{drug.owned}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-crims-muted">Price</span>
                <span className="text-crims-accent">${drug.buyPrice}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => buyDrug(drug.id)}
                disabled={actionId === `buy-${drug.id}`}
                className="crims-btn-ghost flex-1 text-xs py-1.5 flex items-center justify-center gap-1"
              >
                <ShoppingCart className="w-3 h-3" /> Buy 5
              </button>
              <button
                onClick={() => useDrug(drug.id)}
                disabled={actionId === drug.id || drug.owned === 0}
                className="crims-btn-secondary flex-1 text-xs py-1.5 disabled:opacity-50"
              >
                {actionId === drug.id ? 'Using...' : 'Use'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
