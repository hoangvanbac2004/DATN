-- TaskFlow Migration V29: Whiteboard Module & Spatial Element Storage Schema
-- Target Domain: Interactive Visual Canvas & Diagramming

CREATE TABLE whiteboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    project_id UUID,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    background_color VARCHAR(50) NOT NULL DEFAULT '#0f172a',
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT fk_whiteboards_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    CONSTRAINT fk_whiteboards_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX idx_whiteboards_workspace_id ON whiteboards(workspace_id);
CREATE INDEX idx_whiteboards_project_id ON whiteboards(project_id);

CREATE TABLE whiteboard_elements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    whiteboard_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    x DOUBLE PRECISION NOT NULL DEFAULT 0,
    y DOUBLE PRECISION NOT NULL DEFAULT 0,
    width DOUBLE PRECISION NOT NULL DEFAULT 160,
    height DOUBLE PRECISION NOT NULL DEFAULT 160,
    rotation DOUBLE PRECISION NOT NULL DEFAULT 0,
    content TEXT,
    style_json TEXT,
    start_element_id UUID,
    end_element_id UUID,
    z_index INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT fk_whiteboard_elements_board FOREIGN KEY (whiteboard_id) REFERENCES whiteboards(id) ON DELETE CASCADE,
    CONSTRAINT fk_whiteboard_elements_start FOREIGN KEY (start_element_id) REFERENCES whiteboard_elements(id) ON DELETE SET NULL,
    CONSTRAINT fk_whiteboard_elements_end FOREIGN KEY (end_element_id) REFERENCES whiteboard_elements(id) ON DELETE SET NULL
);

CREATE INDEX idx_whiteboard_elements_board_id ON whiteboard_elements(whiteboard_id);
