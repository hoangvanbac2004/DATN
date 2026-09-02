import type { Metadata } from 'next';
import { AutomationHome } from '@/features/automation/components/automation-home';
import { use } from 'react';

export const metadata: Metadata = {
  title: 'Automation – TaskFlow',
  description: 'Build no-code automation rules and workflows for your workspace.',
};

interface AutomationPageProps {
  params: Promise<{ workspaceId: string }>;
}

export default function AutomationPage({ params }: AutomationPageProps) {
  const { workspaceId } = use(params);
  return <AutomationHome workspaceId={workspaceId} />;
}
