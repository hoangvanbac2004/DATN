'use client';

import React, { useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/store/settings-store';
import { useUpdateUserSettings } from '@/features/user/hooks/use-settings';

export default function NotificationsPage() {
  const { t } = useTranslation('settings');
  const currentSettings = useSettingsStore();
  const updateSettingsMutation = useUpdateUserSettings();

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleToggle = (key: string, value: boolean) => {
    setSuccessMsg(null);
    updateSettingsMutation.mutate(
      { [key]: value },
      {
        onSuccess: () => {
          setSuccessMsg('Đã cập nhật tùy chọn thông báo!');
          setTimeout(() => setSuccessMsg(null), 2500);
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {successMsg && (
        <div className="flex items-center space-x-2 rounded-lg border border-status-success/30 bg-status-success/10 p-3 text-xs text-status-success">
          <Check className="h-4 w-4" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-xs space-y-6">
        <div className="flex items-center space-x-3 border-b border-surface-border pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-status-warning/10 text-status-warning">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-primary font-heading">{t('notifications.title')}</h2>
            <p className="text-[11px] text-text-secondary">{t('notifications.subtitle')}</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <div>
              <p className="text-xs font-semibold text-text-primary">{t('notifications.emailNotifications')}</p>
              <p className="text-[11px] text-text-secondary">Nhận cảnh báo qua Email khi có công việc được giao hoặc cập nhật</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('emailNotifications', !currentSettings.emailNotifications)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                currentSettings.emailNotifications ? 'bg-primary' : 'bg-surface-border'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  currentSettings.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Desktop Alerts */}
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <div>
              <p className="text-xs font-semibold text-text-primary">{t('notifications.desktopNotifications')}</p>
              <p className="text-[11px] text-text-secondary">Hiển thị thông báo trình duyệt cho các công việc sắp hết hạn</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('desktopNotifications', !currentSettings.desktopNotifications)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                currentSettings.desktopNotifications ? 'bg-primary' : 'bg-surface-border'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  currentSettings.desktopNotifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Weekly Digest */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-text-primary">{t('notifications.weeklyDigest')}</p>
              <p className="text-[11px] text-text-secondary">Nhận Email tóm tắt thống kê hiệu suất công việc hàng tuần</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('weeklyDigest', !currentSettings.weeklyDigest)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                currentSettings.weeklyDigest ? 'bg-primary' : 'bg-surface-border'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  currentSettings.weeklyDigest ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
