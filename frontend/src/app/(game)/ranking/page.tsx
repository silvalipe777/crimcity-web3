'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trophy, Star, Users, Medal } from 'lucide-react';
import { api } from '@/lib/api';
import clsx from 'clsx';

interface RankedPlayer {
  rank: number;
  id: string;
  username: string;
  level: number;
  respect: number;
  profession: string;
  gangTag: string | null;
}

export default function RankingPage() {
  const [players, setPlayers] = useState<RankedPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'players' | 'gangs'>('players');

  const fetchRankings = useCallback(async () => {
    try {
      const { data } = await api.get('/ranking/players');
      setPlayers(data.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRankings(); }, [fetchRankings]);

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-amber-600';
    return 'text-crims-muted';
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-7 h-7 text-crims-accent" />
        <h1 className="text-3xl font-bold font-crime tracking-wider">RANKING</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('players')} className={clsx('crims-btn text-sm', tab === 'players' ? 'bg-crims-primary text-white' : 'bg-crims-surface text-crims-muted')}>
          <Star className="w-4 h-4 inline mr-1" /> Players
        </button>
        <button onClick={() => setTab('gangs')} className={clsx('crims-btn text-sm', tab === 'gangs' ? 'bg-crims-primary text-white' : 'bg-crims-surface text-crims-muted')}>
          <Users className="w-4 h-4 inline mr-1" /> Gangs
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-crims-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="crims-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-crims-border text-left text-xs text-crims-muted uppercase">
                <th className="px-4 py-3 w-16">#</th>
                <th className="px-4 py-3">Player</th>
                <th className="px-4 py-3">Profession</th>
                <th className="px-4 py-3">Gang</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3 text-right">Respect</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => (
                <tr key={p.id} className="border-b border-crims-border/50 hover:bg-crims-surface-light transition-colors">
                  <td className="px-4 py-3">
                    <span className={clsx('font-bold', getRankColor(p.rank))}>
                      {p.rank <= 3 ? <Medal className="w-5 h-5 inline" /> : p.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{p.username}</td>
                  <td className="px-4 py-3 text-sm text-crims-muted">{p.profession}</td>
                  <td className="px-4 py-3 text-sm text-crims-secondary">{p.gangTag || '-'}</td>
                  <td className="px-4 py-3 text-sm">{p.level}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-crims-accent font-bold">{p.respect.toLocaleString()}</span>
                  </td>
                </tr>
              ))}
              {players.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-crims-muted">No players yet. Be the first!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
