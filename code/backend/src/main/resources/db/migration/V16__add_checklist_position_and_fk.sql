-- TaskFlow Migration V16: Checklist position, soft delete, and task foreign key constraint
-- Target Domain: Task Checklist Management

ALTER TABLE checklists ADD COLUMN IF NOT EXISTS position DOUBLE PRECISION NOT NULL DEFAULT 1000.0;
ALTER TABLE checklists ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE checklists ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_checklists_task'
    ) THEN
        ALTER TABLE checklists
            ADD CONSTRAINT fk_checklists_task
            FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_checklists_task_id ON checklists(task_id);
CREATE INDEX IF NOT EXISTS idx_checklists_position ON checklists(position);
