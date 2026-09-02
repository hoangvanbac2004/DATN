import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { calendarService } from '../services/calendar-service';
import type { CreateCalendarEventInput, UpdateCalendarEventInput } from '../types';

export const CALENDAR_QUERY_KEYS = {
  events: (startDate: string, endDate: string) => ['calendar-events', startDate, endDate] as const,
  month: (year: number, month: number) => ['calendar-month', year, month] as const,
};

export function useCalendarEvents(startDate: string, endDate: string) {
  return useQuery({
    queryKey: CALENDAR_QUERY_KEYS.events(startDate, endDate),
    queryFn: () => calendarService.getCalendarEvents(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}

export function useMonthCalendarEvents(year: number, month: number) {
  return useQuery({
    queryKey: CALENDAR_QUERY_KEYS.month(year, month),
    queryFn: () => calendarService.getMonthEvents(year, month),
  });
}

export function useCreateCalendarEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCalendarEventInput) => calendarService.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      queryClient.invalidateQueries({ queryKey: ['calendar-month'] });
    },
  });
}

export function useUpdateCalendarEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: UpdateCalendarEventInput }) =>
      calendarService.updateEvent(eventId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      queryClient.invalidateQueries({ queryKey: ['calendar-month'] });
    },
  });
}

export function useDeleteCalendarEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => calendarService.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      queryClient.invalidateQueries({ queryKey: ['calendar-month'] });
    },
  });
}
