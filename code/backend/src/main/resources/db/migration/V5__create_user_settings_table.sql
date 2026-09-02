-- TaskFlow Migration V5: User Settings Schema
-- Target Domain: User Management & Preferences

CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    theme VARCHAR(20) NOT NULL DEFAULT 'dark',
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    date_format VARCHAR(20) NOT NULL DEFAULT 'YYYY-MM-DD',
    email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    desktop_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    weekly_digest BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT fk_user_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
