import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/features/auth/types';
import type {
  NotificationDto,
  PaginatedNotificationsResponse,
  UnreadCountResponse,
} from '../types';

export const notificationService = {
  getUserNotifications: async (
    page = 0,
    size = 20,
    unreadOnly = false
  ): Promise<PaginatedNotificationsResponse> => {
    const res = await apiClient.get<ApiResponse<PaginatedNotificationsResponse>>('/notifications', {
      params: { page, size, unreadOnly },
    });
    return res.data.data;
  },

  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const res = await apiClient.get<ApiResponse<UnreadCountResponse>>('/notifications/unread-count');
    return res.data.data;
  },

  markAsRead: async (notificationId: string): Promise<NotificationDto> => {
    const res = await apiClient.patch<ApiResponse<NotificationDto>>(`/notifications/${notificationId}/read`);
    return res.data.data;
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch<ApiResponse<void>>('/notifications/read-all');
  },

  deleteNotification: async (notificationId: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/notifications/${notificationId}`);
  },
};
