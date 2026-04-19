import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const text = formData.get('text') as string;
    const url = formData.get('url') as string;

    // Redirect to share page with params
    const params = new URLSearchParams();
    if (url) params.set('url', url);
    if (text) params.set('text', text);
    if (title) params.set('title', title);

    return NextResponse.redirect(
      new URL(`/share?${params.toString()}`, request.url)
    );
  } catch (error) {
    console.error('Share API error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
