-- Add remaining missing CheckCarDetails columns to vehicles table
-- This script adds all columns that the mapCheckCarDetailsToDatabase function expects

-- Add tracking columns
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS ccd_tables_fetched TEXT[];
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS ccd_last_fetched TIMESTAMP WITH TIME ZONE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS ccd_fetch_cost NUMERIC(10,4);

-- Add vehicle registration columns
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS ccd_date_of_last_update DATE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS ccd_vehicle_class VARCHAR(100);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS ccd_vin VARCHAR(50);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS ccd_engine_number VARCHAR(50);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS ccd_make_model VARCHAR(200);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS ccd_date_first_registered DATE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS ccd_date_first_registered_uk DATE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS ccd_engine_capacity INTEGER;

-- Create indexes for commonly queried columns
CREATE INDEX IF NOT EXISTS idx_vehicles_ccd_last_fetched ON vehicles(ccd_last_fetched);
CREATE INDEX IF NOT EXISTS idx_vehicles_ccd_vin ON vehicles(ccd_vin);
CREATE INDEX IF NOT EXISTS idx_vehicles_ccd_tables_fetched ON vehicles USING GIN(ccd_tables_fetched);

-- Add comments for documentation
COMMENT ON COLUMN vehicles.ccd_tables_fetched IS 'Array of CheckCarDetails tables that were fetched for this vehicle';
COMMENT ON COLUMN vehicles.ccd_last_fetched IS 'Timestamp when CheckCarDetails data was last fetched';
COMMENT ON COLUMN vehicles.ccd_fetch_cost IS 'Total cost in GBP for the CheckCarDetails API calls';
COMMENT ON COLUMN vehicles.ccd_date_of_last_update IS 'Date of last update from DVLA records';
COMMENT ON COLUMN vehicles.ccd_vehicle_class IS 'DVLA vehicle class';
COMMENT ON COLUMN vehicles.ccd_vin IS 'Vehicle Identification Number';
COMMENT ON COLUMN vehicles.ccd_engine_number IS 'Engine number from DVLA records';
COMMENT ON COLUMN vehicles.ccd_make_model IS 'Combined make and model from DVLA';
COMMENT ON COLUMN vehicles.ccd_date_first_registered IS 'Date first registered anywhere';
COMMENT ON COLUMN vehicles.ccd_date_first_registered_uk IS 'Date first registered in UK';
COMMENT ON COLUMN vehicles.ccd_engine_capacity IS 'Engine capacity in CC';
