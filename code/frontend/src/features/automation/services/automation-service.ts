import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/features/auth/types';
import type { AutomationRuleDto, AutomationLogDto, CreateRulePayload } from '../types';

export const automationService = {
  createRule: async (workspaceId: string, data: CreateRulePayload): Promise<AutomationRuleDto> => {
    const res = await apiClient.post<ApiResponse<AutomationRuleDto>>(
      `/workspaces/${workspaceId}/automation/rules`,
      data
    );
    return res.data.data;
  },

  getWorkspaceRules: async (workspaceId: string): Promise<AutomationRuleDto[]> => {
    const res = await apiClient.get<ApiResponse<AutomationRuleDto[]>>(
      `/workspaces/${workspaceId}/automation/rules`
    );
    return res.data.data;
  },

  toggleRule: async (ruleId: string): Promise<AutomationRuleDto> => {
    const res = await apiClient.patch<ApiResponse<AutomationRuleDto>>(
      `/automation/rules/${ruleId}/toggle`
    );
    return res.data.data;
  },

  deleteRule: async (ruleId: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/automation/rules/${ruleId}`);
  },

  getRuleLogs: async (ruleId: string): Promise<AutomationLogDto[]> => {
    const res = await apiClient.get<ApiResponse<AutomationLogDto[]>>(
      `/automation/rules/${ruleId}/logs`
    );
    return res.data.data;
  },
};
