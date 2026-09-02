package com.taskflow.modules.automation.repository;

import com.taskflow.modules.automation.entity.AutomationRuleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AutomationRuleRepository extends JpaRepository<AutomationRuleEntity, UUID> {

    List<AutomationRuleEntity> findByWorkspaceId(UUID workspaceId);

    List<AutomationRuleEntity> findByWorkspaceIdAndTriggerTypeAndIsEnabledTrue(UUID workspaceId, String triggerType);
}
