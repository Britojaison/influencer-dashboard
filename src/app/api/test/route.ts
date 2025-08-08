import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Test basic connection
    const { data: brands, error: brandsError } = await supabase
      .from('brands')
      .select('count')
      .limit(1);

    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('count')
      .limit(1);

    const { data: influencers, error: influencersError } = await supabase
      .from('campaign_influencers')
      .select('count')
      .limit(1);

    return NextResponse.json({
      status: 'success',
      connection: 'working',
      tables: {
        brands: {
          exists: !brandsError,
          error: brandsError?.message || null
        },
        campaigns: {
          exists: !campaignsError,
          error: campaignsError?.message || null
        },
        campaign_influencers: {
          exists: !influencersError,
          error: influencersError?.message || null
        }
      },
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'not set',
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'not set'
      }
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'not set',
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'not set'
      }
    }, { status: 500 });
  }
}
