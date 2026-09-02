'use client';

import React from 'react';
import { Search, Archive } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { TaskFilterState } from '../types';

interface TaskFiltersProps {
  filters: TaskFilterState;
  onChange: (filters: TaskFilterState) => void;
}

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  const { t } = useTranslation('task');
  const { t: tCommon } = useTranslation('common');

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between rounded-xl border border-surface-border bg-surface p-3 shadow-xs">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
        <input
          type="text"
          placeholder={t('filters.searchPlaceholder', { defaultValue: 'Tìm kiếm công việc...' })}
          value={filters.search || ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value || undefined })}
          className="w-full rounded-lg border border-surface-border bg-surface-alt pl-9 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted transition focus:border-primary focus:outline-none"
        />
      </div>

      {/* Filter Selectors */}
      <div className="flex items-center space-x-2 overflow-x-auto">
        <select
          value={filters.status || ''}
          onChange={(e) => onChange({ ...filters, status: e.target.value || undefined })}
          className="rounded-lg border border-surface-border bg-surface-alt px-3 py-1.5 text-xs text-text-primary transition focus:border-primary focus:outline-none cursor-pointer"
        >
          <option value="" className="bg-surface text-text-primary">{t('filters.allStatuses', { defaultValue: 'Tất cả trạng thái' })}</option>
          <option value="TODO" className="bg-surface text-text-primary">{t('statuses.TODO', { defaultValue: 'Cần làm' })}</option>
          <option value="IN_PROGRESS" className="bg-surface text-text-primary">{t('statuses.IN_PROGRESS', { defaultValue: 'Đang làm' })}</option>
          <option value="IN_REVIEW" className="bg-surface text-text-primary">{t('statuses.IN_REVIEW', { defaultValue: 'Đang xem xét' })}</option>
          <option value="COMPLETED" className="bg-surface text-text-primary">{t('statuses.DONE', { defaultValue: 'Hoàn thành' })}</option>
          <option value="CANCELLED" className="bg-surface text-text-primary">{t('statuses.CANCELLED', { defaultValue: 'Đã hủy' })}</option>
        </select>

        <select
          value={filters.priority || ''}
          onChange={(e) => onChange({ ...filters, priority: e.target.value || undefined })}
          className="rounded-lg border border-surface-border bg-surface-alt px-3 py-1.5 text-xs text-text-primary transition focus:border-primary focus:outline-none cursor-pointer"
        >
          <option value="" className="bg-surface text-text-primary">{t('filters.allPriorities', { defaultValue: 'Tất cả độ ưu tiên' })}</option>
          <option value="LOW" className="bg-surface text-text-primary">{t('priorities.LOW', { defaultValue: 'Thấp' })}</option>
          <option value="MEDIUM" className="bg-surface text-text-primary">{t('priorities.MEDIUM', { defaultValue: 'Trung bình' })}</option>
          <option value="HIGH" className="bg-surface text-text-primary">{t('priorities.HIGH', { defaultValue: 'Cao' })}</option>
          <option value="URGENT" className="bg-surface text-text-primary">{t('priorities.URGENT', { defaultValue: 'Khẩn cấp' })}</option>
        </select>

        <button
          type="button"
          onClick={() => onChange({ ...filters, archived: !filters.archived })}
          className={`flex items-center space-x-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
            filters.archived
              ? 'border-status-warning/40 bg-status-warning/10 text-status-warning'
              : 'border-surface-border bg-surface-alt text-text-secondary hover:text-text-primary'
          }`}
        >
          <Archive className="h-3.5 w-3.5" />
          <span>{tCommon('status.archived', { defaultValue: 'Đã lưu trữ' })}</span>
        </button>
      </div>
    </div>
  );
}
