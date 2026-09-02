-- TaskFlow Migration V22: Activity log table enhancements
-- Target Domain: Activity Logging & Audit Trail

ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS details TEXT;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS workspace_id UUID;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS project_id UUID;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_activity_logs_user'
    ) THEN
        ALTER TABLE activity_logs
            ADD CONSTRAINT fk_activity_logs_user
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_type ON activity_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_id ON activity_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_workspace_id ON activity_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_project_id ON activity_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
