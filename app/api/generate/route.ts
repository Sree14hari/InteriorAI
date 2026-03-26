import { NextRequest, NextResponse } from 'next/server';
import { buildDesignPrompt, VARIATION_MODIFIERS } from '@/lib/pollinations';

// This route only builds prompts — actual image generation happens
// client-side via puter.ai.txt2img() (unlimited & free)
export async function POST(req: NextRequest) {
  try {
    const { preferences, variations = 3 } = await req.json();

    const prompts = Array.from({ length: variations }, (_, i) => {
      const modifier = VARIATION_MODIFIERS[i % VARIATION_MODIFIERS.length];
      const prompt = buildDesignPrompt(preferences, modifier);
      const styleLabel = (preferences.styles as string[])?.[0] ?? 'Modern';
      const roomLabel = (preferences.roomType as string) ?? 'room';

      return {
        id: crypto.randomUUID(),
        prompt,
        description: `${styleLabel} ${roomLabel} — Variation ${i + 1}`,
        modifier,
      };
    });

    return NextResponse.json({ prompts });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json({ error: 'Failed to build prompts' }, { status: 500 });
  }
}
