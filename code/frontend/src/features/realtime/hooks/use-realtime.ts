'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { stompService } from '../services/stomp-service';
import type { RealtimeEvent, PresenceState } from '../types';

export function useRealtimeConnection() {
  const { accessToken, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      stompService.connect(accessToken);
    }
    return () => {
      stompService.disconnect();
    };
  }, [isAuthenticated, accessToken]);
}

export function useProjectTaskRealtime(
  projectId: string,
  onTaskEvent: (event: RealtimeEvent) => void
) {
  useEffect(() => {
    if (!projectId) return;

    const destination = `/topic/projects/${projectId}/tasks`;
    stompService.subscribe(destination, onTaskEvent);

    return () => {
      stompService.unsubscribe(destination);
    };
  }, [projectId, onTaskEvent]);
}

export function usePresenceRealtime(workspaceId: string) {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!workspaceId) return;

    const destination = `/topic/workspaces/${workspaceId}/presence`;
    stompService.subscribe(destination, (event) => {
      const presence = event.payload as PresenceState;
      if (presence && presence.onlineUserIds) {
        setOnlineUsers(presence.onlineUserIds);
      }
    });

    return () => {
      stompService.unsubscribe(destination);
    };
  }, [workspaceId]);

  return { onlineUsers };
}
