package com.taskflow.modules.ai.repository;

import com.taskflow.modules.ai.entity.AiPromptLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AiRepository extends JpaRepository<AiPromptLogEntity, UUID> {
}
