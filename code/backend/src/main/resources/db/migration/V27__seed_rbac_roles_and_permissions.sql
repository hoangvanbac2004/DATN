-- TaskFlow Migration V27: Configurable Permissions & RBAC Seed Data
-- Target Domain: Role-Based Access Control

INSERT INTO permissions (id, name, description) VALUES
    (gen_random_uuid(), 'workspace:read', 'View workspace details and projects'),
    (gen_random_uuid(), 'workspace:write', 'Update workspace settings'),
    (gen_random_uuid(), 'workspace:delete', 'Delete workspace'),
    (gen_random_uuid(), 'project:read', 'View project details'),
    (gen_random_uuid(), 'project:create', 'Create new projects'),
    (gen_random_uuid(), 'project:delete', 'Delete projects'),
    (gen_random_uuid(), 'task:read', 'View task details'),
    (gen_random_uuid(), 'task:create', 'Create tasks'),
    (gen_random_uuid(), 'task:edit', 'Edit tasks'),
    (gen_random_uuid(), 'task:delete', 'Delete tasks'),
    (gen_random_uuid(), 'member:invite', 'Invite team members'),
    (gen_random_uuid(), 'member:manage', 'Manage member roles and remove members')
ON CONFLICT (name) DO NOTHING;

-- Grant all permissions to ROLE_ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'ROLE_ADMIN'
ON CONFLICT DO NOTHING;

-- Grant standard permissions to ROLE_USER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.name IN (
    'workspace:read',
    'project:read',
    'project:create',
    'task:read',
    'task:create',
    'task:edit'
)
WHERE r.name = 'ROLE_USER'
ON CONFLICT DO NOTHING;
