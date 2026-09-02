'use client';

import React, { use } from 'react';
import { WikiHome } from '@/features/wiki/components/wiki-home';

export default function WorkspaceWikiPage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const resolvedParams = use(params);
  const workspaceId = resolvedParams.workspaceId;

  return <WikiHome workspaceId={workspaceId} />;
}
