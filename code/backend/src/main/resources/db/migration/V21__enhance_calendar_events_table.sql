-- TaskFlow Migration V21: Calendar events table enhancements
-- Target Domain: Calendar Management & Task Scheduling

ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS color VARCHAR(50) NOT NULL DEFAULT '#4F46E5';
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS task_id UUID;
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS is_all_day BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_calendar_events_user'
    ) THEN
        ALTER TABLE calendar_events
            ADD CONSTRAINT fk_calendar_events_user
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_calendar_events_task'
    ) THEN
        ALTER TABLE calendar_events
            ADD CONSTRAINT fk_calendar_events_task
            FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_end_time ON calendar_events(end_time);
