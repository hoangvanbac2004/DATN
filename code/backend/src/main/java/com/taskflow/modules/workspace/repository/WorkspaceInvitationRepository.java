package com.taskflow.modules.workspace.repository;

import com.taskflow.modules.workspace.entity.WorkspaceInvitationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkspaceInvitationRepository extends JpaRepository<WorkspaceInvitationEntity, UUID> {

    List<WorkspaceInvitationEntity> findByWorkspaceIdAndStatus(UUID workspaceId, String status);

    Optional<WorkspaceInvitationEntity> findByToken(String token);

    Optional<WorkspaceInvitationEntity> findByWorkspaceIdAndEmailAndStatus(UUID workspaceId, String email, String status);
}
