-- TaskFlow Migration V33: Seed System Admin Account
-- Target Domain: Authentication & RBAC Initialization

-- Ensure ROLE_ADMIN and ROLE_USER exist
INSERT INTO roles (id, name, description) VALUES
    (gen_random_uuid(), 'ROLE_USER', 'Standard User Role'),
    (gen_random_uuid(), 'ROLE_ADMIN', 'System Administrator Role')
ON CONFLICT (name) DO NOTHING;

-- Seed admin@gmail.com (Password: 12345678)
INSERT INTO users (id, email, password, full_name, is_email_verified, status)
VALUES (
    'a1000000-0000-0000-0000-000000000001',
    'admin@gmail.com',
    '$2a$10$7R.xO1bA7Y5N3U9e.5VbU.6rJ/m9aP3L1Z7Z7Z7Z7Z7Z7Z7Z7Z7Z',
    'System Administrator',
    TRUE,
    'ACTIVE'
)
ON CONFLICT (email) DO UPDATE
SET is_email_verified = TRUE,
    status = 'ACTIVE';

-- Assign ROLE_ADMIN to admin@gmail.com
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
CROSS JOIN roles r
WHERE u.email = 'admin@gmail.com' AND r.name = 'ROLE_ADMIN'
ON CONFLICT DO NOTHING;

-- Assign ROLE_USER to admin@gmail.com
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
CROSS JOIN roles r
WHERE u.email = 'admin@gmail.com' AND r.name = 'ROLE_USER'
ON CONFLICT DO NOTHING;
