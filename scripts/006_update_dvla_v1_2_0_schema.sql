-- Update DVLA fields to match v1.2.0 API specification exactly
-- Add CheckCarDetails API data tables

-- First, ensure the dvla_registration_number column exists (from script 005)
-- If it doesn't exist, create it
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dvla_registration_number VARCHAR(20);

-- Update existing DVLA fields to match v1.2.0 specification exactly
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS dvla_tax_status VARCHAR(50),
ADD COLUMN IF NOT EXISTS dvla_tax_due_date DATE,
ADD COLUMN IF NOT EXISTS dvla_art_end_date DATE,
ADD COLUMN IF NOT EXISTS dvla_mot_status VARCHAR(50),
ADD COLUMN IF NOT EXISTS dvla_mot_expiry_date DATE,
ADD COLUMN IF NOT EXISTS dvla_make VARCHAR(100),
ADD COLUMN IF NOT EXISTS dvla_month_of_first_dvla_registration VARCHAR(7), -- YYYY-MM format
ADD COLUMN IF NOT EXISTS dvla_month_of_first_registration VARCHAR(7), -- YYYY-MM format
ADD COLUMN IF NOT EXISTS dvla_year_of_manufacture INTEGER,
ADD COLUMN IF NOT EXISTS dvla_engine_capacity INTEGER,
ADD COLUMN IF NOT EXISTS dvla_co2_emissions INTEGER,
ADD COLUMN IF NOT EXISTS dvla_fuel_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS dvla_marked_for_export BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS dvla_colour VARCHAR(50),
ADD COLUMN IF NOT EXISTS dvla_type_approval VARCHAR(20),
ADD COLUMN IF NOT EXISTS dvla_wheelplan VARCHAR(100),
ADD COLUMN IF NOT EXISTS dvla_revenue_weight INTEGER,
ADD COLUMN IF NOT EXISTS dvla_real_driving_emissions VARCHAR(10),
ADD COLUMN IF NOT EXISTS dvla_date_of_last_v5c_issued DATE,
ADD COLUMN IF NOT EXISTS dvla_euro_status VARCHAR(20),
ADD COLUMN IF NOT EXISTS dvla_automated_vehicle BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS dvla_last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add CheckCarDetails API data storage for all available tables
-- VehicleRegistration table data
ALTER TABLE vehicles
ADD COLUMN IF NOT EXISTS ccd_date_of_last_update TIMESTAMP,
ADD COLUMN IF NOT EXISTS ccd_vehicle_class VARCHAR(50),
ADD COLUMN IF NOT EXISTS ccd_certificate_of_destruction_issued BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ccd_engine_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS ccd_transmission_code VARCHAR(10),
ADD COLUMN IF NOT EXISTS ccd_exported BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ccd_wheel_plan VARCHAR(100),
ADD COLUMN IF NOT EXISTS ccd_date_exported DATE,
ADD COLUMN IF NOT EXISTS ccd_scrapped BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ccd_transmission VARCHAR(50),
ADD COLUMN IF NOT EXISTS ccd_date_first_registered_uk DATE,
ADD COLUMN IF NOT EXISTS ccd_model VARCHAR(100),
ADD COLUMN IF NOT EXISTS ccd_gear_count INTEGER,
ADD COLUMN IF NOT EXISTS ccd_import_non_eu BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ccd_previous_vrm_gb VARCHAR(20),
ADD COLUMN IF NOT EXISTS ccd_gross_weight INTEGER,
ADD COLUMN IF NOT EXISTS ccd_door_plan_literal VARCHAR(50),
ADD COLUMN IF NOT EXISTS ccd_mvris_model_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS ccd_vin VARCHAR(50),
ADD COLUMN IF NOT EXISTS ccd_date_first_registered DATE,
ADD COLUMN IF NOT EXISTS ccd_date_scrapped DATE,
ADD COLUMN IF NOT EXISTS ccd_door_plan VARCHAR(10),
ADD COLUMN IF NOT EXISTS ccd_year_month_first_registered VARCHAR(7),
ADD COLUMN IF NOT EXISTS ccd_vin_last_5 VARCHAR(5),
ADD COLUMN IF NOT EXISTS ccd_vehicle_used_before_first_registration BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ccd_max_permissible_mass INTEGER,
ADD COLUMN IF NOT EXISTS ccd_make_model VARCHAR(150),
ADD COLUMN IF NOT EXISTS ccd_transmission_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS ccd_seating_capacity INTEGER,
ADD COLUMN IF NOT EXISTS ccd_imported BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ccd_mvris_make_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS ccd_previous_vrm_ni VARCHAR(20),
ADD COLUMN IF NOT EXISTS ccd_vin_confirmation_flag VARCHAR(10);

