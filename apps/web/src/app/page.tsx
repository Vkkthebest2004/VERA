'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { IngestionStudio } from '@/components/IngestionStudio';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Subtle architectural background grid / daylight ambiance */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.4]"
        style={{
          backgroundImage: 'radial-gradient(#d4d4d8 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <div className="flex-1">
          <IngestionStudio />
        </div>
      </div>
    </main>
  );
}
