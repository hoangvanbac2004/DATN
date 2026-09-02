package com.taskflow.modules.calendar.service;

import com.taskflow.modules.calendar.dto.CalendarEventItemDto;
import com.taskflow.modules.calendar.dto.CreateCalendarEventRequest;
import com.taskflow.modules.calendar.dto.UpdateCalendarEventRequest;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Domain Service interface for managing calendar events and task schedules.
 */
public interface CalendarService {

    /**
     * Gets unified calendar events (custom events + tasks with due dates) in date range.
     *
     * @param userId    UUID identifier of requesting user
     * @param startDate start boundary instant
     * @param endDate   end boundary instant
     * @return list of unified CalendarEventItemDto instances
     */
    List<CalendarEventItemDto> getCalendarEvents(UUID userId, Instant startDate, Instant endDate);

    /**
     * Gets events for a specific day (YYYY-MM-DD).
     */
    List<CalendarEventItemDto> getDayEvents(UUID userId, String dateStr);

    /**
     * Gets events for a specific week starting on startDate (YYYY-MM-DD).
     */
    List<CalendarEventItemDto> getWeekEvents(UUID userId, String startDateStr);

    /**
     * Gets events for a specific month (year and month 1-12).
     */
    List<CalendarEventItemDto> getMonthEvents(UUID userId, int year, int month);

    /**
     * Creates a new custom calendar event.
     */
    CalendarEventItemDto createEvent(UUID userId, CreateCalendarEventRequest request);

    /**
     * Gets custom calendar event details by ID.
     */
    CalendarEventItemDto getEventDetails(UUID userId, UUID eventId);

    /**
     * Updates an existing custom calendar event.
     */
    CalendarEventItemDto updateEvent(UUID userId, UUID eventId, UpdateCalendarEventRequest request);

    /**
     * Soft-deletes a custom calendar event.
     */
    void deleteEvent(UUID userId, UUID eventId);
}
