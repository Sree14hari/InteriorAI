import { NextRequest, NextResponse } from 'next/server';

const POLLINATIONS_KEY = process.env.POLLINATIONS_API_KEY || '';

export async function GET(req: NextRequest) {
  const prompt = req.nextUrl.searchParams.get('prompt');
  const width = req.nextUrl.searchParams.get('width') ?? '1024';
  const height = req.nextUrl.searchParams.get('height') ?? '768';
  const seed = req.nextUrl.searchParams.get('seed') ?? '';

  if (!prompt) {
    return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
  }

  const params = new URLSearchParams({
    width,
    height,
    model: 'flux',
    nologo: 'true',
    enhance: 'true',
  });
  if (seed) params.set('seed', seed);
  if (POLLINATIONS_KEY) params.set('key', POLLINATIONS_KEY);

  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params}`;

  try {
    const res = await fetch(url, {
      // No auth header — anonymous free tier (pk_ key has 0 balance)
      signal: AbortSignal.timeout(60_000),
    });

    if (!res.ok) {
      console.error('Pollinations image error:', res.status, await res.text());
      return NextResponse.json({ error: 'Image generation failed' }, { status: res.status });
    }

    const contentType = res.headers.get('content-type') ?? 'image/jpeg';
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Cache for 1 hour — same seed + prompt = same image
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (err) {
    console.error('Image proxy error:', err);
    return NextResponse.json({ error: 'Proxy fetch failed' }, { status: 500 });
  }
}
