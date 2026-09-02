'use client';

import React, { use } from 'react';
import { WhiteboardHome } from '@/features/whiteboard/components/whiteboard-home';

export default function WorkspaceWhiteboardPage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const resolvedParams = use(params);
  const workspaceId = resolvedParams.workspaceId;

  return <WhiteboardHome workspaceId={workspaceId} />;
}
