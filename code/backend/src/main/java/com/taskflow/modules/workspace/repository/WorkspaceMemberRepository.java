package com.taskflow.modules.workspace.repository;

import com.taskflow.modules.workspace.entity.WorkspaceMemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMemberEntity, UUID> {

    List<WorkspaceMemberEntity> findByWorkspaceId(UUID workspaceId);

    Optional<WorkspaceMemberEntity> findByWorkspaceIdAndUserId(UUID workspaceId, UUID userId);

    boolean existsByWorkspaceIdAndUserId(UUID workspaceId, UUID userId);

    long countByWorkspaceIdAndStatus(UUID workspaceId, String status);
}
