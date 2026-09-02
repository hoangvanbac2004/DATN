'use client';

import React, { useEffect } from 'react';
import i18n from '@/lib/i18n';
import { useSettingsStore } from '@/store/settings-store';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const language = useSettingsStore((state) => state.language);

  useEffect(() => {
    if (language && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  return <>{children}</>;
}
