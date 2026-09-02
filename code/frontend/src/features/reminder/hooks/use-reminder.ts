import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reminderService } from '../services/reminder-service';
import type { CreateReminderInput, UpdateReminderInput } from '../types';

export const REMINDER_QUERY_KEYS = {
  taskReminders: (taskId: string) => ['reminders', taskId] as const,
  userUpcoming: ['user-upcoming-reminders'] as const,
  detail: (reminderId: string) => ['reminder', reminderId] as const,
};

export function useTaskReminders(taskId: string | null) {
  return useQuery({
    queryKey: REMINDER_QUERY_KEYS.taskReminders(taskId || ''),
    queryFn: () => reminderService.getTaskReminders(taskId!),
    enabled: !!taskId,
  });
}

export function useUserUpcomingReminders() {
  return useQuery({
    queryKey: REMINDER_QUERY_KEYS.userUpcoming,
    queryFn: () => reminderService.getUserUpcomingReminders(),
  });
}

export function useCreateReminder(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReminderInput) => reminderService.createReminder(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REMINDER_QUERY_KEYS.taskReminders(taskId) });
      queryClient.invalidateQueries({ queryKey: REMINDER_QUERY_KEYS.userUpcoming });
    },
  });
}

export function useUpdateReminder(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reminderId, data }: { reminderId: string; data: UpdateReminderInput }) =>
      reminderService.updateReminder(reminderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REMINDER_QUERY_KEYS.taskReminders(taskId) });
      queryClient.invalidateQueries({ queryKey: REMINDER_QUERY_KEYS.userUpcoming });
    },
  });
}

export function useDismissReminder(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reminderId: string) => reminderService.dismissReminder(reminderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REMINDER_QUERY_KEYS.taskReminders(taskId) });
      queryClient.invalidateQueries({ queryKey: REMINDER_QUERY_KEYS.userUpcoming });
    },
  });
}

export function useDeleteReminder(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reminderId: string) => reminderService.deleteReminder(reminderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REMINDER_QUERY_KEYS.taskReminders(taskId) });
      queryClient.invalidateQueries({ queryKey: REMINDER_QUERY_KEYS.userUpcoming });
    },
  });
}
