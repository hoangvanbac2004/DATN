package com.taskflow.modules.calendar.specification;

import com.taskflow.modules.calendar.entity.CalendarEventEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public class CalendarSpecification {
    public static Specification<CalendarEventEntity> belongsToUser(UUID userId) {
        return (root, query, cb) -> cb.equal(root.get("userId"), userId);
    }
}
