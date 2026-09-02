package com.taskflow.modules.comment.repository;

import com.taskflow.modules.comment.entity.CommentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, UUID> {

    Page<CommentEntity> findByTaskIdAndIsDeletedFalseOrderByCreatedAtDesc(UUID taskId, Pageable pageable);

    Optional<CommentEntity> findByIdAndIsDeletedFalse(UUID id);

    @org.springframework.data.jpa.repository.Query("SELECT c FROM CommentEntity c WHERE c.isDeleted = false " +
           "AND (cast(:search as string) IS NULL OR LOWER(c.content) LIKE LOWER(CONCAT('%', cast(:search as string), '%')))")
    java.util.List<CommentEntity> searchComments(@org.springframework.data.repository.query.Param("search") String search);
}
