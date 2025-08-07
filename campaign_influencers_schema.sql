-- Create campaign_influencers table
CREATE TABLE campaign_influencers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'youtube', 'twitter', 'facebook', 'linkedin')),
  username VARCHAR(255) NOT NULL,
  content_type VARCHAR(100),
  post_url TEXT,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  
  followers_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_campaign_influencers_campaign_id ON campaign_influencers(campaign_id);
CREATE INDEX idx_campaign_influencers_platform ON campaign_influencers(platform);
CREATE INDEX idx_campaign_influencers_status ON campaign_influencers(status);

-- Create trigger for updated_at
CREATE TRIGGER update_campaign_influencers_updated_at BEFORE UPDATE ON campaign_influencers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
            INSERT INTO campaign_influencers (campaign_id, name, platform, username, content_type, post_url, likes, comments, shares, views, followers_count, status) VALUES
                ((SELECT id FROM campaigns WHERE name = 'Summer Collection Launch'), 'Emma Johnson', 'instagram', '@fashionista_emma', 'Photo Post', 'https://instagram.com/p/ABC123', 1240, 89, 23, 8500, 45000, 'active'),
              ((SELECT id FROM campaigns WHERE name = 'Summer Collection Launch'), 'Alex Chen', 'tiktok', '@alexchen_style', 'Video', 'https://tiktok.com/@alexchen_style/video/123456', 8900, 234, 156, 45000, 120000, 'active'),
              ((SELECT id FROM campaigns WHERE name = 'Product Launch Campaign'), 'Sarah Williams', 'youtube', '@techreviewer_sarah', 'Review Video', 'https://youtube.com/watch?v=xyz789', 5600, 189, 67, 25000, 75000, 'active'),
              ((SELECT id FROM campaigns WHERE name = 'Holiday Promotion'), 'Mike Rodriguez', 'instagram', '@lifestyle_mike', 'Story', 'https://instagram.com/stories/mike/123', 3200, 145, 89, 18000, 65000, 'completed'); 