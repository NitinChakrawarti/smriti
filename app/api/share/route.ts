import { NextRequest, NextResponse } from 'next/server';

// POST /api/share
// Called by the manifest share_target (intercepted first by the SW, which
// stashes any files and then issues a redirect here via Response.redirect).
// The SW handles the share target directly and redirects to /share?params…
// This fallback handles cases where the SW is not yet active (first install).
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const params = new URLSearchParams();

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const url   = formData.get('url')   as string | null;
      const text  = formData.get('text')  as string | null;
      const title = formData.get('title') as string | null;

      if (url)   params.set('url',   url);
      if (text)  params.set('text',  text);
      if (title) params.set('title', title);
    } else {
      // application/x-www-form-urlencoded fallback
      const body  = await request.text();
      const form  = new URLSearchParams(body);
      const url   = form.get('url');
      const text  = form.get('text');
      const title = form.get('title');

      if (url)   params.set('url',   url);
      if (text)  params.set('text',  text);
      if (title) params.set('title', title);
    }

    return NextResponse.redirect(
      new URL(`/share?${params.toString()}`, request.url),
      303
    );
  } catch {
    return NextResponse.redirect(new URL('/', request.url), 303);
  }
}
