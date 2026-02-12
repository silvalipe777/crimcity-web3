import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CrimCity Web3 - Crime RPG on Solana',
  description: 'The ultimate crime RPG. Rob, fight, deal, and earn $CRIMS tokens on Solana.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-crims-bg text-crims-text antialiased">
        {children}
      </body>
    </html>
  );
}
