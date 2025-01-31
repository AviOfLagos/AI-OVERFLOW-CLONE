'use client';

import React from 'react';
import { Providers } from '@/components/Providers';
import Header from '@/components/Header';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header />
      {children}
    </Providers>
  );
}