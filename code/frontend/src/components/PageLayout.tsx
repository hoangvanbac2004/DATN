'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useUiStore } from '@/store/uiStore';
import { cn } from '@/utils';

export default function PageLayout({ children }: { children: ReactNode }) {
  const { sidebarOpen } = useUiStore();

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300',
          sidebarOpen ? 'pl-64' : 'pl-0'
        )}
      >
        <Topbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
