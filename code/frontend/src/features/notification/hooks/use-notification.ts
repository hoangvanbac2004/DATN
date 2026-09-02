import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notification-service';

export const NOTIFICATION_QUERY_KEYS = {
  list: (page: number, unreadOnly: boolean) => ['notifications', page, unreadOnly] as const,
  unreadCount: ['notifications', 'unread-count'] as const,
};

export function useNotifications(page = 0, size = 20, unreadOnly = false) {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.list(page, unreadOnly),
    queryFn: () => notificationService.getUserNotifications(page, size, unreadOnly),
    refetchInterval: 30000, // Prepared polling interval for quasi-realtime state
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.unreadCount,
    queryFn: () => notificationService.getUnreadCount(),
    refetchInterval: 15000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => notificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => notificationService.deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
