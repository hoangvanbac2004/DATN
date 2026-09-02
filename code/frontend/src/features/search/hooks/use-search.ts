import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchService } from '../services/search-service';
import type { AdvancedSearchFilter, CreateSavedFilterPayload, SearchQueryParams } from '../types';

export const searchKeys = {
  all: ['search'] as const,
  results: (filter: AdvancedSearchFilter) => [...searchKeys.all, 'results', filter] as const,
  savedFilters: (workspaceId?: string) => [...searchKeys.all, 'savedFilters', workspaceId] as const,
  history: () => [...searchKeys.all, 'history'] as const,
};

export function useAdvancedSearch(filter: AdvancedSearchFilter, enabled = true) {
  return useQuery({
    queryKey: searchKeys.results(filter),
    queryFn: () => searchService.globalSearch(filter),
    enabled: enabled && (Boolean(filter.query) || Boolean(filter.status) || Boolean(filter.priority)),
  });
}

export function useGlobalSearch(params: SearchQueryParams, enabled = true) {
  return useAdvancedSearch({ query: params.q, workspaceId: params.workspaceId, status: params.status, priority: params.priority }, enabled);
}

export function useSavedSearchFilters(workspaceId?: string) {
  return useQuery({
    queryKey: searchKeys.savedFilters(workspaceId),
    queryFn: () => searchService.getSavedFilters(workspaceId),
  });
}

export function useSearchHistory() {
  return useQuery({
    queryKey: searchKeys.history(),
    queryFn: () => searchService.getSearchHistory(),
  });
}

export function useCreateSavedFilter(workspaceId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSavedFilterPayload) => searchService.createSavedFilter(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: searchKeys.savedFilters(workspaceId) });
    },
  });
}

export function useDeleteSavedFilter(workspaceId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (filterId: string) => searchService.deleteSavedFilter(filterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: searchKeys.savedFilters(workspaceId) });
    },
  });
}
