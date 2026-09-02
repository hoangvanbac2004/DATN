package com.taskflow.modules.automation.repository;

import com.taskflow.modules.automation.entity.AutomationLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AutomationLogRepository extends JpaRepository<AutomationLogEntity, UUID> {

    List<AutomationLogEntity> findTop20ByRuleIdOrderByCreatedAtDesc(UUID ruleId);
}
