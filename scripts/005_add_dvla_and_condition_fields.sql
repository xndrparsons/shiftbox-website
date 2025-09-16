-- Add DVLA API fields to vehicles table
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dvla_registration_number VARCHAR(20);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dvla_tax_status VARCHAR(50);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dvla_tax_due_date DATE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dvla_art_end_date DATE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dvla_mot_status VARCHAR(100);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dvla_mot_expiry_date DATE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dvla_make VARCHAR(50);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dvla_month_first_dvla_registration VARCHAR(10);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dvla_month_first_registration VARCHAR(10);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dvla_year_manufacture INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dvla_engine_capacity INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dvla_co2_emissions INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dvla_fuel_type VARCHAR(30);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dvla_marked_for_export BOOLEAN;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dvla_colour VARCHAR(30);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dvla_type_approval VARCHAR(20);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dvla_wheelplan VARCHAR(50);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dvla_revenue_weight INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dvla_real_driving_emissions VARCHAR(10);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dvla_date_last_v5c_issued DATE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dvla_euro_status VARCHAR(20);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dvla_automated_vehicle BOOLEAN;

-- Add manual condition assessment fields
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS exterior_paintwork_condition VARCHAR(50);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS interior_condition VARCHAR(50);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS engine_condition VARCHAR(50);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS presence_of_rust BOOLEAN DEFAULT false;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS rust_locations TEXT[]; -- Array of rust location descriptions
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS bodywork_damage TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS mechanical_issues TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS service_history_status VARCHAR(50);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS previous_owners INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS accident_history BOOLEAN DEFAULT false;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS accident_details TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS overall_condition_rating INTEGER CHECK (overall_condition_rating >= 1 AND overall_condition_rating <= 5);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS condition_notes TEXT;

-- Create indexes for new fields
CREATE INDEX IF NOT EXISTS idx_vehicles_dvla_registration ON vehicles(dvla_registration_number);
CREATE INDEX IF NOT EXISTS idx_vehicles_dvla_mot_expiry ON vehicles(dvla_mot_expiry_date);
CREATE INDEX IF NOT EXISTS idx_vehicles_condition_rating ON vehicles(overall_condition_rating);
CREATE INDEX IF NOT EXISTS idx_vehicles_presence_rust ON vehicles(presence_of_rust);

