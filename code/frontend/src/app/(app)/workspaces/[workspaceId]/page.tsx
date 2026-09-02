'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWorkspaces } from '@/features/workspace/hooks/use-workspace';
import { useWorkspaceTasks } from '@/features/task/hooks/use-task';
import { useWorkspaceStore } from '@/store/workspace-store';
import { useInviteMember } from '@/features/team/hooks/use-team';
import { WorkspaceHeader, type WorkspaceTab } from '@/features/workspace/components/WorkspaceHeader';
import { WorkspaceSummaryTab }  from '@/features/workspace/components/tabs/WorkspaceSummaryTab';
import { WorkspaceProjectsTab } from '@/features/workspace/components/tabs/WorkspaceProjectsTab';
import { WorkspaceBacklogTab }  from '@/features/workspace/components/tabs/WorkspaceBacklogTab';
import { WorkspaceBoardTab }    from '@/features/workspace/components/tabs/WorkspaceBoardTab';
import { WorkspaceTimelineTab } from '@/features/workspace/components/tabs/WorkspaceTimelineTab';
import { WorkspaceFormsTab }    from '@/features/workspace/components/tabs/WorkspaceFormsTab';
import { WorkspaceMembersTab }  from '@/features/workspace/components/tabs/WorkspaceMembersTab';
import { WorkspaceCodeTab }     from '@/features/workspace/components/tabs/WorkspaceCodeTab';
import { GlobalTaskModal }  from '@/features/task/components/global-task-modal';
import { AssignTaskModal }  from '@/features/task/components/assign-task-modal';
import { InviteDialog }     from '@/features/team/components/invite-dialog';
import { TaskDetailModal }  from '@/features/task/components/task-detail-modal';
import type { TaskDto } from '@/features/task/types';

export default function WorkspaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;

  const { data: workspaces = [] } = useWorkspaces();
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);
  const currentWorkspace = workspaces.find((w) => w.id === workspaceId) || activeWorkspace;

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('summary');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskDto | null>(null);

  const inviteMutation = useInviteMember(workspaceId);
  const { data: tasks = [], isLoading: isTasksLoading } = useWorkspaceTasks(workspaceId || null);

  return (
    <div className="space-y-6">
      {/* Workspace Header with all tabs */}
      <WorkspaceHeader
        workspace={currentWorkspace || null}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenInviteMember={() => setIsInviteOpen(true)}
        onOpenAssignTask={() => setIsAssignModalOpen(true)}
        onOpenCreateTask={() => setIsTaskModalOpen(true)}
      />

      {/* Tab Content */}
      {activeTab === 'summary' && (
        <WorkspaceSummaryTab
          workspaceName={currentWorkspace?.name || 'Workspace'}
          tasks={tasks}
          isLoading={isTasksLoading}
          onOpenCreateTask={() => setIsTaskModalOpen(true)}
        />
      )}

      {activeTab === 'projects' && (
        <WorkspaceProjectsTab workspaceId={workspaceId} />
      )}

      {activeTab === 'backlog' && (
        <WorkspaceBacklogTab
          tasks={tasks}
          isLoading={isTasksLoading}
          workspaceId={workspaceId}
          onOpenCreateTask={() => setIsTaskModalOpen(true)}
          onSelectTask={(task) => setSelectedTask(task)}
        />
      )}

      {activeTab === 'board' && (
        <WorkspaceBoardTab
          tasks={tasks}
          isLoading={isTasksLoading}
          onOpenCreateTask={() => setIsTaskModalOpen(true)}
          onSelectTask={(task) => setSelectedTask(task)}
        />
      )}

      {activeTab === 'timeline' && (
        <WorkspaceTimelineTab
          tasks={tasks}
          isLoading={isTasksLoading}
          onOpenCreateTask={() => setIsTaskModalOpen(true)}
          onSelectTask={(task) => setSelectedTask(task)}
        />
      )}

      {activeTab === 'forms' && (
        <WorkspaceFormsTab workspaceId={workspaceId} />
      )}

      {activeTab === 'members' && (
        <WorkspaceMembersTab
          workspaceId={workspaceId}
          onOpenInviteMember={() => setIsInviteOpen(true)}
        />
      )}

      {activeTab === 'code' && (
        <WorkspaceCodeTab />
      )}

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />

      {/* Global Dialogs */}
      <GlobalTaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />

      <AssignTaskModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        workspaceId={workspaceId}
      />

      <InviteDialog
        workspaceId={workspaceId}
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onSubmit={(payload, callbacks) => {
          inviteMutation.mutate(payload, {
            onSuccess: () => callbacks?.onSuccess?.(),
            onError: (err: any) => callbacks?.onError?.(err),
          });
        }}
        isLoading={inviteMutation.isPending}
      />
    </div>
  );
}

