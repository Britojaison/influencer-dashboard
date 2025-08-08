# Database Setup Guide

## Step 1: Create Tables
Run the following SQL in your Supabase SQL Editor:

```sql
-- Create brands table
CREATE TABLE brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  description TEXT,
  website_url TEXT,
  industry VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaigns table
CREATE TABLE campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  summary TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'paused')),
  budget DECIMAL(12,2),
  target_audience TEXT,
  goals TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaign_analytics table for tracking campaign performance
CREATE TABLE campaign_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  total_reach INTEGER DEFAULT 0,
  total_engagement INTEGER DEFAULT 0,
  total_impressions INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  roi DECIMAL(8,2) DEFAULT 0,
  tracked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_campaigns_brand_id ON campaigns(brand_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);
CREATE INDEX idx_campaign_analytics_campaign_id ON campaign_analytics(campaign_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_analytics_updated_at BEFORE UPDATE ON campaign_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Step 2: Insert Sample Data
Run this SQL to add sample data:

```sql
-- Insert sample brands
INSERT INTO brands (name, description, industry) VALUES
  ('Fashion Brand A', 'Premium fashion brand specializing in sustainable clothing', 'Fashion'),
  ('Tech Brand B', 'Innovative technology company focusing on smart home solutions', 'Technology'),
  ('Lifestyle Brand C', 'Wellness and lifestyle brand promoting healthy living', 'Lifestyle');

-- Insert sample campaigns
INSERT INTO campaigns (brand_id, name, description, start_date, end_date, status, budget) VALUES
  ((SELECT id FROM brands WHERE name = 'Fashion Brand A'), 'Summer Collection Launch', 'Launch campaign for the new summer collection', '2024-06-01', '2024-08-31', 'active', 50000),
  ((SELECT id FROM brands WHERE name = 'Tech Brand B'), 'Product Launch Campaign', 'New product launch with influencer partnerships', '2024-06-15', '2024-07-15', 'active', 35000),
  ((SELECT id FROM brands WHERE name = 'Lifestyle Brand C'), 'Holiday Promotion', 'Holiday season promotion campaign', '2024-05-01', '2024-05-31', 'completed', 25000);

-- Insert sample analytics data
INSERT INTO campaign_analytics (campaign_id, total_reach, total_engagement, total_impressions, total_clicks, conversion_rate, roi, tracked_at) VALUES
  ((SELECT id FROM campaigns WHERE name = 'Summer Collection Launch'), 125000, 8500, 180000, 3200, 2.56, 145.5, NOW()),
  ((SELECT id FROM campaigns WHERE name = 'Product Launch Campaign'), 89000, 6200, 120000, 2100, 2.36, 132.8, NOW()),
  ((SELECT id FROM campaigns WHERE name = 'Holiday Promotion'), 156000, 11200, 220000, 4500, 2.88, 167.3, NOW());
```

## Step 3: Verify Setup
After running the SQL, your application should work without errors. The analytics page will show real data from the database.

## Troubleshooting
- If you see "Error fetching campaign analytics", it means the analytics table doesn't exist yet. Run the SQL above.
- If you see empty analytics, run the sample data insertion SQL.
- Make sure your `.env.local` file has the correct Supabase credentials. 