'use client';

import dynamic from 'next/dynamic';
import { PROD_ENERGY } from '@/game/constants';

// Dynamic import Game component to avoid SSR issues with Three.js
const Game = dynamic(() => import('@/game/Game'), { ssr: false });
const DevToolbar = dynamic(() => import('@/dev/DevToolbar'), { ssr: false });

export default function Home() {
  return (
    <main style={{
      width: '100vw',
      height: '100vh',
      background: '#1a1a2e',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <Game />
      {!PROD_ENERGY && <DevToolbar />}
    </main>
  );
}
