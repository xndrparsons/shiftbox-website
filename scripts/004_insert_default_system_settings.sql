-- Insert default system settings
INSERT INTO public.system_settings (key, value, description) VALUES
('pricing', '{"per_valuation": 2.99, "credit_packages": [{"credits": 5, "price": 12.99}, {"credits": 10, "price": 24.99}, {"credits": 25, "price": 59.99}]}', 'Pricing configuration for valuations and credit packages'),
('api_costs', '{"dvla_cost_per_call": 0.10, "ccd_cost_per_call": 0.25}', 'API costs per call for DVLA and CheckCarDetails'),
('free_credits', '{"new_user_credits": 3, "referral_credits": 2}', 'Free credits configuration'),
('valuation_settings', '{"confidence_threshold": 0.7, "max_age_years": 25, "min_value": 500}', 'Valuation algorithm settings'),
('email_settings', '{"welcome_email": true, "valuation_complete_email": true, "low_credits_warning": true}', 'Email notification settings'),
('maintenance_mode', '{"enabled": false, "message": "System is under maintenance. Please try again later."}', 'Maintenance mode configuration')
ON CONFLICT (key) DO NOTHING;
