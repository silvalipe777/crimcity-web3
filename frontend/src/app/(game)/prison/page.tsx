'use client';

import { useState, useEffect, useCallback } from 'react';
import { Lock, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { usePlayerStore } from '@/stores/playerStore';

interface PrisonStatus {
  inPrison: boolean;
  timeRemaining: number;
  timeRemainingMinutes: number;
  prisonUntil: string;
  bribeCost: number;
}

export default function PrisonPage() {
  const [status, setStatus] = useState<PrisonStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [bribing, setBribing] = useState(false);
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(0);
  const { fetchPlayer, player } = usePlayerStore();

  const fetchStatus = useCallback(async () => {
    try {
      const { data } = await api.get('/prison/status');
      setStatus(data.data);
      if (data.data.timeRemaining > 0) {
        setCountdown(Math.ceil(data.data.timeRemaining / 1000));
      }
    } catch (err) {
      console.error('Failed to fetch prison status:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          fetchStatus();
          fetchPlayer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown, fetchStatus, fetchPlayer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBribe = async () => {
    setBribing(true);
    setMessage('');
    try {
      const { data } = await api.post('/prison/bribe');
      setMessage(data.data.message);
      await fetchPlayer();
      fetchStatus();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Bribe failed';
      setMessage(msg);
    } finally {
      setBribing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-crims-muted border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Lock className="w-7 h-7 text-crims-muted" />
        <h1 className="text-3xl font-bold font-crime tracking-wider">PRISON</h1>
      </div>

      {status?.inPrison ? (
        <div className="max-w-lg mx-auto">
          <div className="crims-card border-crims-danger/30 text-center">
            <Lock className="w-16 h-16 text-crims-danger mx-auto mb-4" />
            <h2 className="text-2xl font-crime font-bold text-crims-danger mb-2">YOU ARE IN PRISON</h2>
            <p className="text-crims-muted mb-6">You got caught. Wait it out or bribe the guard.</p>

            <div className="crims-card bg-crims-bg mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-crims-accent" />
                <span className="text-xs text-crims-muted uppercase">Time Remaining</span>
              </div>
              <p className="text-4xl font-bold font-crime text-crims-accent text-glow-gold">
                {formatTime(countdown)}
              </p>
            </div>

            <button
              onClick={handleBribe}
              disabled={bribing || (player?.money as number) < (status.bribeCost || 0)}
              className="crims-btn-accent w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <DollarSign className="w-5 h-5" />
              {bribing ? 'Bribing...' : `Bribe Guard ($${status.bribeCost})`}
            </button>

            {(player?.money as number) < (status.bribeCost || 0) && (
              <p className="text-xs text-crims-danger mt-2">Not enough money to bribe</p>
            )}

            {message && <p className="text-sm mt-3 text-crims-neon">{message}</p>}
          </div>
        </div>
      ) : (
        <div className="max-w-lg mx-auto">
          <div className="crims-card text-center">
            <CheckCircle className="w-16 h-16 text-crims-neon mx-auto mb-4" />
            <h2 className="text-2xl font-crime font-bold text-crims-neon mb-2">YOU ARE FREE</h2>
            <p className="text-crims-muted">No outstanding warrants. Stay out of trouble... or don't.</p>
          </div>
        </div>
      )}
    </div>
  );
}
