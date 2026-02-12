'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePlayerStore } from '@/stores/playerStore';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, token } = usePlayerStore();

  useEffect(() => {
    if (token && isAuthenticated) {
      router.push('/robbery');
    } else {
      router.push('/login');
    }
  }, [token, isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-crims-bg flex items-center justify-center">
      <div className="animate-pulse text-crims-primary text-2xl font-crime">
        Loading CrimCity...
      </div>
    </div>
  );
}
