-- Add detailed vehicle specifications columns
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS registration VARCHAR(20);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS bhp INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS torque INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS acceleration_0_60 DECIMAL(3,1);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS top_speed INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS length_mm INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS width_mm INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS height_mm INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS wheelbase_mm INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS boot_capacity INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS seats INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS doors INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS kerb_weight INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS co2_emissions INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS mpg_combined DECIMAL(4,1);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS mpg_urban DECIMAL(4,1);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS mpg_extra_urban DECIMAL(4,1);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS insurance_group VARCHAR(10);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS drivetrain VARCHAR(20);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS gearbox VARCHAR(20);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS fuel_capacity INTEGER;

-- Add index on registration for quick lookups
CREATE INDEX IF NOT EXISTS idx_vehicles_registration ON vehicles(registration);

-- Update existing vehicles with some sample detailed data
UPDATE vehicles SET 
  registration = 'BM21ABC',
  bhp = 184,
  torque = 300,
  acceleration_0_60 = 7.1,
  top_speed = 146,
  length_mm = 4709,
  width_mm = 1827,
  height_mm = 1442,
  wheelbase_mm = 2851,
  boot_capacity = 480,
  seats = 5,
  doors = 4,
  kerb_weight = 1570,
  co2_emissions = 142,
  mpg_combined = 45.6,
  mpg_urban = 37.2,
  mpg_extra_urban = 56.5,
  insurance_group = '25E',
  drivetrain = 'RWD',
  gearbox = '8-speed automatic',
  fuel_capacity = 59
WHERE make = 'BMW' AND model = '3 Series';

UPDATE vehicles SET 
  registration = 'AU21XYZ',
  bhp = 150,
  torque = 320,
  acceleration_0_60 = 8.6,
  top_speed = 137,
  length_mm = 4762,
  width_mm = 1847,
  height_mm = 1535,
  wheelbase_mm = 2820,
  boot_capacity = 495,
  seats = 5,
  doors = 5,
  kerb_weight = 1630,
  co2_emissions = 118,
  mpg_combined = 62.8,
  mpg_urban = 55.4,
  mpg_extra_urban = 72.4,
  insurance_group = '22E',
  drivetrain = 'FWD',
  gearbox = '7-speed S tronic',
  fuel_capacity = 54
WHERE make = 'Audi' AND model = 'A4 Avant';

UPDATE vehicles SET 
  registration = 'MB21DEF',
  bhp = 156,
  torque = 250,
  acceleration_0_60 = 8.2,
  top_speed = 143,
  length_mm = 4686,
  width_mm = 1810,
  height_mm = 1442,
  wheelbase_mm = 2840,
  boot_capacity = 455,
  seats = 5,
  doors = 4,
  kerb_weight = 1555,
  co2_emissions = 138,
  mpg_combined = 46.3,
  mpg_urban = 38.7,
  mpg_extra_urban = 56.5,
  insurance_group = '24E',
  drivetrain = 'RWD',
  gearbox = '9G-TRONIC automatic',
  fuel_capacity = 66
WHERE make = 'Mercedes-Benz' AND model = 'C-Class';
