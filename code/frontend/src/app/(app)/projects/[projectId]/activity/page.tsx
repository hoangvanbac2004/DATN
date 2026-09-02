import type { Metadata } from 'next';
import { ActivityFeed } from '@/features/activity/components/activity-feed';
import { use } from 'react';

export const metadata: Metadata = {
  title: 'Project Activity – TaskFlow',
  description: 'View all project activity, grouped by date with full filtering support.',
};

interface ProjectActivityPageProps {
  params: Promise<{ projectId: string }>;
}

export default function ProjectActivityPage({ params }: ProjectActivityPageProps) {
  const { projectId } = use(params);

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <ActivityFeed
          mode="project"
          projectId={projectId}
          title="Project Activity"
        />
      </div>
    </div>
  );
}
