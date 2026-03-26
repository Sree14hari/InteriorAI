const POLLINATIONS_KEY = process.env.POLLINATIONS_API_KEY || '';

// ─── Image Generation ────────────────────────────────────────────────────────
// Pollinations image endpoint: https://image.pollinations.ai/prompt/{prompt}
// Returns a direct image URL – no extra fetch needed, just embed the URL.

export function buildImageUrl(prompt: string, options?: {
  width?: number;
  height?: number;
  model?: string;
  seed?: number;
  nologo?: boolean;
  enhance?: boolean;
}): string {
  const encoded = encodeURIComponent(prompt);
  const params = new URLSearchParams();
  params.set('width', String(options?.width ?? 1024));
  params.set('height', String(options?.height ?? 768));
  params.set('model', options?.model ?? 'flux');
  if (options?.seed !== undefined) params.set('seed', String(options.seed));
  params.set('nologo', 'true');
  // Anonymous requests use the free shared pool — pk_ key has 0 balance
  return `https://image.pollinations.ai/prompt/${encoded}?${params.toString()}`;
}

// ─── Interior Design Prompts ─────────────────────────────────────────────────

export function buildDesignPrompt(preferences: Record<string, unknown>, variationModifier = ''): string {
  const roomType = (preferences.roomType as string) || 'living room';
  const styles = (preferences.styles as string[])?.join(', ') || 'modern';
  const colors = (preferences.colors as string) || 'neutral warm tones';
  const budget = (preferences.budget as string) || 'mid-range';
  const mood = (preferences.mood as string) || 'cozy and inviting';
  const mustHave = (preferences.mustHave as string) || '';
  const avoid = (preferences.avoid as string) || '';

  let prompt = `Photorealistic interior design render of a ${roomType}. `;
  prompt += `Style: ${styles}. `;
  prompt += `Color palette: ${colors}. `;
  prompt += `Budget aesthetic: ${budget}. `;
  prompt += `Mood: ${mood}. `;
  if (mustHave) prompt += `Include: ${mustHave}. `;
  if (avoid) prompt += `Avoid: ${avoid}. `;
  if (variationModifier) prompt += `${variationModifier}. `;
  prompt += `Professional interior design photography, perfect lighting, 4K, architectural digest quality, wide angle view showing the full room, ultra-realistic materials and textures.`;
  return prompt;
}

export function buildCustomizationPrompt(
  preferences: Record<string, unknown>,
  customizations: Record<string, string>
): string {
  const roomType = (preferences?.roomType as string) || 'room';
  const styles = (preferences?.styles as string[])?.join(', ') || 'modern';

  const custDesc = Object.entries(customizations)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${v}`)
    .join(', ');

  return `Photorealistic interior design render of a ${styles} ${roomType} with these specific customizations: ${custDesc}. ` +
    `Professional interior photography, perfect lighting, 4K quality, wide angle view, ultra-realistic materials and textures, architectural digest style.`;
}

export const VARIATION_MODIFIERS = [
  'Focus on natural lighting, large windows, airy and bright atmosphere',
  'Emphasize cozy warm textures, soft layered lighting, intimate ambiance',
  'Highlight clean minimalist lines, statement furniture pieces, designer accents',
];

// ─── Text / Chat ─────────────────────────────────────────────────────────────
// Pollinations text endpoint (OpenAI-compatible): https://text.pollinations.ai/openai

export const INTERIOR_SYSTEM_PROMPT = `You are an expert interior designer AI assistant named "Studio AI". Your goal is to understand the user's room and design preferences through a natural, friendly conversation.

Gather these details:
- Room type (e.g. living room, bedroom, kitchen, bathroom, office)
- Room approximate size (small / medium / large)
- Preferred design style(s) (modern, minimalist, bohemian, industrial, Scandinavian, traditional, etc.)
- Color preferences (warm, cool, neutral, bold accents?)
- Budget range (budget / mid-range / luxury)
- Required items or features
- Things to avoid

After 4–6 exchanges and once you have gathered enough info, summarize the design brief in a short paragraph and end your message with exactly: [READY_TO_GENERATE]

Keep responses concise (2–3 sentences max per message), friendly, and conversational. Ask only 1–2 questions at a time. Make suggestions where appropriate.`;

interface PollinationsMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function chatWithPollinations(messages: PollinationsMessage[]): Promise<string> {
  const payload = {
    model: 'openai',
    messages: [
      { role: 'system', content: INTERIOR_SYSTEM_PROMPT },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 512,
  };

  // Important: the text.pollinations.ai legacy endpoint ONLY works for anonymous requests.
  // Sending an Authorization header causes a 400 deprecation error.
  const res = await fetch('https://text.pollinations.ai/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Pollinations chat error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? 'Sorry, I could not respond.';
}
