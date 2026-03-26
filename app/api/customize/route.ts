import { NextRequest, NextResponse } from 'next/server';
import { buildCustomizationPrompt } from '@/lib/pollinations';

// Returns only the prompt — actual image generation happens
// client-side via puter.ai.txt2img()
export async function POST(req: NextRequest) {
  try {
    const { design, customizations } = await req.json();
    const prompt = buildCustomizationPrompt(design.preferences ?? {}, customizations);

    const custDesc = Object.entries(customizations as Record<string, string>)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${v}`)
      .join(', ');

    return NextResponse.json({
      prompt,
      baseDesign: {
        ...design,
        description: `Customized — ${custDesc}.`,
        customizations,
        isCustomized: true,
      },
    });
  } catch (error) {
    console.error('Customize API error:', error);
    return NextResponse.json({ error: 'Failed to build customization prompt' }, { status: 500 });
  }
}
