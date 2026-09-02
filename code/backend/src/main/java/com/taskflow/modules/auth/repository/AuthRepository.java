package com.taskflow.modules.auth.repository;

import com.taskflow.modules.auth.entity.AuthTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AuthRepository extends JpaRepository<AuthTokenEntity, UUID> {
}
