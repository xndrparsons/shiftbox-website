-- Create admin users table for managing access to admin dashboard
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Insert your admin email (replace with your actual email)
INSERT INTO admin_users (email) VALUES ('admin@shiftbox.uk')
ON CONFLICT (email) DO NOTHING;

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users to read their own data
CREATE POLICY "Admin users can read own data" ON admin_users
  FOR SELECT USING (auth.email() = email);
