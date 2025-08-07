import { supabase } from './supabase';
import { Brand, Campaign, CampaignAnalytics, CampaignInfluencerDetail, DashboardStats } from '@/types/database';

// Brand operations
export const getBrands = async (): Promise<Brand[]> => {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }

  return data || [];
};

export const getBrandById = async (id: string): Promise<Brand | null> => {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching brand:', error);
    throw error;
  }

  return data;
};

export const createBrand = async (brand: Omit<Brand, 'id' | 'created_at' | 'updated_at'>): Promise<Brand> => {
  const { data, error } = await supabase
    .from('brands')
    .insert(brand)
    .select()
    .single();

  if (error) {
    console.error('Error creating brand:', error);
    throw error;
  }

  return data;
};

export const updateBrand = async (id: string, updates: Partial<Brand>): Promise<Brand> => {
  const { data, error } = await supabase
    .from('brands')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating brand:', error);
    throw error;
  }

  return data;
};

export const deleteBrand = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('brands')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting brand:', error);
    throw error;
  }
};

// Campaign operations
export const getCampaigns = async (): Promise<Campaign[]> => {
  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      brand:brands(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }

  return data || [];
};

export const getCampaignById = async (id: string): Promise<Campaign | null> => {
  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      brand:brands(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching campaign:', error);
    throw error;
  }

  return data;
};

export const createCampaign = async (campaign: Omit<Campaign, 'id' | 'created_at' | 'updated_at' | 'brand'>): Promise<Campaign> => {
  const { data, error } = await supabase
    .from('campaigns')
    .insert(campaign)
    .select(`
      *,
      brand:brands(*)
    `)
    .single();

  if (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }

  return data;
};

