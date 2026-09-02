-- TaskFlow Migration V24: Board and Column Schema
-- Target Domain: Kanban Board Management

CREATE TABLE boards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    project_id UUID NOT NULL,
    settings TEXT,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT uk_boards_project_id UNIQUE (project_id),
    CONSTRAINT fk_boards_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX idx_boards_project_id ON boards(project_id);

CREATE TABLE board_columns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(50) DEFAULT '#64748b',
    position DOUBLE PRECISION NOT NULL DEFAULT 1000.0,
    wip_limit INTEGER DEFAULT 0,
    is_collapsed BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT fk_board_columns_board FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);

CREATE INDEX idx_board_columns_board_id ON board_columns(board_id);
CREATE INDEX idx_board_columns_position ON board_columns(position);

-- Add nullable column_id to tasks for Kanban column association
ALTER TABLE tasks ADD COLUMN column_id UUID;
ALTER TABLE tasks ADD CONSTRAINT fk_tasks_column FOREIGN KEY (column_id) REFERENCES board_columns(id) ON DELETE SET NULL;
CREATE INDEX idx_tasks_column_id ON tasks(column_id);
