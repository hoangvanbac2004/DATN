import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/features/auth/types';
import type {
  CalendarEventItemDto,
  CreateCalendarEventInput,
  UpdateCalendarEventInput,
} from '../types';

export const calendarService = {
  getCalendarEvents: async (startDate: string, endDate: string): Promise<CalendarEventItemDto[]> => {
    const res = await apiClient.get<ApiResponse<CalendarEventItemDto[]>>('/calendar/events', {
      params: { startDate, endDate },
    });
    return res.data.data;
  },

  getDayEvents: async (date: string): Promise<CalendarEventItemDto[]> => {
    const res = await apiClient.get<ApiResponse<CalendarEventItemDto[]>>('/calendar/day', {
      params: { date },
    });
    return res.data.data;
  },

  getWeekEvents: async (startDate: string): Promise<CalendarEventItemDto[]> => {
    const res = await apiClient.get<ApiResponse<CalendarEventItemDto[]>>('/calendar/week', {
      params: { startDate },
    });
    return res.data.data;
  },

  getMonthEvents: async (year: number, month: number): Promise<CalendarEventItemDto[]> => {
    const res = await apiClient.get<ApiResponse<CalendarEventItemDto[]>>('/calendar/month', {
      params: { year, month },
    });
    return res.data.data;
  },

  createEvent: async (data: CreateCalendarEventInput): Promise<CalendarEventItemDto> => {
    const res = await apiClient.post<ApiResponse<CalendarEventItemDto>>('/calendar/events', data);
    return res.data.data;
  },

  updateEvent: async (eventId: string, data: UpdateCalendarEventInput): Promise<CalendarEventItemDto> => {
    const res = await apiClient.put<ApiResponse<CalendarEventItemDto>>(`/calendar/events/${eventId}`, data);
    return res.data.data;
  },

  deleteEvent: async (eventId: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/calendar/events/${eventId}`);
  },
};
