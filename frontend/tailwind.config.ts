import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'crims-bg': '#0a0a0f',
        'crims-surface': '#12121a',
        'crims-surface-light': '#1a1a2e',
        'crims-border': '#1e1e2e',
        'crims-primary': '#e74c3c',
        'crims-primary-dark': '#c0392b',
        'crims-secondary': '#8b5cf6',
        'crims-accent': '#f39c12',
        'crims-accent-dark': '#e67e22',
        'crims-neon': '#00ff88',
        'crims-danger': '#ff3333',
        'crims-muted': '#6b7280',
        'crims-text': '#e2e8f0',
        'crims-text-dim': '#94a3b8',
      },
      fontFamily: {
        crime: ['Rajdhani', 'Oswald', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(231, 76, 60, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(231, 76, 60, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
