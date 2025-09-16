-- Add missing CheckCarDetails columns that the mapping function expects
-- This fixes the column mismatch error when saving CheckCarDetails data

-- MOT data columns (from mot table)
ALTER TABLE vehicles
ADD COLUMN IF NOT EXISTS ccd_mot_status VARCHAR(50),
ADD COLUMN IF NOT EXISTS ccd_mot_expiry_date DATE,
ADD COLUMN IF NOT EXISTS ccd_mot_test_result VARCHAR(50),
ADD COLUMN IF NOT EXISTS ccd_mot_test_date DATE,
ADD COLUMN IF NOT EXISTS ccd_mot_test_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS ccd_mot_test_mileage INTEGER;

-- Mileage data columns (from mileage table)
ALTER TABLE vehicles
ADD COLUMN IF NOT EXISTS ccd_current_mileage INTEGER,
ADD COLUMN IF NOT EXISTS ccd_mileage_history JSONB,
ADD COLUMN IF NOT EXISTS ccd_average_annual_mileage INTEGER;

-- Vehicle specs data columns (from vehiclespecs table)
ALTER TABLE vehicles
ADD COLUMN IF NOT EXISTS ccd_engine_power INTEGER,
ADD COLUMN IF NOT EXISTS ccd_max_speed INTEGER,
ADD COLUMN IF NOT EXISTS ccd_acceleration DECIMAL(4,2),
ADD COLUMN IF NOT EXISTS ccd_fuel_consumption DECIMAL(4,2),
ADD COLUMN IF NOT EXISTS ccd_dimensions JSONB,
ADD COLUMN IF NOT EXISTS ccd_weight INTEGER;

-- Vehicle valuation data columns (from vehiclevaluation table)
ALTER TABLE vehicles
ADD COLUMN IF NOT EXISTS ccd_trade_value DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS ccd_retail_value DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS ccd_private_value DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS ccd_valuation_date DATE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_vehicles_ccd_mot_status ON vehicles(ccd_mot_status);
CREATE INDEX IF NOT EXISTS idx_vehicles_ccd_current_mileage ON vehicles(ccd_current_mileage);
CREATE INDEX IF NOT EXISTS idx_vehicles_ccd_valuation_date ON vehicles(ccd_valuation_date);

-- Add comments for documentation
COMMENT ON COLUMN vehicles.ccd_mot_status IS 'CheckCarDetails MOT status from mot table';
COMMENT ON COLUMN vehicles.ccd_current_mileage IS 'CheckCarDetails current mileage from mileage table';
COMMENT ON COLUMN vehicles.ccd_dimensions IS 'CheckCarDetails vehicle dimensions JSON from vehiclespecs table';
COMMENT ON COLUMN vehicles.ccd_trade_value IS 'CheckCarDetails trade valuation from vehiclevaluation table';
COMMENT ON COLUMN vehicles.ccd_retail_value IS 'CheckCarDetails retail valuation from vehiclevaluation table';
COMMENT ON COLUMN vehicles.ccd_private_value IS 'CheckCarDetails private valuation from vehiclevaluation table';