-- Dimensions data
ALTER TABLE vehicles
ADD COLUMN IF NOT EXISTS ccd_unladen_weight INTEGER,
ADD COLUMN IF NOT EXISTS ccd_rigid_artic VARCHAR(20),
ADD COLUMN IF NOT EXISTS ccd_body_shape VARCHAR(50),
ADD COLUMN IF NOT EXISTS ccd_payload_volume INTEGER,
ADD COLUMN IF NOT EXISTS ccd_payload_weight INTEGER,
ADD COLUMN IF NOT EXISTS ccd_height INTEGER,
ADD COLUMN IF NOT EXISTS ccd_number_of_doors INTEGER,
ADD COLUMN IF NOT EXISTS ccd_number_of_seats INTEGER,
ADD COLUMN IF NOT EXISTS ccd_kerb_weight INTEGER,
ADD COLUMN IF NOT EXISTS ccd_gross_train_weight INTEGER,
ADD COLUMN IF NOT EXISTS ccd_fuel_tank_capacity INTEGER,
ADD COLUMN IF NOT EXISTS ccd_load_length INTEGER,
ADD COLUMN IF NOT EXISTS ccd_wheel_base INTEGER,
ADD COLUMN IF NOT EXISTS ccd_car_length INTEGER,
ADD COLUMN IF NOT EXISTS ccd_width INTEGER,
ADD COLUMN IF NOT EXISTS ccd_number_of_axles INTEGER,
ADD COLUMN IF NOT EXISTS ccd_gross_vehicle_weight INTEGER,
ADD COLUMN IF NOT EXISTS ccd_gross_combined_weight INTEGER;

-- Engine data
ALTER TABLE vehicles
ADD COLUMN IF NOT EXISTS ccd_fuel_catalyst VARCHAR(10),
ADD COLUMN IF NOT EXISTS ccd_stroke INTEGER,
ADD COLUMN IF NOT EXISTS ccd_primary_fuel_flag VARCHAR(1),
ADD COLUMN IF NOT EXISTS ccd_valves_per_cylinder INTEGER,
ADD COLUMN IF NOT EXISTS ccd_aspiration VARCHAR(50),
ADD COLUMN IF NOT EXISTS ccd_fuel_system VARCHAR(100),
ADD COLUMN IF NOT EXISTS ccd_number_of_cylinders INTEGER,
ADD COLUMN IF NOT EXISTS ccd_cylinder_arrangement VARCHAR(10),
ADD COLUMN IF NOT EXISTS ccd_valve_gear VARCHAR(20),
ADD COLUMN IF NOT EXISTS ccd_engine_location VARCHAR(20),
ADD COLUMN IF NOT EXISTS ccd_engine_description TEXT,
ADD COLUMN IF NOT EXISTS ccd_bore INTEGER,
ADD COLUMN IF NOT EXISTS ccd_engine_make VARCHAR(50),
ADD COLUMN IF NOT EXISTS ccd_fuel_delivery VARCHAR(50);

