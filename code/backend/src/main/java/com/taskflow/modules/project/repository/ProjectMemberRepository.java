package com.taskflow.modules.project.repository;

import com.taskflow.modules.project.entity.ProjectMemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMemberEntity, UUID> {

    List<ProjectMemberEntity> findByProjectId(UUID projectId);

    Optional<ProjectMemberEntity> findByProjectIdAndUserId(UUID projectId, UUID userId);

    boolean existsByProjectIdAndUserId(UUID projectId, UUID userId);
}
