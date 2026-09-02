import type { TaskDto } from '@/features/task/types';
import type { ProjectDto } from '@/features/project/types';

export type SearchEntityType = 'ALL' | 'TASK' | 'PROJECT' | 'TAG' | 'COMMENT';

export interface SearchQueryParams {
  q?: string;
  type?: SearchEntityType;
  workspaceId?: string;
  projectId?: string;
  status?: string;
  priority?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  size?: number;
}

export interface SearchResultItemDto {
  id: string;
  title: string;
  description?: string;
  type: SearchEntityType;
  link?: string;
  workspaceId?: string;
  projectId?: string;
  taskId?: string;
  status?: string;
  priority?: string;
  color?: string;
  createdAt: string;
}

export interface AdvancedSearchFilter {
  query?: string;
  status?: string;
  priority?: string;
  workspaceId?: string;
  projectId?: string;
}

export interface SavedSearchFilterDto {
  id: string;
  userId: string;
  workspaceId?: string;
  name: string;
  query?: string;
  filterConfigJson: string;
  isPinned: boolean;
  createdAt: string;
}

export interface CreateSavedFilterPayload {
  name: string;
  query?: string;
  filterConfigJson: string;
  workspaceId?: string;
  isPinned?: boolean;
}

export interface SearchHistoryDto {
  id: string;
  userId: string;
  query: string;
  entityType: string;
  createdAt: string;
}

export interface GlobalSearchResultDto {
  query: string;
  tasks: TaskDto[];
  projects: ProjectDto[];
  comments: unknown[];
  tags: unknown[];
  items?: SearchResultItemDto[];
  totalTasks?: number;
  totalProjects?: number;
  totalTags?: number;
  totalComments?: number;
  totalElements?: number;
  totalResults: number;
  page?: number;
  size?: number;
  totalPages?: number;
  last?: boolean;
}
