package com.taskflow.modules.reminder.repository;

import com.taskflow.modules.reminder.entity.ReminderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReminderRepository extends JpaRepository<ReminderEntity, UUID> {

    List<ReminderEntity> findByTaskIdAndIsDeletedFalseOrderByRemindAtAsc(UUID taskId);

    List<ReminderEntity> findByUserIdAndStatusAndIsDeletedFalseOrderByRemindAtAsc(UUID userId, String status);

    Optional<ReminderEntity> findByIdAndIsDeletedFalse(UUID id);

    @Query("SELECT r FROM ReminderEntity r WHERE r.status = 'PENDING' AND r.remindAt <= :now AND r.isDeleted = false")
    List<ReminderEntity> findDuePendingReminders(@Param("now") Instant now);
}
