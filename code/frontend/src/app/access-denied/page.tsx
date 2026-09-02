'use client';

import React from 'react';
import { AccessDenied } from '@/features/rbac/components/access-denied';

export default function AccessDeniedPage() {
  return (
    <main className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center">
      <AccessDenied />
    </main>
  );
}
