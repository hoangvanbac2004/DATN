-- TaskFlow Migration V30: Advanced Search & Saved Filter Presets Schema
-- Target Domain: Global Full-Text Search, Saved Filters, and Query History

CREATE TABLE saved_search_filters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    workspace_id UUID,
    name VARCHAR(255) NOT NULL,
    query VARCHAR(255),
    filter_config_json TEXT NOT NULL,
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_saved_search_filters_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_saved_search_filters_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

CREATE INDEX idx_saved_search_filters_user_id ON saved_search_filters(user_id);
CREATE INDEX idx_saved_search_filters_workspace_id ON saved_search_filters(workspace_id);

CREATE TABLE search_histories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    query VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50) NOT NULL DEFAULT 'GLOBAL',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_search_histories_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_search_histories_user_id ON search_histories(user_id);
CREATE INDEX idx_search_histories_created_at ON search_histories(created_at DESC);

-- PostgreSQL Full-Text Search Indexes
CREATE INDEX IF NOT EXISTS idx_tasks_title_desc_fts ON tasks USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_projects_name_desc_fts ON projects USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
