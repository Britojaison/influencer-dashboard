import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { postUrl } = await request.json();
    
    if (!postUrl) {
      return NextResponse.json(
        { error: 'Post URL is required' },
        { status: 400 }
      );
    }

    // Call the webhook with the post URL as GET request
    const webhookUrl = `https://the88gb.app.n8n.cloud/webhook/522cae37-699e-4c3c-8028-96bcbe99ddd6?postUrl=${encodeURIComponent(postUrl)}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    let response: Response;
    try {
      response = await fetch(webhookUrl, {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Webhook request timed out after 30 seconds');
      }
      throw error;
    }

    if (!response.ok) {
      console.error(`Webhook request failed with status: ${response.status}`);
      console.error(`Response text: ${await response.text()}`);
      throw new Error(`Webhook request failed: ${response.status}`);
    }

    const metrics = await response.json();
    
    // Handle array response format
    if (Array.isArray(metrics) && metrics.length > 0) {
      const data = metrics[0];
      return NextResponse.json({
        likes: data.likesCount || 0,
        comments: data.commentsCount || 0,
        views: data.videoPlayCount || 0,
        name: data.ownerFullName || '',
        username: data.ownerUsername || ''
      });
    }
    
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching post metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post metrics' },
      { status: 500 }
    );
  }
}
