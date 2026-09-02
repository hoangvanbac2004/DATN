import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/features/auth/types';
import type {
  GlobalSearchResultDto,
  SavedSearchFilterDto,
  SearchHistoryDto,
  CreateSavedFilterPayload,
  AdvancedSearchFilter,
} from '../types';

export const searchService = {
  globalSearch: async (filter: AdvancedSearchFilter): Promise<GlobalSearchResultDto> => {
    const res = await apiClient.get<ApiResponse<GlobalSearchResultDto>>('/search', {
      params: {
        q: filter.query || '',
        status: filter.status,
        priority: filter.priority,
        workspaceId: filter.workspaceId,
        projectId: filter.projectId,
      },
    });
    return res.data.data;
  },

  createSavedFilter: async (data: CreateSavedFilterPayload): Promise<SavedSearchFilterDto> => {
    const res = await apiClient.post<ApiResponse<SavedSearchFilterDto>>('/search/saved-filters', data);
    return res.data.data;
  },

  getSavedFilters: async (workspaceId?: string): Promise<SavedSearchFilterDto[]> => {
    const res = await apiClient.get<ApiResponse<SavedSearchFilterDto[]>>('/search/saved-filters', {
      params: { workspaceId },
    });
    return res.data.data;
  },

  deleteSavedFilter: async (filterId: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/search/saved-filters/${filterId}`);
  },

  getSearchHistory: async (): Promise<SearchHistoryDto[]> => {
    const res = await apiClient.get<ApiResponse<SearchHistoryDto[]>>('/search/history');
    return res.data.data;
  },

  clearSearchHistory: async (): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>('/search/history');
  },
};
