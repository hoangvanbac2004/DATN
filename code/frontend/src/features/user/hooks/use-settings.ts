import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settings-service';
import { useSettingsStore } from '@/store/settings-store';
import type { UpdateUserSettingsInput } from '../types/settings';

export const SETTINGS_QUERY_KEYS = {
  userSettings: ['user-settings'] as const,
};

export function useUserSettings() {
  const setAllSettings = useSettingsStore((state) => state.setAllSettings);

  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.userSettings,
    queryFn: async () => {
      const settings = await settingsService.getUserSettings();
      if (settings) {
        setAllSettings({
          theme: settings.theme as any,
          language: settings.language as any,
          timezone: settings.timezone,
          dateFormat: settings.dateFormat,
          emailNotifications: settings.emailNotifications,
          desktopNotifications: settings.desktopNotifications,
          weeklyDigest: settings.weeklyDigest,
        });
      }
      return settings;
    },
  });
}

export function useUpdateUserSettings() {
  const queryClient = useQueryClient();
  const setAllSettings = useSettingsStore((state) => state.setAllSettings);

  return useMutation({
    mutationFn: (data: UpdateUserSettingsInput) => settingsService.updateUserSettings(data),
    onSuccess: (updated) => {
      setAllSettings({
        theme: updated.theme as any,
        language: updated.language as any,
        timezone: updated.timezone,
        dateFormat: updated.dateFormat,
        emailNotifications: updated.emailNotifications,
        desktopNotifications: updated.desktopNotifications,
        weeklyDigest: updated.weeklyDigest,
      });
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.userSettings });
    },
  });
}
