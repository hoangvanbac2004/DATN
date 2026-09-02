-- TaskFlow Migration V23: Attachments table enhancements
-- Target Domain: File Attachment Management

ALTER TABLE attachments ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE attachments ADD COLUMN IF NOT EXISTS mime_type VARCHAR(100);
ALTER TABLE attachments ADD COLUMN IF NOT EXISTS file_extension VARCHAR(20);
ALTER TABLE attachments ADD COLUMN IF NOT EXISTS storage_provider VARCHAR(50) NOT NULL DEFAULT 'CLOUDINARY';
ALTER TABLE attachments ADD COLUMN IF NOT EXISTS public_id VARCHAR(255);
ALTER TABLE attachments ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE attachments ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Backfill user_id from created_by if null
UPDATE attachments SET user_id = created_by WHERE user_id IS NULL AND created_by IS NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_attachments_task'
    ) THEN
        ALTER TABLE attachments
            ADD CONSTRAINT fk_attachments_task
            FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_attachments_user'
    ) THEN
        ALTER TABLE attachments
            ADD CONSTRAINT fk_attachments_user
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_attachments_task_id ON attachments(task_id);
CREATE INDEX IF NOT EXISTS idx_attachments_user_id ON attachments(user_id);
CREATE INDEX IF NOT EXISTS idx_attachments_created_at ON attachments(created_at);
