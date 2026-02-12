'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crosshair, Shield, Coins, Sword, User } from 'lucide-react';
import { api } from '@/lib/api';
import { usePlayerStore } from '@/stores/playerStore';

export default function LoginPage() {
  const router = useRouter();
  const { setToken, fetchPlayer } = usePlayerStore();
  const [username, setUsername] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsAuthenticating(true);
    setError('');

    try {
      const { data: authRes } = await api.post('/auth/login', { username: username.trim() });

      setToken(authRes.data.token);
      await fetchPlayer();
      router.push('/robbery');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Login failed';
      setError(message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-crims-bg flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-crims-primary/5 via-transparent to-crims-secondary/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-crims-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-crims-secondary/5 rounded-full blur-3xl" />

      <div className="relative z-10 text-center max-w-lg px-6">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-crims-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-crims-primary/30 animate-glow">
            <Crosshair className="w-10 h-10 text-crims-primary" />
          </div>
          <h1 className="text-5xl font-bold font-crime tracking-wider text-crims-primary text-glow-red">
            CRIMCITY
          </h1>
          <p className="text-crims-text-dim mt-2 font-crime text-lg tracking-wide">
            WEB3 CRIME RPG ON SOLANA
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="crims-card text-center">
            <Sword className="w-6 h-6 text-crims-primary mx-auto mb-2" />
            <p className="text-xs text-crims-muted">Rob & Fight</p>
          </div>
          <div className="crims-card text-center">
            <Coins className="w-6 h-6 text-crims-accent mx-auto mb-2" />
            <p className="text-xs text-crims-muted">Earn $CRIMS</p>
          </div>
          <div className="crims-card text-center">
            <Shield className="w-6 h-6 text-crims-secondary mx-auto mb-2" />
            <p className="text-xs text-crims-muted">Build Empire</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="crims-card">
          <h2 className="text-lg font-crime font-semibold mb-4">Choose Your Criminal Name</h2>

          <form onSubmit={handleLogin} className="space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-crims-muted" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username..."
                maxLength={20}
                className="w-full bg-crims-bg border border-crims-border rounded-lg py-3 pl-10 pr-4 text-crims-text placeholder:text-crims-muted/50 focus:outline-none focus:border-crims-primary focus:ring-1 focus:ring-crims-primary/50 transition-colors"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={isAuthenticating || !username.trim()}
              className="crims-btn-primary w-full py-3 text-base disabled:opacity-50"
            >
              {isAuthenticating ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Entering...
                </span>
              ) : (
                'Enter CrimCity'
              )}
            </button>
          </form>

          {error && (
            <p className="text-crims-danger text-sm mt-3">{error}</p>
          )}
        </div>

        <p className="text-crims-muted text-xs mt-6">
          CrimCity - Web3 Crime RPG.
          <br />
          Built on Solana. Earn $CRIMS tokens.
        </p>
      </div>
    </div>
  );
}
