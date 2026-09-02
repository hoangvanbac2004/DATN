import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserSettingsState {
  theme: 'dark' | 'light' | 'system';
  language: 'en' | 'vi';
  timezone: string;
  dateFormat: string;
  emailNotifications: boolean;
  desktopNotifications: boolean;
  weeklyDigest: boolean;
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  setLanguage: (language: 'en' | 'vi') => void;
  setTimezone: (timezone: string) => void;
  setDateFormat: (dateFormat: string) => void;
  setNotificationToggles: (toggles: {
    emailNotifications?: boolean;
    desktopNotifications?: boolean;
    weeklyDigest?: boolean;
  }) => void;
  setAllSettings: (settings: Partial<UserSettingsState>) => void;
}

export const useSettingsStore = create<UserSettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      language: 'vi',
      timezone: 'UTC',
      dateFormat: 'YYYY-MM-DD',
      emailNotifications: true,
      desktopNotifications: true,
      weeklyDigest: true,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setTimezone: (timezone) => set({ timezone }),
      setDateFormat: (dateFormat) => set({ dateFormat }),
      setNotificationToggles: (toggles) =>
        set((state) => ({
          ...state,
          ...toggles,
        })),
      setAllSettings: (settings) =>
        set((state) => ({
          ...state,
          ...settings,
        })),
    }),
    {
      name: 'taskflow-user-settings-storage',
    }
  )
);
