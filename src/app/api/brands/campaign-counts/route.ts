import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get campaign counts for each brand
    const { data, error } = await supabase
      .from('campaigns')
      .select('brand_id')
      .not('brand_id', 'is', null);

    if (error) {
      console.error('Error fetching campaign counts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch campaign counts' },
        { status: 500 }
      );
    }

    // Count campaigns per brand
    const campaignCounts: { [key: string]: number } = {};
    data?.forEach(campaign => {
      const brandId = campaign.brand_id;
      campaignCounts[brandId] = (campaignCounts[brandId] || 0) + 1;
    });

    return NextResponse.json(campaignCounts);
  } catch (error) {
    console.error('Error fetching campaign counts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign counts' },
      { status: 500 }
    );
  }
}
