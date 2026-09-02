'use client';

export interface DocApprovalRequestItem {
  id: string;
  type: 'WIKI' | 'WHITEBOARD';
  title: string;
  description?: string;
  category?: string; // For Wiki
  summary?: string; // For Wiki
  version?: string; // For Wiki
  initialElements?: any[]; // For Whiteboard
  workspaceId: string;
  projectId: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export const DOC_APPROVAL_KEY = 'taskflow_doc_approval_requests_store';

export function getStoredDocRequests(): DocApprovalRequestItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(DOC_APPROVAL_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function setStoredDocRequests(requests: DocApprovalRequestItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DOC_APPROVAL_KEY, JSON.stringify(requests));
    window.dispatchEvent(new CustomEvent('doc_requests_updated'));
  } catch {}
}

export function saveDocApprovalRequest(req: DocApprovalRequestItem) {
  const all = getStoredDocRequests();
  const updated = [req, ...all];
  setStoredDocRequests(updated);
}

export function approveDocRequest(id: string, reviewerName: string): DocApprovalRequestItem | null {
  const all = getStoredDocRequests();
  let approvedItem: DocApprovalRequestItem | null = null;
  const updated = all.map((item) => {
    if (item.id === id) {
      approvedItem = {
        ...item,
        status: 'APPROVED' as const,
        reviewedBy: reviewerName,
        reviewedAt: new Date().toLocaleString('vi-VN'),
      };
      return approvedItem;
    }
    return item;
  });
  setStoredDocRequests(updated);
  if (approvedItem) {
    window.dispatchEvent(new CustomEvent('doc_request_approved', { detail: approvedItem }));
  }
  return approvedItem;
}

export function rejectDocRequest(id: string, reviewerName: string): DocApprovalRequestItem | null {
  const all = getStoredDocRequests();
  let rejectedItem: DocApprovalRequestItem | null = null;
  const updated = all.map((item) => {
    if (item.id === id) {
      rejectedItem = {
        ...item,
        status: 'REJECTED' as const,
        reviewedBy: reviewerName,
        reviewedAt: new Date().toLocaleString('vi-VN'),
      };
      return rejectedItem;
    }
    return item;
  });
  setStoredDocRequests(updated);
  if (rejectedItem) {
    window.dispatchEvent(new CustomEvent('doc_request_rejected', { detail: rejectedItem }));
  }
  return rejectedItem;
}

export function deleteDocRequest(id: string) {
  const all = getStoredDocRequests();
  const updated = all.filter((item) => item.id !== id);
  setStoredDocRequests(updated);
}