export const updateCampaign = async (id: string, updates: Partial<Campaign>): Promise<Campaign> => {
  const { data, error } = await supabase
    .from('campaigns')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      brand:brands(*)
    `)
    .single();

  if (error) {
    console.error('Error updating campaign:', error);
    throw error;
  }

  return data;
};

export const deleteCampaign = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting campaign:', error);
    throw error;
  }
};

// Campaign Analytics operations
export const getCampaignAnalytics = async (campaignId: string): Promise<CampaignAnalytics | null> => {
  try {
    console.log(`Fetching analytics for campaign: ${campaignId}`);
    
    // Try different query approaches
    let { data, error } = await supabase
      .from('campaign_analytics')
      .select('*')
      .eq('campaign_id', campaignId);

    if (error) {
      console.error('Error with first query attempt:', error);
      
      // Try with string comparison
      const result = await supabase
        .from('campaign_analytics')
        .select('*')
        .eq('campaign_id', campaignId.toString());
      
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Error fetching campaign analytics:', error);
      return null;
    }

    if (!data || data.length === 0) {
      console.log(`No analytics data found for campaign: ${campaignId}`);
      return null;
    }

    // Return the first match (since we're looking for a single record)
    const analytics = data[0];
    console.log(`Found analytics data for campaign: ${campaignId}`, analytics);
    return analytics;
  } catch (error) {
    console.error('Error fetching campaign analytics:', error);
    return null;
  }
};

export const updateCampaignAnalytics = async (campaignId: string, analytics: Partial<CampaignAnalytics>): Promise<CampaignAnalytics> => {
  const { data, error } = await supabase
    .from('campaign_analytics')
    .upsert({
      campaign_id: campaignId,
      ...analytics
    })
    .select()
    .single();

  if (error) {
    console.error('Error updating campaign analytics:', error);
    throw error;
  }

  return data;
};

// Dashboard stats
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const [
      { count: totalBrands },
      { count: totalCampaigns },
      { count: activeCampaigns },
      { count: completedCampaigns },
      { data: budgetData }
    ] = await Promise.all([
      supabase.from('brands').select('*', { count: 'exact', head: true }),
      supabase.from('campaigns').select('*', { count: 'exact', head: true }),
      supabase.from('campaigns').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('campaigns').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('campaigns').select('budget').not('budget', 'is', null)
    ]);

    // Try to get ROI data, but don't fail if analytics table doesn't exist
    let averageRoi = 0;
    try {
      const { data: roiData } = await supabase
        .from('campaign_analytics')
        .select('roi')
        .not('roi', 'is', null);
      
      averageRoi = roiData?.length ? roiData.reduce((sum, analytics) => sum + analytics.roi, 0) / roiData.length : 0;
    } catch (error) {
      console.log('Analytics table not available yet, using default ROI');
    }

    const totalBudget = budgetData?.reduce((sum, campaign) => sum + (campaign.budget || 0), 0) || 0;

    return {
      total_brands: totalBrands || 0,
      total_campaigns: totalCampaigns || 0,
      active_campaigns: activeCampaigns || 0,
      completed_campaigns: completedCampaigns || 0,
      total_budget: totalBudget,
      average_roi: averageRoi
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      total_brands: 0,
      total_campaigns: 0,
      active_campaigns: 0,
      completed_campaigns: 0,
      total_budget: 0,
      average_roi: 0
    };
  }
}; 

// Helper function to check if analytics table exists and has data
export const checkAnalyticsTable = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('campaign_analytics')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Analytics table might not exist:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking analytics table:', error);
    return false;
  }
};

// Function to create sample analytics data for existing campaigns
export const createSampleAnalytics = async (): Promise<void> => {
  try {
    console.log('Creating sample analytics data...');
    
    // Get all campaigns
    const campaigns = await getCampaigns();
    
    for (const campaign of campaigns) {
      // Check if analytics already exist for this campaign
      const existingAnalytics = await getCampaignAnalytics(campaign.id);
      
      if (!existingAnalytics) {
        // Create sample analytics data
        const sampleData = {
          campaign_id: campaign.id,
          total_reach: Math.floor(Math.random() * 200000) + 50000,
          total_engagement: Math.floor(Math.random() * 15000) + 3000,
          total_impressions: Math.floor(Math.random() * 300000) + 80000,
          total_clicks: Math.floor(Math.random() * 8000) + 1000,
          conversion_rate: Math.random() * 5 + 1, // 1-6%
          roi: Math.random() * 200 + 50, // 50-250%
        };

        const { error } = await supabase
          .from('campaign_analytics')
          .insert(sampleData);

        if (error) {
          console.error(`Error creating analytics for campaign ${campaign.id}:`, error);
        } else {
          console.log(`Created analytics for campaign: ${campaign.name}`);
        }
      }
    }
    
    console.log('Sample analytics data creation completed');
  } catch (error) {
    console.error('Error creating sample analytics:', error);
  }
}; 

// Function to check all analytics data in the database
export const getAllAnalytics = async (): Promise<CampaignAnalytics[]> => {
  try {
    console.log('Fetching all analytics data...');
    const { data, error } = await supabase
      .from('campaign_analytics')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all analytics:', error);
      return [];
    }

    console.log('All analytics data:', data);
    return data || [];
  } catch (error) {
    console.error('Error fetching all analytics:', error);
    return [];
  }
}; 

// Function to inspect analytics table structure
export const inspectAnalyticsTable = async (): Promise<void> => {
  try {
    console.log('Inspecting analytics table structure...');
    
    // Get all analytics data without filtering
    const { data, error } = await supabase
      .from('campaign_analytics')
      .select('*')
      .limit(5);

    if (error) {
      console.error('Error inspecting analytics table:', error);
      return;
    }

    console.log('Analytics table structure:', data);
    
    if (data && data.length > 0) {
      console.log('Sample analytics record:', data[0]);
      console.log('Campaign ID type:', typeof data[0].campaign_id);
      console.log('Campaign ID value:', data[0].campaign_id);
    }
  } catch (error) {
    console.error('Error inspecting analytics table:', error);
  }
}; 

// Campaign Influencer operations
export const getCampaignInfluencers = async (campaignId: string): Promise<CampaignInfluencerDetail[]> => {
  try {
    const { data, error } = await supabase
      .from('campaign_influencers')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching campaign influencers:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching campaign influencers:', error);
    return [];
  }
};

export const createCampaignInfluencer = async (influencer: Omit<CampaignInfluencerDetail, 'id' | 'created_at' | 'updated_at'>): Promise<CampaignInfluencerDetail> => {
  try {
    console.log('Creating campaign influencer:', influencer);
    const { data, error } = await supabase
      .from('campaign_influencers')
      .insert(influencer)
      .select()
      .single();

    if (error) {
      console.error('Error creating campaign influencer:', error);
      throw error;
    }

    console.log('Campaign influencer created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating campaign influencer:', error);
    throw error;
  }
};

export const updateCampaignInfluencer = async (id: string, updates: Partial<CampaignInfluencerDetail>): Promise<CampaignInfluencerDetail> => {
  const { data, error } = await supabase
    .from('campaign_influencers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating campaign influencer:', error);
    throw error;
  }

  return data;
};

export const deleteCampaignInfluencer = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('campaign_influencers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting campaign influencer:', error);
    throw error;
  }
}; 

// Function to check if campaign_influencers table exists
export const checkCampaignInfluencersTable = async (): Promise<boolean> => {
  try {
    console.log('Checking if campaign_influencers table exists...');
    const { data, error } = await supabase
      .from('campaign_influencers')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Campaign influencers table might not exist:', error);
      return false;
    }

    console.log('Campaign influencers table exists');
    return true;
  } catch (error) {
    console.error('Error checking campaign influencers table:', error);
    return false;
  }
}; 