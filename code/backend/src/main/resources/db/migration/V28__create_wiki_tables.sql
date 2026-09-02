-- TaskFlow Migration V28: Wiki Module & Page Versioning Schema
-- Target Domain: Knowledge Base & Wiki Documentation Management

CREATE TABLE wiki_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    project_id UUID,
    parent_page_id UUID,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    content TEXT,
    icon VARCHAR(50) NOT NULL DEFAULT 'FileText',
    version INT NOT NULL DEFAULT 1,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT uk_wiki_pages_workspace_slug UNIQUE (workspace_id, slug),
    CONSTRAINT fk_wiki_pages_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    CONSTRAINT fk_wiki_pages_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_wiki_pages_parent FOREIGN KEY (parent_page_id) REFERENCES wiki_pages(id) ON DELETE CASCADE
);

CREATE INDEX idx_wiki_pages_workspace_id ON wiki_pages(workspace_id);
CREATE INDEX idx_wiki_pages_project_id ON wiki_pages(project_id);
CREATE INDEX idx_wiki_pages_parent_page_id ON wiki_pages(parent_page_id);
CREATE INDEX idx_wiki_pages_slug ON wiki_pages(slug);

CREATE TABLE wiki_page_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL,
    version INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    change_summary VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    CONSTRAINT uk_wiki_page_versions_version UNIQUE (page_id, version),
    CONSTRAINT fk_wiki_page_versions_page FOREIGN KEY (page_id) REFERENCES wiki_pages(id) ON DELETE CASCADE
);

CREATE INDEX idx_wiki_page_versions_page_id ON wiki_page_versions(page_id);
