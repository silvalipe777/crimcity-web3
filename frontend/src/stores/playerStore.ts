import { create } from 'zustand';
import { api } from '@/lib/api';

interface PlayerState {
  player: Record<string, unknown> | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
  fetchPlayer: () => Promise<void>;
  setToken: (token: string) => void;
  logout: () => void;
  updateStats: (stats: Record<string, unknown>) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  player: null,
  isLoading: false,
  isAuthenticated: false,
  token: typeof window !== 'undefined' ? localStorage.getItem('crims_token') : null,

  fetchPlayer: async () => {
    const token = get().token;
    if (!token) return;

    set({ isLoading: true });
    try {
      const { data } = await api.get('/player/me');
      set({ player: data.data, isAuthenticated: true, isLoading: false });
    } catch {
      set({ player: null, isAuthenticated: false, isLoading: false });
    }
  },

  setToken: (token: string) => {
    localStorage.setItem('crims_token', token);
    set({ token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('crims_token');
    set({ player: null, isAuthenticated: false, token: null });
  },

  updateStats: (stats: Record<string, unknown>) => {
    const player = get().player;
    if (player) {
      set({ player: { ...player, ...stats } });
    }
  },
}));
