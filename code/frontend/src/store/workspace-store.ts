import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  ownerId: string;
  iconUrl?: string;
  themeColor?: string;
  memberCount: number;
  userRole: string;
  createdAt?: string;
  updatedAt?: string;
}

interface WorkspaceState {
  activeWorkspaceId: string | null;
  activeWorkspace: Workspace | null;
  setActiveWorkspace: (workspace: Workspace) => void;
  clearActiveWorkspace: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      activeWorkspaceId: null,
      activeWorkspace: null,
      setActiveWorkspace: (workspace) =>
        set({
          activeWorkspaceId: workspace.id,
          activeWorkspace: workspace,
        }),
      clearActiveWorkspace: () =>
        set({
          activeWorkspaceId: null,
          activeWorkspace: null,
        }),
    }),
    {
      name: 'taskflow-workspace-storage',
    }
  )
);
