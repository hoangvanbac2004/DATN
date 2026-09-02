export type RealtimeEventType =
  | 'TASK_CREATED'
  | 'TASK_UPDATED'
  | 'TASK_MOVED'
  | 'TASK_DELETED'
  | 'NOTIFICATION_RECEIVED'
  | 'PRESENCE_CHANGED';

export interface RealtimeEvent<T = unknown> {
  eventType: RealtimeEventType;
  targetId: string;
  payload: T;
  timestamp: string;
}

export interface PresenceState {
  workspaceId: string;
  onlineUserIds: string[];
  timestamp: string;
}
