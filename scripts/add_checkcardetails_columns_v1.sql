-- Add CheckCarDetails columns to vehicles table
-- Based on the JSON structure from CheckCarDetails API response

-- Vehicle Registration data
ALTER TABLE vehicles ADD COLUMN ccd_vehicleregistration_registrationNumber TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehicleregistration_make TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehicleregistration_model TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehicleregistration_colour TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehicleregistration_fuelType TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehicleregistration_engineCapacity INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehicleregistration_yearOfManufacture INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehicleregistration_vehicleAge TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehicleregistration_wheelplan TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehicleregistration_dateOfLastV5CIssued TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehicleregistration_typeApproval TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehicleregistration_co2Emissions INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehicleregistration_registrationPlace TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehicleregistration_tax_taxStatus TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehicleregistration_tax_taxDueDate TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehicleregistration_tax_days TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehicleregistration_mot_motStatus TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehicleregistration_mot_motDueDate TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehicleregistration_mot_days INTEGER;

-- MOT data
ALTER TABLE vehicles ADD COLUMN ccd_mot_registrationNumber TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_mot_make TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_mot_model TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_mot_mot_motStatus TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_mot_mot_motDueDate TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_mot_mot_days INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_mot_motHistorySummary_totalTests INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_mot_motHistorySummary_passedTests INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_mot_motHistorySummary_failedTests INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_mot_motHistory JSONB; -- Store full MOT history as JSON

-- Mileage data
ALTER TABLE vehicles ADD COLUMN ccd_mileage_registrationNumber TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_mileage_make TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_mileage_model TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_mileage_summary_lastRecordedMileage TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_mileage_summary_averageMileage INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_mileage_summary_averageMileageStatus TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_mileage_summary_mileageIssues TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_mileage_summary_mileageIssueDescription TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_mileage_mileage JSONB; -- Store mileage history as JSON

-- Vehicle Specs - Vehicle Identification
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_VehicleIdentification_Vrm TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_VehicleIdentification_Vin TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_VehicleIdentification_VinLast5 TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_VehicleIdentification_DvlaMake TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_VehicleIdentification_DvlaModel TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_VehicleIdentification_DvlaWheelPlan TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_VehicleIdentification_DateFirstRegisteredInUk TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_VehicleIdentification_DateFirstRegistered TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_VehicleIdentification_DateOfManufacture TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_VehicleIdentification_YearOfManufacture INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_VehicleIdentification_VehicleUsedBeforeFirstRegistration BOOLEAN;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_VehicleIdentification_EngineNumber TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_VehicleIdentification_PreviousVrmNi TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_VehicleIdentification_DvlaBodyType TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_VehicleIdentification_DvlaFuelType TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_VehicleIdentification_V5cCertificateCount INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_VehicleIdentification_V5cCertificateIssueDates JSONB;

-- Vehicle Specs - Vehicle Excise Duty Details
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_VehicleExciseDutyDetails_DvlaCo2 INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_VehicleExciseDutyDetails_DvlaCo2Band TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_VehicleExciseDutyDetails_DvlaBand TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_VehicleExciseDutyDetails_VedRate JSONB;

-- Vehicle Specs - DVLA Technical Details
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_DvlaTechnicalDetails_EngineCapacityCc INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_DvlaTechnicalDetails_PowerToWeightRatio INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_DvlaTechnicalDetails_SeatCountIncludingDriver INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_DvlaTechnicalDetails_GrossWeight INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_DvlaTechnicalDetails_MaximumNetPower INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_DvlaTechnicalDetails_MassInService INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_DvlaTechnicalDetails_MaxTowableMassBraked INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_DvlaTechnicalDetails_MaxTowableMassUnbraked INTEGER;

-- Vehicle Specs - Model Data
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_ModelData_Make TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_ModelData_Range TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_ModelData_Model TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_ModelData_ModelVariant TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_ModelData_Series TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_ModelData_Mark INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_ModelData_StartDate TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_ModelData_EndDate TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_ModelData_CountryOfOrigin TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_ModelData_EuroStatus TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_ModelData_FuelType TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_ModelData_CabType TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_ModelData_TypeApprovalCategory TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_ModelData_MarketSectorCode TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_ModelData_VehicleClass TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_ModelData_TaxationClass TEXT;

-- Vehicle Specs - Body Details
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_BodyDetails_BodyShape TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_BodyDetails_BodyStyle TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_BodyDetails_PlatformName TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_BodyDetails_NumberOfAxles INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_BodyDetails_NumberOfDoors INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_BodyDetails_NumberOfSeats INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_BodyDetails_PayloadVolumeSqM DECIMAL;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_BodyDetails_FuelTankCapacityLitres INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_BodyDetails_WheelBaseType TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_BodyDetails_PlatformShared TEXT;

-- Vehicle Specs - Dimensions
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_Dimensions_HeightMm INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_Dimensions_LengthMm INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_Dimensions_WidthMm INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_Dimensions_InternalLoadLengthMm INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_Dimensions_WheelBaseLengthMm INTEGER;

-- Vehicle Specs - Weights
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_Weights_KerbWeightKg INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_Weights_GrossTrainWeightKg INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_Weights_UnladenWeightKg INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_Weights_PayloadWeightKg INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_Weights_GrossVehicleWeightKg INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_Weights_GrossCombinedWeightKg INTEGER;

-- Vehicle Specs - Power Source
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_PowerSource_VehicleType TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_PowerSource_ElectricDetails JSONB;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_PowerSource_IceDetails JSONB;

-- Vehicle Specs - Euro NCAP
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_EuroNcap_NcapStarRating INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_EuroNcap_NcapChildPercent DECIMAL;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_EuroNcap_NcapAdultPercent DECIMAL;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_EuroNcap_NcapPedestrianPercent DECIMAL;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_EuroNcap_NcapSafteyAssistPercent DECIMAL;

-- Vehicle Specs - Emissions
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_Emissions_ManufacturerCo2 INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_Emissions_HasFuelCatalyst BOOLEAN;

-- Vehicle Specs - Performance
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_Performance JSONB; -- Store complex performance data as JSON

-- Vehicle Specs - Transmission
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_Transmission_TransmissionType TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_Transmission_NumberOfGears INTEGER;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_Transmission_DriveType TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_Transmission_DrivingAxle TEXT;

-- Vehicle Specs - SMMT Details (storing as JSON due to complexity)
ALTER TABLE vehicles ADD COLUMN ccd_vehiclespecs_SmmtDetails JSONB;

-- Vehicle Valuation
ALTER TABLE vehicles ADD COLUMN ccd_vehiclevaluation_Vrm TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclevaluation_Mileage TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclevaluation_ValuationList JSONB;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclevaluation_ValuationTime TEXT;
ALTER TABLE vehicles ADD COLUMN ccd_vehiclevaluation_VehicleDescription TEXT;

-- UK Vehicle Data (storing as JSON due to complexity)
ALTER TABLE vehicles ADD COLUMN ccd_ukvehicledata JSONB;

-- Vehicle Image
ALTER TABLE vehicles ADD COLUMN ccd_vehicleimage_VehicleImages JSONB;

-- Add field visibility toggles table for customer-facing display
CREATE TABLE IF NOT EXISTS vehicle_field_visibility (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
    field_name TEXT NOT NULL,
    field_category TEXT NOT NULL, -- 'dvla' or 'checkcardetails'
    is_visible BOOLEAN DEFAULT false,
    display_name TEXT, -- Human-readable name for customer display
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(vehicle_id, field_name)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_vehicle_field_visibility_vehicle_id ON vehicle_field_visibility(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_field_visibility_category ON vehicle_field_visibility(field_category);
