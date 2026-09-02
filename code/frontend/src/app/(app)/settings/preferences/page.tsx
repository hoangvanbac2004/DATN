'use client';

import React, { useState, useEffect } from 'react';
import { Check, Moon, Sun, Globe, Clock, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { useSettingsStore } from '@/store/settings-store';
import { useUpdateUserSettings } from '@/features/user/hooks/use-settings';

const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: '(UTC+00:00) UTC' },
  { value: 'Asia/Ho_Chi_Minh', label: '(UTC+07:00) Bangkok, Hanoi, Jakarta' },
  { value: 'America/New_York', label: '(UTC-05:00) Eastern Time (US & Canada)' },
  { value: 'Europe/London', label: '(UTC+00:00) London, Edinburgh' },
];

const DATE_FORMAT_OPTIONS = [
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2026-07-30)' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (30/07/2026)' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (07/30/2026)' },
];

export default function PreferencesPage() {
  const { t } = useTranslation('settings');
  const currentSettings = useSettingsStore();
  const updateSettingsMutation = useUpdateUserSettings();
  const { theme: nextTheme, setTheme: setNextTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const THEME_OPTIONS = [
    { value: 'light', label: t('preferences.appearance.light'), icon: Sun },
    { value: 'dark', label: t('preferences.appearance.dark'), icon: Moon },
  ];

  const LANGUAGE_OPTIONS = [
    { value: 'vi', label: t('preferences.languages.vi') },
    { value: 'en', label: t('preferences.languages.en') },
  ];

  const handleSave = (key: string, value: any) => {
    setSuccessMsg(null);
    if (key === 'language') {
      currentSettings.setLanguage(value as 'vi' | 'en');
    } else if (key === 'theme') {
      currentSettings.setTheme(value as any);
      setNextTheme(value);
    } else if (key === 'timezone') {
      currentSettings.setTimezone(value);
    } else if (key === 'dateFormat') {
      currentSettings.setDateFormat(value);
    }

    updateSettingsMutation.mutate(
      { [key]: value },
      {
        onSuccess: () => {
          setSuccessMsg(t('preferences.successMsg'));
          setTimeout(() => setSuccessMsg(null), 2500);
        },
        onError: () => {
          setSuccessMsg(t('preferences.successMsg'));
          setTimeout(() => setSuccessMsg(null), 2500);
        },
      }
    );
  };

  const activeTheme = mounted ? (nextTheme || currentSettings.theme) : currentSettings.theme;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {successMsg && (
        <div className="flex items-center space-x-2 rounded-lg border border-status-success/30 bg-status-success/10 p-3 text-xs text-status-success">
          <Check className="h-4 w-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Theme Switcher (Only Light & Dark) */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-text-primary font-heading">
            {t('preferences.appearance.title')}
          </h2>
          <p className="text-[11px] text-text-secondary">{t('preferences.appearance.subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {THEME_OPTIONS.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTheme === item.value;

            return (
              <button
                key={item.value}
                onClick={() => handleSave('theme', item.value)}
                className={`flex flex-col items-center justify-center rounded-xl border p-4 transition ${
                  isSelected
                    ? 'border-primary bg-menu-active text-menu-activeText font-semibold shadow-sm'
                    : 'border-surface-border bg-surface-alt text-text-secondary hover:text-text-primary hover:bg-surface-alt/80'
                }`}
              >
                <Icon className="h-6 w-6 mb-2" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Regional & Timezone Preferences */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-text-primary font-heading">
            {t('preferences.region.title')}
          </h2>
          <p className="text-[11px] text-text-secondary">{t('preferences.region.subtitle')}</p>
        </div>

        <div className="space-y-4">
          {/* Language Switch */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between border-b border-surface-border pb-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs font-medium text-text-primary">{t('preferences.region.languageLabel')}</p>
                <p className="text-[11px] text-text-secondary">{t('preferences.region.languageDesc')}</p>
              </div>
            </div>

            <select
              value={currentSettings.language}
              onChange={(e) => handleSave('language', e.target.value)}
              className="rounded-xl border border-surface-border bg-surface-alt px-3 py-2 text-xs text-text-primary transition focus:border-primary focus:outline-none"
            >
              {LANGUAGE_OPTIONS.map((l) => (
                <option key={l.value} value={l.value} className="bg-surface text-text-primary">
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Timezone */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between border-b border-surface-border pb-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-xs font-medium text-text-primary">{t('preferences.region.timezoneLabel')}</p>
                <p className="text-[11px] text-text-secondary">{t('preferences.region.timezoneDesc')}</p>
              </div>
            </div>

            <select
              value={currentSettings.timezone}
              onChange={(e) => handleSave('timezone', e.target.value)}
              className="rounded-xl border border-surface-border bg-surface-alt px-3 py-2 text-xs text-text-primary transition focus:border-primary focus:outline-none"
            >
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz.value} value={tz.value} className="bg-surface text-text-primary">
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Format */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-status-success" />
              <div>
                <p className="text-xs font-medium text-text-primary">{t('preferences.region.dateFormatLabel')}</p>
                <p className="text-[11px] text-text-secondary">{t('preferences.region.dateFormatDesc')}</p>
              </div>
            </div>

            <select
              value={currentSettings.dateFormat}
              onChange={(e) => handleSave('dateFormat', e.target.value)}
              className="rounded-xl border border-surface-border bg-surface-alt px-3 py-2 text-xs text-text-primary transition focus:border-primary focus:outline-none"
            >
              {DATE_FORMAT_OPTIONS.map((df) => (
                <option key={df.value} value={df.value} className="bg-surface text-text-primary">
                  {df.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
