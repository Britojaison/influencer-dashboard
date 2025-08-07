import { NextRequest, NextResponse } from 'next/server';
import { 
  getCampaignInfluencers, 
  createCampaignInfluencer, 
  updateCampaignInfluencer, 
  deleteCampaignInfluencer,
  checkCampaignInfluencersTable 
} from '@/lib/database';

// GET - Fetch all influencers for a campaign
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tableExists = await checkCampaignInfluencersTable();
    if (!tableExists) {
      return NextResponse.json(
        { error: 'Campaign influencers table not found' },
        { status: 404 }
      );
    }

    const influencers = await getCampaignInfluencers(id);
    return NextResponse.json(influencers);
  } catch (error) {
    console.error('Error fetching campaign influencers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign influencers' },
      { status: 500 }
    );
  }
}

// POST - Create a new influencer
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const influencer = await createCampaignInfluencer({
      campaign_id: id,
      ...body
    });
    
    return NextResponse.json(influencer, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign influencer:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign influencer' },
      { status: 500 }
    );
  }
}

// PUT - Update an influencer
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    const influencer = await updateCampaignInfluencer(id, updates);
    return NextResponse.json(influencer);
  } catch (error) {
    console.error('Error updating campaign influencer:', error);
    return NextResponse.json(
      { error: 'Failed to update campaign influencer' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an influencer
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Influencer ID is required' },
        { status: 400 }
      );
    }

    await deleteCampaignInfluencer(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting campaign influencer:', error);
    return NextResponse.json(
      { error: 'Failed to delete campaign influencer' },
      { status: 500 }
    );
  }
}
