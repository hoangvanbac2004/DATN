import { apiClient } from '@/lib/apiClient';

export const calendarService = {
  async getEvents() {
    const response = await apiClient.get('/calendar/events');
    return response.data;
  },
};
