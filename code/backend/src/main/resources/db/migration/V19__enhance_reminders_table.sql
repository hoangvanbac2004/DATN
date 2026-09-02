-- TaskFlow Migration V19: Reminders table enhancements
-- Target Domain: Scheduled Reminder Management

ALTER TABLE reminders ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE reminders ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'PENDING';
ALTER TABLE reminders ADD COLUMN IF NOT EXISTS type VARCHAR(50) NOT NULL DEFAULT 'SYSTEM';
ALTER TABLE reminders ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE reminders ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Backfill existing created_by to user_id if null
UPDATE reminders SET user_id = created_by WHERE user_id IS NULL AND created_by IS NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_reminders_task'
    ) THEN
        ALTER TABLE reminders
            ADD CONSTRAINT fk_reminders_task
            FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_reminders_user'
    ) THEN
        ALTER TABLE reminders
            ADD CONSTRAINT fk_reminders_user
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_reminders_task_id ON reminders(task_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_remind_at ON reminders(remind_at);
CREATE INDEX IF NOT EXISTS idx_reminders_status ON reminders(status);
