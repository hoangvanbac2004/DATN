import type { Metadata } from 'next';
import { ActivityFeed } from '@/features/activity/components/activity-feed';
import { use } from 'react';

export const metadata: Metadata = {
  title: 'Workspace Activity – TaskFlow',
  description: 'View all workspace activity, grouped by date with full filtering support.',
};

interface WorkspaceActivityPageProps {
  params: Promise<{ workspaceId: string }>;
}

export default function WorkspaceActivityPage({ params }: WorkspaceActivityPageProps) {
  const { workspaceId } = use(params);

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <ActivityFeed
          mode="workspace"
          workspaceId={workspaceId}
          title="Workspace Activity"
        />
      </div>
    </div>
  );
}
