package com.taskflow.modules.user.repository;

import com.taskflow.modules.user.entity.PermissionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PermissionRepository extends JpaRepository<PermissionEntity, UUID> {
    Optional<PermissionEntity> findByName(String name);
}
