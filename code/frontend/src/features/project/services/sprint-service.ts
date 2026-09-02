'use client';

export interface SprintItem {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  goal?: string;
  status: 'ACTIVE' | 'PLANNED' | 'COMPLETED';
  completedAt?: string;
}

export function getStoredSprints(projectId?: string): SprintItem[] {
  if (typeof window === 'undefined') return [];
  const key = `taskflow_sprints_${projectId || 'default'}`;
  try {
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);
  } catch {}

  const now = new Date();
  const start1 = new Date(now);
  const end1 = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const start2 = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
  const end2 = new Date(now.getTime() + 29 * 24 * 60 * 60 * 1000);

  const formatDate = (d: Date) =>
    d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const defaults: SprintItem[] = [
    {
      id: `sprint-${projectId || '1'}-1`,
      name: 'Sprint 1',
      startDate: formatDate(start1),
      endDate: formatDate(end1),
      goal: 'Phát triển tính năng cốt lõi và kiểm thử ban đầu',
      status: 'ACTIVE',
    },
    {
      id: `sprint-${projectId || '1'}-2`,
      name: 'Sprint 2',
      startDate: formatDate(start2),
      endDate: formatDate(end2),
      goal: 'Tối ưu hiệu năng, hoàn thiện luồng người dùng và nghiệm thu',
      status: 'PLANNED',
    },
  ];

  try {
    localStorage.setItem(key, JSON.stringify(defaults));
  } catch {}

  return defaults;
}

export function saveStoredSprints(sprints: SprintItem[], projectId?: string) {
  if (typeof window === 'undefined') return;
  const key = `taskflow_sprints_${projectId || 'default'}`;
  try {
    localStorage.setItem(key, JSON.stringify(sprints));
    window.dispatchEvent(new CustomEvent('sprints_updated'));
  } catch {}
}

export function getStoredTaskSprintMapping(projectId?: string): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const key = `taskflow_task_sprint_mapping_${projectId || 'default'}`;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function saveStoredTaskSprintMapping(mapping: Record<string, string>, projectId?: string) {
  if (typeof window === 'undefined') return;
  const key = `taskflow_task_sprint_mapping_${projectId || 'default'}`;
  try {
    localStorage.setItem(key, JSON.stringify(mapping));
    window.dispatchEvent(new CustomEvent('task_sprint_mapping_updated'));
  } catch {}
}
