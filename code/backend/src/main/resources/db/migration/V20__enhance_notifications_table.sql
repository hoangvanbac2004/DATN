-- TaskFlow Migration V20: Notifications table enhancements
-- Target Domain: In-App Notification Management

ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type VARCHAR(50) NOT NULL DEFAULT 'SYSTEM';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS link VARCHAR(500);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS is_read BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Backfill is_read from existing read column if present
UPDATE notifications SET is_read = read WHERE is_read IS FALSE AND read IS TRUE;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_notifications_user'
    ) THEN
        ALTER TABLE notifications
            ADD CONSTRAINT fk_notifications_user
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
