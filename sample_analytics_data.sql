-- Insert sample campaign analytics data
-- This will populate analytics for existing campaigns

INSERT INTO campaign_analytics (campaign_id, total_reach, total_engagement, total_impressions, total_clicks, conversion_rate, roi, tracked_at) VALUES
  ((SELECT id FROM campaigns WHERE name = 'Summer Collection Launch'), 125000, 8500, 180000, 3200, 2.56, 145.5, NOW()),
  ((SELECT id FROM campaigns WHERE name = 'Product Launch Campaign'), 89000, 6200, 120000, 2100, 2.36, 132.8, NOW()),
  ((SELECT id FROM campaigns WHERE name = 'Holiday Promotion'), 156000, 11200, 220000, 4500, 2.88, 167.3, NOW());

-- Add more sample data for different time periods to show trends
INSERT INTO campaign_analytics (campaign_id, total_reach, total_engagement, total_impressions, total_clicks, conversion_rate, roi, tracked_at) VALUES
  ((SELECT id FROM campaigns WHERE name = 'Summer Collection Launch'), 98000, 6800, 140000, 2800, 2.86, 138.2, NOW() - INTERVAL '7 days'),
  ((SELECT id FROM campaigns WHERE name = 'Product Launch Campaign'), 72000, 5100, 95000, 1800, 1.89, 125.6, NOW() - INTERVAL '7 days'),
  ((SELECT id FROM campaigns WHERE name = 'Holiday Promotion'), 134000, 9500, 190000, 3800, 2.84, 158.9, NOW() - INTERVAL '7 days'); 