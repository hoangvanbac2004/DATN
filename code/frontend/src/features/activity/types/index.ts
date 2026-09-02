import type { UserDto } from '@/features/auth/types';

export type ActivityEntityType = 'TASK' | 'PROJECT' | 'WORKSPACE' | 'COMMENT' | 'MEMBER' | 'WIKI' | 'WHITEBOARD';

export interface ActivityLogDto {
  id: string;
  action: string;
  entityType: ActivityEntityType;
  entityId: string;
  userId: string;
  user?: UserDto;
  details?: string;
  workspaceId?: string;
  projectId?: string;
  createdAt: string;
}

export interface ActivityFeedFilter {
  entityType?: string;
  page?: number;
  size?: number;
}

export interface ActivityGroup {
  dateLabel: string;
  items: ActivityLogDto[];
}
