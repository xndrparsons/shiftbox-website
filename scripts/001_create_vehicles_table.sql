-- Create vehicles table for inventory management
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make VARCHAR(50) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  mileage INTEGER,
  fuel_type VARCHAR(20) DEFAULT 'Petrol',
  transmission VARCHAR(20) DEFAULT 'Manual',
  body_type VARCHAR(30),
  color VARCHAR(30),
  engine_size VARCHAR(10),
  doors INTEGER DEFAULT 4,
  description TEXT,
  features TEXT[], -- Array of features
  images TEXT[], -- Array of image URLs
  status VARCHAR(20) DEFAULT 'available', -- available, sold, reserved
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_vehicles_make_model ON public.vehicles(make, model);
CREATE INDEX IF NOT EXISTS idx_vehicles_price ON public.vehicles(price);
CREATE INDEX IF NOT EXISTS idx_vehicles_year ON public.vehicles(year);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.vehicles(status);

-- Insert sample vehicles
INSERT INTO public.vehicles (make, model, year, price, mileage, fuel_type, transmission, body_type, color, engine_size, doors, description, features, images, status) VALUES
('BMW', '3 Series', 2020, 28500.00, 35000, 'Petrol', 'Automatic', 'Saloon', 'Silver', '2.0L', 4, 'Immaculate BMW 3 Series with full service history. One owner from new with all original documentation.', 
 ARRAY['Leather Seats', 'Navigation System', 'Bluetooth', 'Cruise Control', 'Parking Sensors', 'Climate Control'], 
 ARRAY['/bmw-3-series-silver.jpg'], 'available'),

('Audi', 'A4 Avant', 2019, 26750.00, 42000, 'Diesel', 'Automatic', 'Estate', 'Black', '2.0L', 5, 'Stunning Audi A4 Avant in pristine condition. Perfect family car with excellent fuel economy and premium features.',
 ARRAY['Quattro AWD', 'Virtual Cockpit', 'LED Headlights', 'Heated Seats', 'Apple CarPlay', 'Panoramic Roof'],
 ARRAY['/audi-a4-avant-black.jpg'], 'available'),

('Mercedes-Benz', 'C-Class', 2021, 32900.00, 28000, 'Hybrid', 'Automatic', 'Saloon', 'White', '2.0L', 4, 'Latest generation Mercedes C-Class with hybrid technology. Exceptional build quality and luxury appointments throughout.',
 ARRAY['MBUX Infotainment', 'Wireless Charging', 'Ambient Lighting', 'Memory Seats', 'Keyless Entry', 'Premium Sound'],
 ARRAY['/mercedes-c-class-white.jpg'], 'available');
