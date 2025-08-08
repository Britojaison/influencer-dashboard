export interface Brand {
  id: string;
  name: string;
  logo_url?: string;
  description?: string;
  website_url?: string;
  industry?: string;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  brand_id: string;
  name: string;
  description?: string;
  summary?: string;
  start_date: string;
  end_date: string;
  status: 'draft' | 'active' | 'completed' | 'paused';
  budget?: number;
  target_audience?: string;
  goals?: string;
  created_at: string;
  updated_at: string;
  brand?: Brand;
}

export interface CampaignAnalytics {
  id: string;
  campaign_id: string;
  total_reach: number;
  total_engagement: number;
  total_impressions: number;
  total_clicks: number;
  conversion_rate: number;
  roi: number;
  tracked_at: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignInfluencerDetail {
  id: string;
  campaign_id: string;
  name: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'facebook' | 'linkedin';
  username: string;
  content_type?: string;
  post_url?: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;

  followers_count: number;
  status: 'active' | 'inactive' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Influencer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  social_media_handles: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    twitter?: string;
  };
  followers_count?: number;

  created_at: string;
  updated_at: string;
}

export interface CampaignInfluencer {
  id: string;
  campaign_id: string;
  influencer_id: string;
  status: 'invited' | 'accepted' | 'rejected' | 'completed';
  rate?: number;
  created_at: string;
  updated_at: string;
  campaign?: Campaign;
  influencer?: Influencer;
}

export interface Post {
  id: string;
  campaign_influencer_id: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter';
  post_url: string;
  post_id?: string;
  caption?: string;
  likes: number;
  comments: number;
  shares: number;
  views?: number;
  posted_at: string;
  created_at: string;
  updated_at: string;
  campaign_influencer?: CampaignInfluencer;
}

export interface DashboardStats {
  total_brands: number;
  total_campaigns: number;
  active_campaigns: number;
  completed_campaigns: number;
  total_budget: number;
  average_roi: number;
}

export interface DateRange {
  from: Date;
  to: Date;
} 