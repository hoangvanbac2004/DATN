package com.taskflow.modules.notification.repository;

import com.taskflow.modules.notification.entity.NotificationEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, UUID> {

    Page<NotificationEntity> findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    Page<NotificationEntity> findByUserIdAndIsReadFalseAndIsDeletedFalseOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    long countByUserIdAndIsReadFalseAndIsDeletedFalse(UUID userId);

    Optional<NotificationEntity> findByIdAndIsDeletedFalse(UUID id);

    @Modifying
    @Query("UPDATE NotificationEntity n SET n.isRead = true, n.readAt = :now WHERE n.userId = :userId AND n.isRead = false AND n.isDeleted = false")
    int markAllAsReadForUser(@Param("userId") UUID userId, @Param("now") Instant now);
}
