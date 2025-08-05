export interface Brand {
  id: string;
  name: string;
  logo_url?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  brand_id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'draft';
  budget?: number;
  created_at: string;
  updated_at: string;
  brand?: Brand;
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
  engagement_rate?: number;
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
  total_influencers: number;
  total_posts: number;
  total_engagement: number;
  total_reach: number;
}

export interface DateRange {
  from: Date;
  to: Date;
} 