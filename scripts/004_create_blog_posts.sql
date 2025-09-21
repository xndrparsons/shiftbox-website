-- Create blog posts table for content management
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id),
  status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  meta_title VARCHAR(200),
  meta_description TEXT,
  tags TEXT[] -- Array of tags
);

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);

-- Create pages table for dynamic page management
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  meta_title VARCHAR(200),
  meta_description TEXT
);

-- Create index for pages
CREATE INDEX IF NOT EXISTS idx_pages_status ON public.pages(status);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);

-- Insert sample blog posts
INSERT INTO public.blog_posts (title, slug, excerpt, content, status, published_at, meta_title, meta_description, tags) VALUES
('The Ultimate Guide to Car Maintenance in the Lake District', 'ultimate-guide-car-maintenance-lake-district', 
 'Essential tips for keeping your vehicle in top condition while navigating Cumbria''s challenging terrain.',
 'Living in the Lake District presents unique challenges for vehicle maintenance. From steep mountain passes to salt-laden coastal roads, your car faces conditions that demand extra attention and care.

## Understanding Lake District Driving Conditions

The varied terrain of Cumbria means your vehicle encounters everything from steep gradients to narrow country lanes. These conditions can accelerate wear on brakes, suspension, and tires.

### Key Maintenance Areas

**Brake System Care**
Regular brake inspections are crucial given the frequent hill starts and descents. We recommend checking brake pads every 6 months and brake fluid annually.

**Suspension and Steering**
Pothole-riddled country roads can damage suspension components. Look out for unusual noises or handling changes.

**Tire Maintenance**
The combination of wet conditions and varied road surfaces means tire tread depth is critical. Check monthly and replace when tread reaches 3mm.

## Seasonal Considerations

**Winter Preparation**
- Battery health checks
- Antifreeze levels
- Tire condition assessment
- Emergency kit preparation

**Summer Readiness**
- Cooling system inspection
- Air conditioning service
- Tire pressure adjustments

## Professional Services

At Shiftbox, we understand the unique demands of Lake District driving. Our comprehensive maintenance packages are designed specifically for local conditions, ensuring your vehicle remains reliable and safe year-round.

Contact us today to discuss your vehicle''s maintenance needs.',
 'published', NOW() - INTERVAL '7 days', 
 'Car Maintenance Guide for Lake District Drivers | Shiftbox',
 'Expert car maintenance tips for Lake District driving conditions. Professional automotive services in Kendal, Cumbria.',
 ARRAY['maintenance', 'lake district', 'car care', 'winter driving', 'automotive tips']),

('Why Choose Professional Car Detailing?', 'why-choose-professional-car-detailing',
 'Discover the benefits of professional car detailing and how it protects your investment.',
 'Your car is more than just transportation—it''s an investment that deserves proper care and protection. Professional car detailing goes far beyond a simple wash and vacuum, offering comprehensive care that preserves your vehicle''s value and appearance.

## The Science Behind Professional Detailing

Professional detailing involves specialized techniques and products that aren''t available to the average car owner. From pH-balanced shampoos to ceramic coatings, every product is chosen for its specific purpose and effectiveness.

### Paint Protection

**Paint Correction**
Professional detailing can remove swirl marks, light scratches, and oxidation that dulls your car''s finish. This process requires skill and specialized equipment to achieve showroom-quality results.

**Ceramic Coatings**
These advanced protective coatings create a semi-permanent barrier against environmental contaminants, UV rays, and minor scratches. A properly applied ceramic coating can last 2-5 years.

### Interior Care

**Deep Cleaning**
Professional-grade equipment can extract dirt and stains from upholstery and carpets that household cleaners can''t touch. Steam cleaning and specialized extraction methods restore interiors to like-new condition.

**Protection Treatments**
Leather conditioning, fabric protection, and UV treatments help prevent premature aging and wear of interior surfaces.

## Long-term Benefits

Regular professional detailing:
- Maintains resale value
- Prevents permanent damage
- Enhances driving experience
- Protects against environmental damage

## The Shiftbox Difference

Our detailing services use only premium products and proven techniques. We take pride in transforming vehicles and protecting your investment for years to come.

Book your professional detailing service today and experience the difference quality makes.',
 'published', NOW() - INTERVAL '14 days',
 'Professional Car Detailing Benefits | Shiftbox Kendal',
 'Discover why professional car detailing is worth the investment. Expert detailing services in Kendal, protecting your vehicle''s value.',
 ARRAY['detailing', 'car care', 'paint protection', 'ceramic coating', 'professional services']);
