import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wikiService } from '../services/wiki-service';
import type { CreateWikiPagePayload, UpdateWikiPagePayload } from '../types';

export const wikiKeys = {
  all: ['wiki'] as const,
  tree: (workspaceId: string) => [...wikiKeys.all, 'tree', workspaceId] as const,
  page: (pageId: string) => [...wikiKeys.all, 'page', pageId] as const,
  versions: (pageId: string) => [...wikiKeys.all, 'versions', pageId] as const,
};

export function useWorkspaceWikiTree(workspaceId: string) {
  return useQuery({
    queryKey: wikiKeys.tree(workspaceId),
    queryFn: () => wikiService.getWorkspaceWikiTree(workspaceId),
    enabled: Boolean(workspaceId),
  });
}

export function useWikiPage(pageId?: string | null) {
  return useQuery({
    queryKey: wikiKeys.page(pageId || ''),
    queryFn: () => wikiService.getPageDetails(pageId!),
    enabled: Boolean(pageId),
  });
}

export function useWikiVersions(pageId?: string | null) {
  return useQuery({
    queryKey: wikiKeys.versions(pageId || ''),
    queryFn: () => wikiService.getPageVersions(pageId!),
    enabled: Boolean(pageId),
  });
}

export function useCreateWikiPage(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateWikiPagePayload) => wikiService.createPage(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wikiKeys.tree(workspaceId) });
    },
  });
}

export function useUpdateWikiPage(workspaceId: string, pageId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateWikiPagePayload) => wikiService.updatePage(pageId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wikiKeys.page(pageId) });
      queryClient.invalidateQueries({ queryKey: wikiKeys.tree(workspaceId) });
      queryClient.invalidateQueries({ queryKey: wikiKeys.versions(pageId) });
    },
  });
}

export function useDeleteWikiPage(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pageId: string) => wikiService.deletePage(pageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wikiKeys.tree(workspaceId) });
    },
  });
}
