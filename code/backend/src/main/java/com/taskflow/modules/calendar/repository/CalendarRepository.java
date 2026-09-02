package com.taskflow.modules.calendar.repository;

import com.taskflow.modules.calendar.entity.CalendarEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CalendarRepository extends JpaRepository<CalendarEventEntity, UUID> {
}
