import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get all unique influencers from campaign_influencers table
    const { data, error } = await supabase
      .from('campaign_influencers')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching influencers:', error);
      return NextResponse.json(
        { error: 'Failed to fetch influencers' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching influencers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch influencers' },
      { status: 500 }
    );
  }
}
