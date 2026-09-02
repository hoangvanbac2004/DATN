import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/features/auth/types';
import type { UpdateUserSettingsInput, UserSettingsDto } from '../types/settings';

export const settingsService = {
  getUserSettings: async (): Promise<UserSettingsDto> => {
    const res = await apiClient.get<ApiResponse<UserSettingsDto>>('/users/me/settings');
    return res.data.data;
  },

  updateUserSettings: async (data: UpdateUserSettingsInput): Promise<UserSettingsDto> => {
    const res = await apiClient.put<ApiResponse<UserSettingsDto>>('/users/me/settings', data);
    return res.data.data;
  },
};
