-- Restructuring vehicle table columns with proper DVLA and CCD prefixes
-- Drop existing DVLA columns that don't follow the new naming convention
ALTER TABLE vehicles 
DROP COLUMN IF EXISTS dvla_registration_number,
DROP COLUMN IF EXISTS dvla_tax_status,
DROP COLUMN IF EXISTS dvla_tax_due_date,
DROP COLUMN IF EXISTS dvla_art_end_date,
DROP COLUMN IF EXISTS dvla_mot_status,
DROP COLUMN IF EXISTS dvla_mot_expiry_date,
DROP COLUMN IF EXISTS dvla_make,
DROP COLUMN IF EXISTS dvla_month_of_first_dvla_registration,
DROP COLUMN IF EXISTS dvla_month_of_first_registration,
DROP COLUMN IF EXISTS dvla_year_of_manufacture,
DROP COLUMN IF EXISTS dvla_engine_capacity,
DROP COLUMN IF EXISTS dvla_co2_emissions,
DROP COLUMN IF EXISTS dvla_fuel_type,
DROP COLUMN IF EXISTS dvla_marked_for_export,
DROP COLUMN IF EXISTS dvla_colour,
DROP COLUMN IF EXISTS dvla_type_approval,
DROP COLUMN IF EXISTS dvla_wheelplan,
DROP COLUMN IF EXISTS dvla_revenue_weight,
DROP COLUMN IF EXISTS dvla_real_driving_emissions,
DROP COLUMN IF EXISTS dvla_date_of_last_v5c_issued,
DROP COLUMN IF EXISTS dvla_euro_status,
DROP COLUMN IF EXISTS dvla_automated_vehicle;

-- Add new DVLA columns with proper naming convention based on DVLA API response
ALTER TABLE vehicles 
ADD COLUMN dvla_registrationNumber TEXT,
ADD COLUMN dvla_taxStatus TEXT,
ADD COLUMN dvla_taxDueDate TEXT,
ADD COLUMN dvla_motStatus TEXT,
ADD COLUMN dvla_make TEXT,
ADD COLUMN dvla_yearOfManufacture INTEGER,
ADD COLUMN dvla_engineCapacity INTEGER,
ADD COLUMN dvla_co2Emissions INTEGER,
ADD COLUMN dvla_fuelType TEXT,
ADD COLUMN dvla_markedForExport BOOLEAN,
ADD COLUMN dvla_colour TEXT,
ADD COLUMN dvla_typeApproval TEXT,
ADD COLUMN dvla_revenueWeight INTEGER,
ADD COLUMN dvla_dateOfLastV5CIssued TEXT,
ADD COLUMN dvla_motExpiryDate TEXT,
ADD COLUMN dvla_wheelplan TEXT,
ADD COLUMN dvla_monthOfFirstRegistration TEXT,
ADD COLUMN dvla_euroStatus TEXT,
ADD COLUMN dvla_automatedVehicle BOOLEAN,
ADD COLUMN dvla_realDrivingEmissions TEXT;

-- Clean up existing CCD columns and rename them with proper ccd_ prefix
-- Keep the existing ccd_ columns that are already properly named
-- Add any missing CCD columns that might be needed

-- Add basic information fields for the formatted display
ADD COLUMN body_type_formatted TEXT,
ADD COLUMN first_registered_formatted TEXT,
ADD COLUMN gearbox_formatted TEXT,
ADD COLUMN emission_class TEXT;

COMMENT ON TABLE vehicles IS 'Vehicle data with DVLA and CheckCarDetails integration - restructured v2';