-- Performance data
ALTER TABLE vehicles
ADD COLUMN IF NOT EXISTS ccd_torque_ft_lb DECIMAL(8,2),
ADD COLUMN IF NOT EXISTS ccd_torque_nm INTEGER,
ADD COLUMN IF NOT EXISTS ccd_torque_rpm INTEGER,
ADD COLUMN IF NOT EXISTS ccd_noise_level INTEGER,
ADD COLUMN IF NOT EXISTS ccd_power_bhp DECIMAL(8,2),
ADD COLUMN IF NOT EXISTS ccd_power_rpm INTEGER,
ADD COLUMN IF NOT EXISTS ccd_power_kw INTEGER,
ADD COLUMN IF NOT EXISTS ccd_max_speed_kph INTEGER,
ADD COLUMN IF NOT EXISTS ccd_max_speed_mph INTEGER,
ADD COLUMN IF NOT EXISTS ccd_particles INTEGER,
ADD COLUMN IF NOT EXISTS ccd_acceleration_mph DECIMAL(4,2),
ADD COLUMN IF NOT EXISTS ccd_acceleration_kph DECIMAL(4,2),
ADD COLUMN IF NOT EXISTS ccd_zero_to_60_mph DECIMAL(4,2),
ADD COLUMN IF NOT EXISTS ccd_zero_to_100_kph DECIMAL(4,2);

-- Consumption data
ALTER TABLE vehicles
ADD COLUMN IF NOT EXISTS ccd_extra_urban_lkm DECIMAL(4,2),
ADD COLUMN IF NOT EXISTS ccd_extra_urban_mpg DECIMAL(4,2),
ADD COLUMN IF NOT EXISTS ccd_urban_cold_lkm DECIMAL(4,2),
ADD COLUMN IF NOT EXISTS ccd_urban_cold_mpg DECIMAL(4,2),
ADD COLUMN IF NOT EXISTS ccd_combined_lkm DECIMAL(4,2),
ADD COLUMN IF NOT EXISTS ccd_combined_mpg DECIMAL(4,2);

-- VED Rate data
ALTER TABLE vehicles
ADD COLUMN IF NOT EXISTS ccd_ved_standard_six_month INTEGER,
ADD COLUMN IF NOT EXISTS ccd_ved_standard_twelve_month INTEGER,
ADD COLUMN IF NOT EXISTS ccd_ved_co2_emissions INTEGER,
ADD COLUMN IF NOT EXISTS ccd_ved_band VARCHAR(5),
ADD COLUMN IF NOT EXISTS ccd_ved_co2_band VARCHAR(5);

-- General data
ALTER TABLE vehicles
ADD COLUMN IF NOT EXISTS ccd_power_delivery VARCHAR(20),
ADD COLUMN IF NOT EXISTS ccd_type_approval_category VARCHAR(10),
ADD COLUMN IF NOT EXISTS ccd_series_description VARCHAR(50),
ADD COLUMN IF NOT EXISTS ccd_driver_position VARCHAR(1),
ADD COLUMN IF NOT EXISTS ccd_driving_axle VARCHAR(10),
ADD COLUMN IF NOT EXISTS ccd_euro_status_ccd VARCHAR(10),
ADD COLUMN IF NOT EXISTS ccd_is_limited_edition BOOLEAN DEFAULT FALSE;

-- Track which API data tables have been fetched and costs
ALTER TABLE vehicles
ADD COLUMN IF NOT EXISTS ccd_tables_fetched JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS ccd_last_fetched TIMESTAMP,
ADD COLUMN IF NOT EXISTS ccd_fetch_cost DECIMAL(10,2) DEFAULT 0.00;

-- Create indexes for performance - only if they don't already exist
CREATE INDEX IF NOT EXISTS idx_vehicles_dvla_registration ON vehicles(dvla_registration_number);
CREATE INDEX IF NOT EXISTS idx_vehicles_ccd_vin ON vehicles(ccd_vin);
CREATE INDEX IF NOT EXISTS idx_vehicles_ccd_tables_fetched ON vehicles USING GIN(ccd_tables_fetched);

-- Add documentation comments for new fields
COMMENT ON COLUMN vehicles.dvla_tax_status IS 'DVLA v1.2.0: Tax status (Not Taxed for on Road Use, SORN, Taxed, Untaxed)';
COMMENT ON COLUMN vehicles.dvla_mot_status IS 'DVLA v1.2.0: MOT status (No details held by DVLA, No results returned, Not valid, Valid)';
COMMENT ON COLUMN vehicles.ccd_tables_fetched IS 'JSON array of CheckCarDetails table names that have been fetched';
COMMENT ON COLUMN vehicles.ccd_fetch_cost IS 'Total cost in GBP for CheckCarDetails API calls for this vehicle';
