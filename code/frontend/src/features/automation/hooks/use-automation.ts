import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { automationService } from '../services/automation-service';
import type { CreateRulePayload } from '../types';

export const automationKeys = {
  all: ['automation'] as const,
  rules: (workspaceId: string) => [...automationKeys.all, 'rules', workspaceId] as const,
  logs: (ruleId: string) => [...automationKeys.all, 'logs', ruleId] as const,
};

export function useWorkspaceAutomationRules(workspaceId: string) {
  return useQuery({
    queryKey: automationKeys.rules(workspaceId),
    queryFn: () => automationService.getWorkspaceRules(workspaceId),
    enabled: Boolean(workspaceId),
  });
}

export function useAutomationRuleLogs(ruleId: string) {
  return useQuery({
    queryKey: automationKeys.logs(ruleId),
    queryFn: () => automationService.getRuleLogs(ruleId),
    enabled: Boolean(ruleId),
  });
}

export function useCreateAutomationRule(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRulePayload) => automationService.createRule(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.rules(workspaceId) });
    },
  });
}

export function useToggleAutomationRule(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ruleId: string) => automationService.toggleRule(ruleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.rules(workspaceId) });
    },
  });
}

export function useDeleteAutomationRule(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ruleId: string) => automationService.deleteRule(ruleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.rules(workspaceId) });
    },
  });
}
