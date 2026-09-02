-- TaskFlow Migration V25: Timeline and Task Dependencies Schema
-- Target Domain: Task Management & Timeline Architecture

-- Add start_date column to tasks
ALTER TABLE tasks ADD COLUMN start_date TIMESTAMPTZ;
CREATE INDEX idx_tasks_start_date ON tasks(start_date);

-- Create task_dependencies table for Gantt chart architecture
CREATE TABLE task_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    predecessor_id UUID NOT NULL,
    successor_id UUID NOT NULL,
    dependency_type VARCHAR(50) NOT NULL DEFAULT 'FINISH_TO_START',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT uk_task_dependencies_pair UNIQUE (predecessor_id, successor_id),
    CONSTRAINT fk_task_dependencies_predecessor FOREIGN KEY (predecessor_id) REFERENCES tasks(id) ON DELETE CASCADE,
    CONSTRAINT fk_task_dependencies_successor FOREIGN KEY (successor_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE INDEX idx_task_dependencies_predecessor ON task_dependencies(predecessor_id);
CREATE INDEX idx_task_dependencies_successor ON task_dependencies(successor_id);
