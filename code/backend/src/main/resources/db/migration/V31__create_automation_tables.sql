-- TaskFlow Migration V31: Automation Engine & Workflow Rule Engine Schema
-- Target Domain: No-Code Automation Rules, Triggers, Actions, and Logs

CREATE TABLE automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    project_id UUID,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_type VARCHAR(50) NOT NULL,
    trigger_config_json TEXT,
    condition_config_json TEXT,
    action_type VARCHAR(50) NOT NULL,
    action_config_json TEXT NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    execution_count INT NOT NULL DEFAULT 0,
    last_executed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT fk_automation_rules_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    CONSTRAINT fk_automation_rules_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX idx_automation_rules_workspace_id ON automation_rules(workspace_id);
CREATE INDEX idx_automation_rules_project_id ON automation_rules(project_id);
CREATE INDEX idx_automation_rules_trigger_type ON automation_rules(trigger_type);

CREATE TABLE automation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'SUCCESS',
    message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_automation_logs_rule FOREIGN KEY (rule_id) REFERENCES automation_rules(id) ON DELETE CASCADE
);

CREATE INDEX idx_automation_logs_rule_id ON automation_logs(rule_id);
