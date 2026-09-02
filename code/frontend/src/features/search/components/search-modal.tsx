'use client';

import React, { useEffect, useState } from 'react';
import { Search, X, FolderKanban, CheckSquare, CornerDownLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useWorkspaceStore } from '@/store/workspace-store';
import { useProjects } from '@/features/project/hooks/use-project';
import { useGlobalSearch } from '../hooks/use-search';
import type { SearchQueryParams } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { t } = useTranslation('search');
  const router = useRouter();
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);
  const { data: projects = [] } = useProjects(activeWorkspace?.id || null);

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'taskflow' | 'home'>('taskflow');
  const [timeFilter, setTimeFilter] = useState<string>('any');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [reportedByMe, setReportedByMe] = useState(false);
  const [statusFilter, setStatusFilter] = useState<{ open: boolean; done: boolean }>({ open: false, done: false });

  const searchParams: SearchQueryParams = {
    q: query,
    type: 'ALL',
    sortBy: 'relevance',
    page: 0,
    size: 8,
  };

  const { data: searchResults, isLoading } = useGlobalSearch(searchParams, isOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleProjectFilter = (projId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projId) ? prev.filter((id) => id !== projId) : [...prev, projId]
    );
  };

  const handleNavigateAll = () => {
    onClose();
    router.push('/tasks');
  };

  const timePillOptions = [
    { id: 'any', label: t('time.anyTime') },
    { id: 'today', label: t('time.today') },
    { id: 'yesterday', label: t('time.yesterday') },
    { id: '7days', label: t('time.past7Days') },
    { id: '30days', label: t('time.past30Days') },
    { id: 'year', label: t('time.pastYear') },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-12 p-4 backdrop-blur-xs">
      <div className="w-full max-w-4xl rounded-2xl border border-surface-border bg-surface shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-text-primary">
        {/* Top Search Input Box */}
        <div className="flex items-center space-x-3 border-b border-surface-border bg-surface px-4 py-3">
          <Search className="h-5 w-5 text-primary shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('placeholder')}
            className="w-full bg-transparent text-sm font-medium text-text-primary placeholder:text-text-muted outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-text-muted hover:bg-surface-alt hover:text-text-primary transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 2-Column Jira Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Column (60% width): Navigation Tabs, Recent Items & Navigation Shortcuts */}
          <div className="flex flex-1 flex-col overflow-y-auto border-r border-surface-border p-4 space-y-4">
            {/* Top Navigation Tabs */}
            <div className="flex items-center space-x-6 border-b border-surface-border pb-2 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('taskflow')}
                className={`pb-2 transition ${
                  activeTab === 'taskflow'
                    ? 'border-b-2 border-primary text-primary font-bold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {t('tabTaskFlow')}
              </button>
              <button
                onClick={() => setActiveTab('home')}
                className={`pb-2 transition ${
                  activeTab === 'home'
                    ? 'border-b-2 border-primary text-primary font-bold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {t('tabHome')}
              </button>
            </div>

            {/* Section Header */}
            <div>
              <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3">
                {t('recentHeader')}
              </h4>

              {/* Items List */}
              {isLoading ? (
                <div className="space-y-2 py-2">
                  <div className="h-10 animate-pulse rounded-lg bg-surface-alt" />
                  <div className="h-10 animate-pulse rounded-lg bg-surface-alt" />
                </div>
              ) : (searchResults?.items || []).length > 0 ? (
                <div className="space-y-1">
                  {(searchResults?.items || []).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onClose();
                        router.push(item.link as any);
                      }}
                      className="flex items-center space-x-3 rounded-lg px-3 py-2 text-xs cursor-pointer transition hover:bg-surface-alt"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded bg-primary/10 text-primary shrink-0">
                        {item.type === 'PROJECT' ? (
                          <FolderKanban className="h-4 w-4 text-status-success" />
                        ) : (
                          <CheckSquare className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="truncate flex-1">
                        <p className="font-semibold text-text-primary truncate">{item.title}</p>
                        {item.description && (
                          <p className="text-[11px] text-text-muted truncate">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {projects.slice(0, 4).map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => {
                        onClose();
                        router.push(`/projects/${proj.id}` as any);
                      }}
                      className="flex items-center space-x-3 rounded-lg px-3 py-2 text-xs cursor-pointer transition hover:bg-surface-alt"
                    >
                      <div
                        className="flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold text-white shrink-0"
                        style={{ backgroundColor: proj.color || '#4F46E5' }}
                      >
                        {proj.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="truncate flex-1">
                        <p className="font-semibold text-text-primary truncate">{proj.name}</p>
                        <p className="text-[10px] text-text-muted truncate">Project</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Navigation Footer Tags */}
            <div className="mt-auto pt-4 border-t border-surface-border space-y-3">
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-text-secondary">
                <span className="text-text-muted font-medium">{t('goToAll')}</span>
                <button
                  onClick={() => {
                    onClose();
                    router.push('/workspaces');
                  }}
                  className="rounded-md bg-surface-alt px-2.5 py-1 text-[11px] font-semibold text-text-primary hover:bg-menu-active hover:text-menu-activeText transition"
                >
                  {t('boards')}
                </button>
                <button
                  onClick={() => {
                    onClose();
                    router.push('/workspaces');
                  }}
                  className="rounded-md bg-surface-alt px-2.5 py-1 text-[11px] font-semibold text-text-primary hover:bg-menu-active hover:text-menu-activeText transition"
                >
                  {t('projects')}
                </button>
                <button
                  onClick={() => {
                    onClose();
                    router.push('/tasks');
                  }}
                  className="rounded-md bg-surface-alt px-2.5 py-1 text-[11px] font-semibold text-text-primary hover:bg-menu-active hover:text-menu-activeText transition"
                >
                  {t('filters')}
                </button>
                <button
                  onClick={() => {
                    onClose();
                    router.push('/settings');
                  }}
                  className="rounded-md bg-surface-alt px-2.5 py-1 text-[11px] font-semibold text-text-primary hover:bg-menu-active hover:text-menu-activeText transition"
                >
                  {t('people')}
                </button>
              </div>

              {/* View all work items action */}
              <div
                onClick={handleNavigateAll}
                className="flex items-center justify-between border-t border-surface-border pt-3.5 text-xs text-text-secondary cursor-pointer hover:text-primary transition"
              >
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-text-muted" />
                  <span className="font-semibold">{t('viewAllWorkItems')}</span>
                </div>
                <CornerDownLeft className="h-3.5 w-3.5 text-text-muted" />
              </div>
            </div>
          </div>

          {/* Right Column (40% width): Advanced Jira Filter Panel */}
          <div className="w-80 overflow-y-auto p-4 space-y-5 bg-surface-alt/30 text-xs">
            {/* LAST UPDATED */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                {t('lastUpdated')}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {timePillOptions.map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setTimeFilter(pill.id)}
                    className={`rounded-full px-3 py-1 text-[11px] font-medium transition ${
                      timeFilter === pill.id
                        ? 'bg-primary text-white font-semibold shadow-xs'
                        : 'bg-surface-alt text-text-secondary hover:text-text-primary hover:bg-surface-alt/80'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* FILTER BY PROJECT */}
            <div className="space-y-2 border-t border-surface-border pt-3">
              <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                {t('filterByProject')}
              </h4>
              <div className="space-y-1.5">
                {projects.slice(0, 3).map((proj) => (
                  <label
                    key={proj.id}
                    className="flex items-center space-x-2.5 cursor-pointer hover:text-text-primary text-text-secondary"
                  >
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(proj.id)}
                      onChange={() => toggleProjectFilter(proj.id)}
                      className="rounded border-surface-border text-primary focus:ring-primary h-3.5 w-3.5"
                    />
                    <div
                      className="h-3.5 w-3.5 rounded shrink-0"
                      style={{ backgroundColor: proj.color || '#4F46E5' }}
                    />
                    <span className="truncate">{proj.name}</span>
                  </label>
                ))}
                {projects.length > 3 && (
                  <button className="text-primary hover:underline text-[11px] font-medium">
                    {t('showMore')}
                  </button>
                )}
              </div>
            </div>

            {/* FILTER BY ASSIGNEE */}
            <div className="space-y-2 border-t border-surface-border pt-3">
              <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                {t('filterByAssignee')}
              </h4>
              <div className="space-y-1.5">
                <label className="flex items-center space-x-2.5 cursor-pointer hover:text-text-primary text-text-secondary">
                  <input type="checkbox" className="rounded border-surface-border text-primary focus:ring-primary h-3.5 w-3.5" />
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                    KT
                  </div>
                  <span>Khoa Tran</span>
                </label>
                <label className="flex items-center space-x-2.5 cursor-pointer hover:text-text-primary text-text-secondary">
                  <input type="checkbox" className="rounded border-surface-border text-primary focus:ring-primary h-3.5 w-3.5" />
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white">
                    DT
                  </div>
                  <span>Dung Tan</span>
                </label>
              </div>
            </div>

            {/* FILTER BY REPORTER */}
            <div className="space-y-2 border-t border-surface-border pt-3">
              <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                {t('filterByReporter')}
              </h4>
              <label className="flex items-center space-x-2.5 cursor-pointer hover:text-text-primary text-text-secondary">
                <input
                  type="checkbox"
                  checked={reportedByMe}
                  onChange={(e) => setReportedByMe(e.target.checked)}
                  className="rounded border-surface-border text-primary focus:ring-primary h-3.5 w-3.5"
                />
                <span>{t('reportedByMe')}</span>
              </label>
            </div>

            {/* FILTER BY STATUS */}
            <div className="space-y-2 border-t border-surface-border pt-3">
              <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                {t('filterByStatus')}
              </h4>
              <div className="flex items-center space-x-4 text-text-secondary">
                <label className="flex items-center space-x-1.5 cursor-pointer hover:text-text-primary">
                  <input
                    type="checkbox"
                    checked={statusFilter.open}
                    onChange={(e) => setStatusFilter({ ...statusFilter, open: e.target.checked })}
                    className="rounded border-surface-border text-primary focus:ring-primary h-3.5 w-3.5"
                  />
                  <span>{t('statusOpen')}</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer hover:text-text-primary">
                  <input
                    type="checkbox"
                    checked={statusFilter.done}
                    onChange={(e) => setStatusFilter({ ...statusFilter, done: e.target.checked })}
                    className="rounded border-surface-border text-primary focus:ring-primary h-3.5 w-3.5"
                  />
                  <span>{t('statusDone')}</span>
                </label>
              </div>
            </div>

            {/* FILTER BY LABEL */}
            <div className="space-y-2 border-t border-surface-border pt-3">
              <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                {t('filterByLabel')}
              </h4>
              <select className="w-full rounded-lg border border-surface-border bg-surface px-3 py-1.5 text-xs text-text-primary outline-none focus:border-primary">
                <option value="">{t('selectLabel')}</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="bug">Bug</option>
              </select>
            </div>

            {/* Feedback Footer Link */}
            <div className="border-t border-surface-border pt-3 text-right">
              <button className="text-[11px] text-text-muted hover:text-text-primary transition">
                {t('giveFeedback')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
