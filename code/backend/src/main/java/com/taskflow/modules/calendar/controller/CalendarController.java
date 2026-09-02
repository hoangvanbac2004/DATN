package com.taskflow.modules.calendar.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.calendar.dto.CalendarEventItemDto;
import com.taskflow.modules.calendar.dto.CreateCalendarEventRequest;
import com.taskflow.modules.calendar.dto.UpdateCalendarEventRequest;
import com.taskflow.modules.calendar.service.CalendarService;
import com.taskflow.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/calendar")
@Tag(name = "Calendar Management", description = "Endpoints for calendar schedules, task due dates, and custom events")
public class CalendarController {

    private final CalendarService calendarService;

    public CalendarController(CalendarService calendarService) {
        this.calendarService = calendarService;
    }

    @GetMapping("/events")
    @Operation(summary = "Get calendar events and task schedules in date range")
    public ResponseEntity<ApiResponse<List<CalendarEventItemDto>>> getCalendarEvents(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant endDate) {
        List<CalendarEventItemDto> events = calendarService.getCalendarEvents(principal.getId(), startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Calendar events retrieved successfully", events));
    }

    @GetMapping("/day")
    @Operation(summary = "Get events for a specific day (YYYY-MM-DD)")
    public ResponseEntity<ApiResponse<List<CalendarEventItemDto>>> getDayEvents(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam String date) {
        List<CalendarEventItemDto> events = calendarService.getDayEvents(principal.getId(), date);
        return ResponseEntity.ok(ApiResponse.success("Day events retrieved successfully", events));
    }

    @GetMapping("/week")
    @Operation(summary = "Get events for a specific week starting on startDate (YYYY-MM-DD)")
    public ResponseEntity<ApiResponse<List<CalendarEventItemDto>>> getWeekEvents(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam String startDate) {
        List<CalendarEventItemDto> events = calendarService.getWeekEvents(principal.getId(), startDate);
        return ResponseEntity.ok(ApiResponse.success("Week events retrieved successfully", events));
    }

    @GetMapping("/month")
    @Operation(summary = "Get events for a specific month (year and month 1-12)")
    public ResponseEntity<ApiResponse<List<CalendarEventItemDto>>> getMonthEvents(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam int year,
            @RequestParam int month) {
        List<CalendarEventItemDto> events = calendarService.getMonthEvents(principal.getId(), year, month);
        return ResponseEntity.ok(ApiResponse.success("Month events retrieved successfully", events));
    }

    @PostMapping("/events")
    @Operation(summary = "Create a custom calendar event")
    public ResponseEntity<ApiResponse<CalendarEventItemDto>> createEvent(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateCalendarEventRequest request) {
        CalendarEventItemDto created = calendarService.createEvent(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Calendar event created successfully", created));
    }

    @GetMapping("/events/{eventId}")
    @Operation(summary = "Get calendar event details by ID")
    public ResponseEntity<ApiResponse<CalendarEventItemDto>> getEventDetails(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID eventId) {
        CalendarEventItemDto event = calendarService.getEventDetails(principal.getId(), eventId);
        return ResponseEntity.ok(ApiResponse.success("Calendar event details retrieved successfully", event));
    }

    @PutMapping("/events/{eventId}")
    @Operation(summary = "Update an existing custom calendar event")
    public ResponseEntity<ApiResponse<CalendarEventItemDto>> updateEvent(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID eventId,
            @Valid @RequestBody UpdateCalendarEventRequest request) {
        CalendarEventItemDto updated = calendarService.updateEvent(principal.getId(), eventId, request);
        return ResponseEntity.ok(ApiResponse.success("Calendar event updated successfully", updated));
    }

    @DeleteMapping("/events/{eventId}")
    @Operation(summary = "Delete a custom calendar event")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID eventId) {
        calendarService.deleteEvent(principal.getId(), eventId);
        return ResponseEntity.ok(ApiResponse.success("Calendar event deleted successfully", null));
    }
}
