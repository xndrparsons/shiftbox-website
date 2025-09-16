-- Script to add a new admin user
-- Replace 'new-admin@example.com' with the actual email address

INSERT INTO admin_users (email, is_active, created_at, updated_at) 
VALUES (
  'new-admin@example.com',  -- Replace with the new admin's email
  true,                     -- Set to true to activate the admin user
  NOW(),
  NOW()
);

-- Verify the insertion
SELECT * FROM admin_users WHERE email = 'new-admin@example.com';
