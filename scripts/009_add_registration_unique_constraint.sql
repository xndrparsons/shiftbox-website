-- Add unique constraint on registration column to support ON CONFLICT operations
-- This allows upsert operations when fetching CheckCarDetails data

-- First, remove any duplicate registrations (keep the most recent one)
DELETE FROM vehicles a USING vehicles b 
WHERE a.id < b.id 
AND a.registration = b.registration 
AND a.registration IS NOT NULL;

-- Add unique constraint on registration column
ALTER TABLE vehicles 
ADD CONSTRAINT vehicles_registration_unique 
UNIQUE (registration);

-- Add index for better performance on registration lookups
CREATE INDEX IF NOT EXISTS idx_vehicles_registration 
ON vehicles (registration) 
WHERE registration IS NOT NULL;
