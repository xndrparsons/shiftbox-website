-- Restructuring vehicle table columns with proper DVLA and CCD prefixes
-- Drop existing DVLA columns that don't follow the new naming convention

-- Fixed SQL syntax by separating each column operation into individual ALTER TABLE statements
ALTER TABLE vehicles DROP COLUMN IF EXISTS dvla_registration_number;
ALTER TABLE vehicles DROP COLUMN IF EXISTS dvla_tax_status;
ALTER TABLE vehicles DROP COLUMN IF EXISTS dvla_tax_due_date;
ALTER TABLE vehicles DROP COLUMN IF EXISTS dvla_art_end_date;
ALTER TABLE vehicles DROP COLUMN IF EXISTS dvla_mot_status;
ALTER TABLE vehicles DROP COLUMN IF EXISTS dvla_mot_expiry_date;
ALTER TABLE vehicles DROP COLUMN IF EXISTS dvla_make;
ALTER TABLE vehicles DROP COLUMN IF EXISTS dvla_month_of_first_dvla_registration;
ALTER TABLE vehicles DROP COLUMN IF EXISTS dvla_month_of_first_registration;
ALTER TABLE vehicles DROP COLUMN IF EXISTS dvla_year_of_manufacture;
ALTER TABLE vehicles DROP COLUMN IF EXISTS dvla_engine_capacity;
ALTER TABLE vehicles DROP COLUMN IF EXISTS dvla_co2_emissions;
ALTER TABLE vehicles DROP COLUMN IF EXISTS dvla_fuel_type;
ALTER TABLE vehicles DROP COLUMN IF EXISTS dvla_marked_for_export;
ALTER TABLE vehicles DROP COLUMN IF EXISTS dvla_colour;
ALTER TABLE vehicles DROP COLUMN IF EXISTS dvla_type_approval;
ALTER TABLE vehicles DROP COLUMN IF EXISTS dvla_wheelplan;
ALTER TABLE vehicles DROP COLUMN IF EXISTS dvla_revenue_weight;
ALTER TABLE vehicles DROP COLUMN IF EXISTS dvla_real_driving_emissions;
ALTER TABLE vehicles DROP COLUMN IF EXISTS dvla_date_of_last_v5c_issued;
ALTER TABLE vehicles DROP COLUMN IF EXISTS dvla_euro_status;
ALTER TABLE vehicles DROP COLUMN IF EXISTS dvla_automated_vehicle;

-- Add new DVLA columns with proper naming convention based on DVLA API response
ALTER TABLE vehicles ADD COLUMN dvla_registrationNumber TEXT;
ALTER TABLE vehicles ADD COLUMN dvla_taxStatus TEXT;
ALTER TABLE vehicles ADD COLUMN dvla_taxDueDate TEXT;
ALTER TABLE vehicles ADD COLUMN dvla_motStatus TEXT;
ALTER TABLE vehicles ADD COLUMN dvla_make TEXT;
ALTER TABLE vehicles ADD COLUMN dvla_yearOfManufacture INTEGER;
ALTER TABLE vehicles ADD COLUMN dvla_engineCapacity INTEGER;
ALTER TABLE vehicles ADD COLUMN dvla_co2Emissions INTEGER;
ALTER TABLE vehicles ADD COLUMN dvla_fuelType TEXT;
ALTER TABLE vehicles ADD COLUMN dvla_markedForExport BOOLEAN;
ALTER TABLE vehicles ADD COLUMN dvla_colour TEXT;
ALTER TABLE vehicles ADD COLUMN dvla_typeApproval TEXT;
ALTER TABLE vehicles ADD COLUMN dvla_revenueWeight INTEGER;
ALTER TABLE vehicles ADD COLUMN dvla_dateOfLastV5CIssued TEXT;
ALTER TABLE vehicles ADD COLUMN dvla_motExpiryDate TEXT;
ALTER TABLE vehicles ADD COLUMN dvla_wheelplan TEXT;
ALTER TABLE vehicles ADD COLUMN dvla_monthOfFirstRegistration TEXT;
ALTER TABLE vehicles ADD COLUMN dvla_euroStatus TEXT;
ALTER TABLE vehicles ADD COLUMN dvla_automatedVehicle BOOLEAN;
ALTER TABLE vehicles ADD COLUMN dvla_realDrivingEmissions TEXT;

-- Add basic information fields for the formatted display
ALTER TABLE vehicles ADD COLUMN body_type_formatted TEXT;
ALTER TABLE vehicles ADD COLUMN first_registered_formatted TEXT;
ALTER TABLE vehicles ADD COLUMN gearbox_formatted TEXT;
ALTER TABLE vehicles ADD COLUMN emission_class TEXT;

COMMENT ON TABLE vehicles IS 'Vehicle data with DVLA and CheckCarDetails integration - restructured v3';
