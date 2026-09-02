-- TaskFlow Migration V18: Comment mentions, soft delete, and foreign keys
-- Target Domain: Task Comment Management

ALTER TABLE comments ADD COLUMN IF NOT EXISTS mentioned_user_ids TEXT;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_comments_task'
    ) THEN
        ALTER TABLE comments
            ADD CONSTRAINT fk_comments_task
            FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_comments_user'
    ) THEN
        ALTER TABLE comments
            ADD CONSTRAINT fk_comments_user
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_comments_task_id ON comments(task_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