-- Enhanced mechanical health report table with comprehensive MOT-critical inspection fields
CREATE TABLE IF NOT EXISTS public.vehicle_mechanical_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  report_date DATE NOT NULL DEFAULT CURRENT_DATE,
  inspector_name VARCHAR(100),
  odometer_reading INTEGER,
  
  -- Road safety & MOT-critical: Brakes
  brake_efficiency_test VARCHAR(20) DEFAULT 'not_tested', -- ok, attention, requires_attention, not_applicable, not_tested
  brake_efficiency_notes TEXT,
  handbrake_parking_brake_hold VARCHAR(20) DEFAULT 'not_tested',
  handbrake_notes TEXT,
  brake_fluid_level VARCHAR(20) DEFAULT 'not_tested',
  brake_fluid_condition VARCHAR(20) DEFAULT 'not_tested',
  brake_fluid_notes TEXT,
  abs_warning_light_operation VARCHAR(20) DEFAULT 'not_tested',
  abs_notes TEXT,
  
  -- Road safety & MOT-critical: Steering & Suspension
  steering_operation VARCHAR(20) DEFAULT 'not_tested',
  steering_free_play VARCHAR(20) DEFAULT 'not_tested',
  steering_notes TEXT,
  power_steering_fluid_level VARCHAR(20) DEFAULT 'not_tested',
  power_steering_notes TEXT,
  suspension_condition VARCHAR(20) DEFAULT 'not_tested',
  suspension_leaks VARCHAR(20) DEFAULT 'not_tested',
  suspension_knocks VARCHAR(20) DEFAULT 'not_tested',
  suspension_ride_height VARCHAR(20) DEFAULT 'not_tested',
  suspension_notes TEXT,
  front_wheel_bearings VARCHAR(20) DEFAULT 'not_tested',
  wheel_bearing_noise VARCHAR(20) DEFAULT 'not_tested',
  wheel_bearing_play VARCHAR(20) DEFAULT 'not_tested',
  wheel_bearing_notes TEXT,
  
  -- Road safety & MOT-critical: Tyres & Wheels
  tyre_tread_nsf_outer DECIMAL(3,1), -- mm measurement
  tyre_tread_nsf_center DECIMAL(3,1),
  tyre_tread_nsf_inner DECIMAL(3,1),
  tyre_tread_nsr_outer DECIMAL(3,1),
  tyre_tread_nsr_center DECIMAL(3,1),
  tyre_tread_nsr_inner DECIMAL(3,1),
  tyre_tread_osf_outer DECIMAL(3,1),
  tyre_tread_osf_center DECIMAL(3,1),
  tyre_tread_osf_inner DECIMAL(3,1),
  tyre_tread_osr_outer DECIMAL(3,1),
  tyre_tread_osr_center DECIMAL(3,1),
  tyre_tread_osr_inner DECIMAL(3,1),
  tyre_condition_nsf VARCHAR(20) DEFAULT 'not_tested', -- bulges, cuts, uneven wear
  tyre_condition_nsr VARCHAR(20) DEFAULT 'not_tested',
  tyre_condition_osf VARCHAR(20) DEFAULT 'not_tested',
  tyre_condition_osr VARCHAR(20) DEFAULT 'not_tested',
  tyre_condition_notes TEXT,
  wheel_nuts_bolts_secure VARCHAR(20) DEFAULT 'not_tested',
  wheel_security_notes TEXT,
  
  -- Road safety & MOT-critical: Lights & Electrical
  headlights_operation VARCHAR(20) DEFAULT 'not_tested',
  headlights_notes TEXT,
  sidelights_operation VARCHAR(20) DEFAULT 'not_tested',
  sidelights_notes TEXT,
  brake_lights_operation VARCHAR(20) DEFAULT 'not_tested',
  brake_lights_notes TEXT,
  fog_lights_operation VARCHAR(20) DEFAULT 'not_tested',
  fog_lights_notes TEXT,
  indicators_operation VARCHAR(20) DEFAULT 'not_tested',
  indicators_notes TEXT,
  horn_operation VARCHAR(20) DEFAULT 'not_tested',
  horn_notes TEXT,
  wipers_operation VARCHAR(20) DEFAULT 'not_tested',
  washers_operation VARCHAR(20) DEFAULT 'not_tested',
  wipers_washers_notes TEXT,
  dashboard_warning_lights VARCHAR(20) DEFAULT 'not_tested',
  engine_management_light VARCHAR(20) DEFAULT 'not_tested',
  abs_warning_light VARCHAR(20) DEFAULT 'not_tested',
  airbag_warning_light VARCHAR(20) DEFAULT 'not_tested',
  oil_warning_light VARCHAR(20) DEFAULT 'not_tested',
  dashboard_lights_notes TEXT,
  
  -- Road safety & MOT-critical: Body & Structure
  windscreen_condition VARCHAR(20) DEFAULT 'not_tested',
  windscreen_chips_cracks VARCHAR(20) DEFAULT 'not_tested',
  windscreen_notes TEXT,
  seatbelts_condition VARCHAR(20) DEFAULT 'not_tested',
  seatbelts_operation VARCHAR(20) DEFAULT 'not_tested',
  seatbelts_notes TEXT,
  doors_operation VARCHAR(20) DEFAULT 'not_tested',
  bonnet_operation VARCHAR(20) DEFAULT 'not_tested',
  tailgate_operation VARCHAR(20) DEFAULT 'not_tested',
  doors_security_notes TEXT,
  mirrors_condition VARCHAR(20) DEFAULT 'not_tested',
  mirrors_adjustment VARCHAR(20) DEFAULT 'not_tested',
  mirrors_notes TEXT,
  exhaust_secure VARCHAR(20) DEFAULT 'not_tested',
  exhaust_leaks VARCHAR(20) DEFAULT 'not_tested',
  exhaust_notes TEXT,
  
  -- Additional engine bay checks
  battery_health VARCHAR(20) DEFAULT 'not_tested',
  coolant_system VARCHAR(20) DEFAULT 'not_tested',
  engine_oil_level VARCHAR(20) DEFAULT 'not_tested',
  oil_coolant_contamination VARCHAR(20) DEFAULT 'not_tested',
  engine_bay_notes TEXT,
  
  -- Engine running checks
  engine_starts VARCHAR(20) DEFAULT 'not_tested',
  engine_running VARCHAR(20) DEFAULT 'not_tested',
  engine_smoking VARCHAR(20) DEFAULT 'not_tested',
  aux_belt_noise VARCHAR(20) DEFAULT 'not_tested',
  engine_running_notes TEXT,
  
  -- Overall assessment
  overall_grade VARCHAR(20), -- excellent, good, fair, poor
  mot_advisory_items TEXT,
  additional_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for mechanical reports
CREATE INDEX IF NOT EXISTS idx_mechanical_reports_vehicle_id ON vehicle_mechanical_reports(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_mechanical_reports_date ON vehicle_mechanical_reports(report_date);

-- Add sample condition data to existing vehicles
UPDATE vehicles SET 
  exterior_paintwork_condition = 'excellent',
  interior_condition = 'very good',
  engine_condition = 'excellent',
  presence_of_rust = false,
  service_history_status = 'full service history',
  previous_owners = 1,
  accident_history = false,
  overall_condition_rating = 5,
  condition_notes = 'Exceptional example with comprehensive service history'
WHERE make = 'BMW' AND model = '3 Series';

UPDATE vehicles SET 
  exterior_paintwork_condition = 'good',
  interior_condition = 'good',
  engine_condition = 'very good',
  presence_of_rust = false,
  service_history_status = 'full service history',
  previous_owners = 2,
  accident_history = false,
  overall_condition_rating = 4,
  condition_notes = 'Well maintained family car with minor wear consistent with age'
WHERE make = 'Audi' AND model = 'A4 Avant';

UPDATE vehicles SET 
  exterior_paintwork_condition = 'excellent',
  interior_condition = 'excellent',
  engine_condition = 'excellent',
  presence_of_rust = false,
  service_history_status = 'full service history',
  previous_owners = 1,
  accident_history = false,
  overall_condition_rating = 5,
  condition_notes = 'As new condition with latest technology and warranty remaining'
WHERE make = 'Mercedes-Benz' AND model = 'C-Class';
