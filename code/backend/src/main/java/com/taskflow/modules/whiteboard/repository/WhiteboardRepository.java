package com.taskflow.modules.whiteboard.repository;

import com.taskflow.modules.whiteboard.entity.WhiteboardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WhiteboardRepository extends JpaRepository<WhiteboardEntity, UUID> {

    List<WhiteboardEntity> findByWorkspaceIdAndIsDeletedFalse(UUID workspaceId);

    Optional<WhiteboardEntity> findByIdAndIsDeletedFalse(UUID id);
}
