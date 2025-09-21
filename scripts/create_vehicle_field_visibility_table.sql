-- Create the vehicle_field_visibility table that was missing
-- This is extracted from the larger migration script to run independently

CREATE TABLE IF NOT EXISTS vehicle_field_visibility (
    id SERIAL PRIMARY KEY,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    field_name TEXT NOT NULL,
    field_category TEXT NOT NULL, -- 'dvla' or 'checkcardetails'
    is_visible BOOLEAN DEFAULT false,
    display_name TEXT, -- Human-readable name for customer display
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(vehicle_id, field_name)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_vehicle_field_visibility_vehicle_id ON vehicle_field_visibility(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_field_visibility_category ON vehicle_field_visibility(field_category);

-- Insert default field visibility settings for existing vehicles
INSERT INTO vehicle_field_visibility (vehicle_id, field_name, field_category, is_visible, display_name)
SELECT 
    v.id,
    'make' as field_name,
    'basic' as field_category,
    true as is_visible,
    'Make' as display_name
FROM vehicles v
WHERE NOT EXISTS (
    SELECT 1 FROM vehicle_field_visibility vfv 
    WHERE vfv.vehicle_id = v.id AND vfv.field_name = 'make'
);

INSERT INTO vehicle_field_visibility (vehicle_id, field_name, field_category, is_visible, display_name)
SELECT 
    v.id,
    'model' as field_name,
    'basic' as field_category,
    true as is_visible,
    'Model' as display_name
FROM vehicles v
WHERE NOT EXISTS (
    SELECT 1 FROM vehicle_field_visibility vfv 
    WHERE vfv.vehicle_id = v.id AND vfv.field_name = 'model'
);

INSERT INTO vehicle_field_visibility (vehicle_id, field_name, field_category, is_visible, display_name)
SELECT 
    v.id,
    'year' as field_name,
    'basic' as field_category,
    true as is_visible,
    'Year' as display_name
FROM vehicles v
WHERE NOT EXISTS (
    SELECT 1 FROM vehicle_field_visibility vfv 
    WHERE vfv.vehicle_id = v.id AND vfv.field_name = 'year'
);
