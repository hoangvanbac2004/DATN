import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/features/auth/types';
import type { CreateReminderInput, ReminderDto, UpdateReminderInput } from '../types';

export const reminderService = {
  getTaskReminders: async (taskId: string): Promise<ReminderDto[]> => {
    const res = await apiClient.get<ApiResponse<ReminderDto[]>>(`/tasks/${taskId}/reminders`);
    return res.data.data;
  },

  getUserUpcomingReminders: async (): Promise<ReminderDto[]> => {
    const res = await apiClient.get<ApiResponse<ReminderDto[]>>('/reminders/user');
    return res.data.data;
  },

  getReminderDetails: async (reminderId: string): Promise<ReminderDto> => {
    const res = await apiClient.get<ApiResponse<ReminderDto>>(`/reminders/${reminderId}`);
    return res.data.data;
  },

  createReminder: async (taskId: string, data: CreateReminderInput): Promise<ReminderDto> => {
    const res = await apiClient.post<ApiResponse<ReminderDto>>(`/tasks/${taskId}/reminders`, data);
    return res.data.data;
  },

  updateReminder: async (reminderId: string, data: UpdateReminderInput): Promise<ReminderDto> => {
    const res = await apiClient.put<ApiResponse<ReminderDto>>(`/reminders/${reminderId}`, data);
    return res.data.data;
  },

  dismissReminder: async (reminderId: string): Promise<ReminderDto> => {
    const res = await apiClient.patch<ApiResponse<ReminderDto>>(`/reminders/${reminderId}/dismiss`);
    return res.data.data;
  },

  deleteReminder: async (reminderId: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/reminders/${reminderId}`);
  },
};
