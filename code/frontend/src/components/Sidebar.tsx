'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { 
  CheckSquare, 
  FolderKanban, 
  Calendar, 
  Bell, 
  Settings, 
  Sparkles, 
  LayoutDashboard 
} from 'lucide-react';
import { cn } from '@/utils';
import { useUiStore } from '@/store/uiStore';

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen } = useUiStore();
  const { t } = useTranslation('navigation');

  const navigationItems = [
    { key: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
    { key: 'tasks', href: '/tasks', icon: CheckSquare },
    { key: 'projects', href: '/projects', icon: FolderKanban },
    { key: 'calendar', href: '/calendar', icon: Calendar },
    { key: 'notifications', href: '/notifications', icon: Bell },
    { key: 'settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen w-64 border-r border-surface-border bg-background/80 backdrop-blur-glass transition-transform duration-300',
        !sidebarOpen && '-translate-x-full'
      )}
    >
      <div className="flex h-16 items-center px-6 border-b border-surface-border">
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          TaskFlow
        </span>
      </div>

      <nav className="p-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.key}
              href={item.href as any}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className="h-4 w-4" />
              {t(`menu.${item.key}` as any)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
