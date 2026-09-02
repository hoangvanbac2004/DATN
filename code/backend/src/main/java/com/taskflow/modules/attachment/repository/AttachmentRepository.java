package com.taskflow.modules.attachment.repository;

import com.taskflow.modules.attachment.entity.AttachmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AttachmentRepository extends JpaRepository<AttachmentEntity, UUID> {

    List<AttachmentEntity> findByTaskIdAndIsDeletedFalseOrderByCreatedAtDesc(UUID taskId);

    Optional<AttachmentEntity> findByIdAndIsDeletedFalse(UUID id);
}
