-- Add Vehicle Condition Assessment columns to vehicles table
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS exterior_paintwork_condition TEXT,
ADD COLUMN IF NOT EXISTS interior_condition TEXT,
ADD COLUMN IF NOT EXISTS engine_condition TEXT,
ADD COLUMN IF NOT EXISTS presence_of_rust BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS rust_locations TEXT[],
ADD COLUMN IF NOT EXISTS bodywork_damage TEXT,
ADD COLUMN IF NOT EXISTS mechanical_issues TEXT,
ADD COLUMN IF NOT EXISTS service_history_status TEXT,
ADD COLUMN IF NOT EXISTS previous_owners INTEGER,
ADD COLUMN IF NOT EXISTS overall_condition_rating INTEGER CHECK (overall_condition_rating >= 1 AND overall_condition_rating <= 5),
ADD COLUMN IF NOT EXISTS condition_notes TEXT;

-- Add comments to describe the columns
COMMENT ON COLUMN vehicles.exterior_paintwork_condition IS 'Condition of exterior paintwork: excellent, very good, good, fair, poor';
COMMENT ON COLUMN vehicles.interior_condition IS 'Condition of interior: excellent, very good, good, fair, poor';
COMMENT ON COLUMN vehicles.engine_condition IS 'Condition of engine: excellent, very good, good, fair, poor';
COMMENT ON COLUMN vehicles.presence_of_rust IS 'Whether rust is present on the vehicle';
COMMENT ON COLUMN vehicles.rust_locations IS 'Array of locations where rust is present';
COMMENT ON COLUMN vehicles.bodywork_damage IS 'Description of any bodywork damage';
COMMENT ON COLUMN vehicles.mechanical_issues IS 'Description of any mechanical issues';
COMMENT ON COLUMN vehicles.service_history_status IS 'Service history status: full service history, partial service history, no service history, unknown';
COMMENT ON COLUMN vehicles.previous_owners IS 'Number of previous owners';
COMMENT ON COLUMN vehicles.overall_condition_rating IS 'Overall condition rating from 1 (poor) to 5 (excellent)';
COMMENT ON COLUMN vehicles.condition_notes IS 'Additional notes about vehicle condition';
