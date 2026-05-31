import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// POST /api/share/ingest
// Used exclusively by the Service Worker's background sync queue.
// The SW passes the auth token in the JSON body (it has no access to
// localStorage/cookies, so the client stores the token in the queue item).
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      url?: string;
      text?: string;
      title?: string;
      token?: string;
    };

    const { url, text, title, token } = body;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Determine what to ingest — URL takes priority, then extract from text
    let ingestUrl = url;
    if (!ingestUrl && text) {
      const match = text.match(/(https?:\/\/[^\s]+)/);
      ingestUrl = match?.[0] ?? undefined;
    }

    if (!ingestUrl) {
      return NextResponse.json({ success: false, message: 'No URL to ingest' }, { status: 400 });
    }

    const response = await fetch(`${API_URL}/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url: ingestUrl, source: 'pwa-share' }),
    });

    let data: any = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Backend error' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Internal error' }, { status: 500 });
  }
}
