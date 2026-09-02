'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspaceStore } from '@/store/workspace-store';
import { useWorkspaces } from '@/features/workspace/hooks/use-workspace';
import { Loader2 } from 'lucide-react';

export default function TasksPageRedirect() {
  const router = useRouter();
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);
  const { data: workspaces = [] } = useWorkspaces();

  useEffect(() => {
    const targetWsId = activeWorkspace?.id || workspaces[0]?.id;
    if (targetWsId) {
      router.replace(`/workspaces/${targetWsId}`);
    } else {
      router.replace('/workspaces');
    }
  }, [activeWorkspace, workspaces, router]);

  return (
    <div className="flex h-64 items-center justify-center space-x-2 text-xs text-text-muted">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <span>Đang chuyển hướng sang Workspace...</span>
    </div>
  );
}
