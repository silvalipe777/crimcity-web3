'use client';

import { useState, useEffect, useCallback } from 'react';
import { Hospital as HospitalIcon, Heart, Flame, Scissors } from 'lucide-react';
import { api } from '@/lib/api';
import { usePlayerStore } from '@/stores/playerStore';
import clsx from 'clsx';

interface HospitalService {
  type: string;
  name: string;
  description: string;
  cost: number;
  effect: string;
  available: boolean;
}

export default function HospitalPage() {
  const [services, setServices] = useState<HospitalService[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionType, setActionType] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const { fetchPlayer, player } = usePlayerStore();

  const fetchServices = useCallback(async () => {
    try {
      const { data } = await api.get('/hospital/services');
      setServices(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const performAction = async (type: string) => {
    setActionType(type);
    setMessage(null);
    const endpoint = type === 'HEAL' ? '/hospital/heal' : '/hospital/detox';
    try {
      const { data } = await api.post(endpoint);
      setMessage({ text: data.data.message, type: 'success' });
      await fetchPlayer();
      fetchServices();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed';
      setMessage({ text: msg, type: 'error' });
    } finally {
      setActionType(null);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'HEAL': return Heart;
      case 'DETOX': case 'METHADONE': return Flame;
      case 'PLASTIC_SURGERY': return Scissors;
      default: return HospitalIcon;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-crims-neon border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <HospitalIcon className="w-7 h-7 text-crims-neon" />
        <h1 className="text-3xl font-bold font-crime tracking-wider">HOSPITAL</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="crims-card">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-crims-danger" />
            <span className="text-sm text-crims-muted">Health</span>
          </div>
          <div className="crims-progress">
            <div className="crims-progress-bar bg-crims-danger" style={{ width: `${((player?.health as number) / (player?.maxHealth as number)) * 100}%` }} />
          </div>
          <p className="text-sm mt-1">{player?.health as number}/{player?.maxHealth as number}</p>
        </div>
        <div className="crims-card">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-crims-muted">Addiction</span>
          </div>
          <div className="crims-progress">
            <div className="crims-progress-bar bg-orange-400" style={{ width: `${player?.addiction as number}%` }} />
          </div>
          <p className="text-sm mt-1">{(player?.addiction as number)?.toFixed(1)}%</p>
        </div>
      </div>

      {message && (
        <div className={clsx(
          'crims-card mb-6 border-l-4',
          message.type === 'success' ? 'border-l-crims-neon' : 'border-l-crims-danger'
        )}>
          <p className={message.type === 'success' ? 'text-crims-neon' : 'text-crims-danger'}>{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => {
          const Icon = getIcon(service.type);
          return (
            <div key={service.type} className={clsx('crims-card', !service.available && 'opacity-50')}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-crims-neon/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-crims-neon" />
                </div>
                <div>
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-xs text-crims-muted">{service.description}</p>
                </div>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-crims-muted">Cost: <span className="text-crims-accent">${service.cost}</span></span>
                <span className="text-crims-neon">{service.effect}</span>
              </div>
              <button
                onClick={() => performAction(service.type)}
                disabled={!service.available || actionType === service.type}
                className="crims-btn-primary w-full text-sm py-2 disabled:opacity-50"
              >
                {actionType === service.type ? 'Treating...' : service.name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
