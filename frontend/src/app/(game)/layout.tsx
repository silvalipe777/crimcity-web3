'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePlayerStore } from '@/stores/playerStore';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';

export default function GameLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, isAuthenticated, fetchPlayer, isLoading } = usePlayerStore();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchPlayer();
  }, [token, fetchPlayer, router]);

  if (!token) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-crims-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-crims-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-crims-muted font-crime text-lg">Loading your criminal empire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crims-bg">
      <Sidebar />
      <TopBar />
      <main className="ml-56 mt-14 p-6">
        {children}
      </main>
    </div>
  );
}
