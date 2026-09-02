'use client';

import React, { useMemo, useState } from 'react';
import { Activity, Loader2 } from 'lucide-react';
import { ActivityFilterBar } from './activity-filter-bar';
import { ActivityTimeline } from './activity-timeline';
import {
  useWorkspaceActivityFeed,
  useProjectActivityFeed,
  useUserActivityFeed,
  groupActivitiesByDate,
} from '../hooks/use-activity';
import type { ActivityLogDto } from '../types';

interface ActivityFeedProps {
  mode: 'workspace' | 'project' | 'user';
  workspaceId?: string;
  projectId?: string;
  title?: string;
}

export function ActivityFeed({ mode, workspaceId, projectId, title }: ActivityFeedProps) {
  const [entityType, setEntityType] = useState('');

  const workspaceQuery = useWorkspaceActivityFeed(workspaceId ?? '', entityType || undefined);
  const projectQuery   = useProjectActivityFeed(projectId ?? '', entityType || undefined);
  const userQuery      = useUserActivityFeed(entityType || undefined);

  const query = mode === 'workspace' ? workspaceQuery
              : mode === 'project'   ? projectQuery
              : userQuery;

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = query;

  const allItems: ActivityLogDto[] = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  );

  const groups = useMemo(() => groupActivitiesByDate(allItems), [allItems]);

  return (
    <div className="flex flex-col space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">{title ?? 'Activity Feed'}</h3>
          {allItems.length > 0 && (
            <span className="rounded-lg bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-gray-300">
              {allItems.length}
            </span>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <ActivityFilterBar activeFilter={entityType} onFilterChange={setEntityType} />

      {/* Content */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : groups.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
            <Activity className="h-6 w-6 text-gray-500" />
          </div>
          <p className="text-sm font-semibold text-gray-400">No activity yet</p>
          <p className="mt-1 text-xs text-gray-600">
            {entityType ? `No ${entityType.toLowerCase()} activity found.` : 'Activity will appear here as the team works.'}
          </p>
        </div>
      ) : (
        <ActivityTimeline
          groups={groups}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={Boolean(hasNextPage)}
          onLoadMore={fetchNextPage}
        />
      )}
    </div>
  );
}
