-- Car Valuation Platform Database Schema
-- This script creates all the necessary tables for the car valuation system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'past_due', 'incomplete', 'trialing');
CREATE TYPE valuation_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    role user_role DEFAULT 'user',
    credits INTEGER DEFAULT 0,
    subscription_id TEXT,
    subscription_status subscription_status,
    subscription_current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Car valuations table
CREATE TABLE IF NOT EXISTS public.car_valuations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    registration TEXT NOT NULL,
    mileage INTEGER,
    condition_rating INTEGER CHECK (condition_rating >= 1 AND condition_rating <= 5),
    service_history_rating INTEGER CHECK (service_history_rating >= 1 AND service_history_rating <= 5),
    
    -- DVLA Data
    dvla_make TEXT,
    dvla_model TEXT,
    dvla_year INTEGER,
    dvla_fuel_type TEXT,
    dvla_engine_capacity INTEGER,
    dvla_co2_emissions INTEGER,
    dvla_tax_status TEXT,
    dvla_mot_status TEXT,
    dvla_mot_expiry DATE,
    dvla_last_v5c_issued DATE,
    dvla_colour TEXT,
    dvla_body_type TEXT,
    dvla_wheelplan TEXT,
    dvla_revenue_weight INTEGER,
    
    -- CheckCarDetails Data
    ccd_make_model TEXT,
    ccd_vin TEXT,
    ccd_engine_number TEXT,
    ccd_first_registered DATE,
    ccd_first_registered_uk DATE,
    ccd_last_update DATE,
    ccd_vehicle_class TEXT,
    ccd_mot_status TEXT,
    ccd_mot_expiry DATE,
    ccd_mot_test_result TEXT,
    ccd_mot_test_date DATE,
    ccd_mot_test_mileage INTEGER,
    ccd_current_mileage INTEGER,
    ccd_mileage_history JSONB,
    ccd_average_annual_mileage INTEGER,
    ccd_engine_power INTEGER,
    ccd_max_speed INTEGER,
    ccd_acceleration DECIMAL(4,2),
    ccd_fuel_consumption DECIMAL(5,2),
    ccd_dimensions JSONB,
    ccd_weight INTEGER,
    ccd_insurance_group TEXT,
    
    -- Valuation Results
    trade_value DECIMAL(10,2),
    retail_value DECIMAL(10,2),
    private_value DECIMAL(10,2),
    valuation_confidence DECIMAL(3,2), -- 0.00 to 1.00
    market_position TEXT, -- 'below_average', 'average', 'above_average'
    
    -- API Costs and Status
    dvla_api_cost DECIMAL(6,4) DEFAULT 0,
    ccd_api_cost DECIMAL(6,4) DEFAULT 0,
    total_api_cost DECIMAL(6,4) DEFAULT 0,
    status valuation_status DEFAULT 'pending',
    error_message TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    valuation_id UUID REFERENCES public.car_valuations(id) ON DELETE SET NULL,
    stripe_payment_intent_id TEXT UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'GBP',
    status payment_status DEFAULT 'pending',
    credits_purchased INTEGER DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User activity logs
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System settings
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API usage tracking
CREATE TABLE IF NOT EXISTS public.api_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    dvla_calls INTEGER DEFAULT 0,
    dvla_cost DECIMAL(10,4) DEFAULT 0,
    ccd_calls INTEGER DEFAULT 0,
    ccd_cost DECIMAL(10,4) DEFAULT 0,
    total_calls INTEGER DEFAULT 0,
    total_cost DECIMAL(10,4) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date)
);

-- Feedback and reviews
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    valuation_id UUID REFERENCES public.car_valuations(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_car_valuations_user_id ON public.car_valuations(user_id);
CREATE INDEX IF NOT EXISTS idx_car_valuations_registration ON public.car_valuations(registration);
CREATE INDEX IF NOT EXISTS idx_car_valuations_created_at ON public.car_valuations(created_at);
CREATE INDEX IF NOT EXISTS idx_car_valuations_status ON public.car_valuations(status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON public.payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON public.user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON public.user_activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_api_usage_date ON public.api_usage(date);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON public.feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_valuation_id ON public.feedback(valuation_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_car_valuations_updated_at BEFORE UPDATE ON public.car_valuations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_usage_updated_at BEFORE UPDATE ON public.api_usage FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
