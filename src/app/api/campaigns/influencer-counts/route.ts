import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get influencer counts for each campaign
    const { data, error } = await supabase
      .from('campaign_influencers')
      .select('campaign_id')
      .not('campaign_id', 'is', null);

    if (error) {
      console.error('Error fetching influencer counts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch influencer counts' },
        { status: 500 }
      );
    }

    // Count influencers per campaign
    const influencerCounts: { [key: string]: number } = {};
    data?.forEach(influencer => {
      const campaignId = influencer.campaign_id;
      influencerCounts[campaignId] = (influencerCounts[campaignId] || 0) + 1;
    });

    return NextResponse.json(influencerCounts);
  } catch (error) {
    console.error('Error fetching influencer counts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch influencer counts' },
      { status: 500 }
    );
  }
}
