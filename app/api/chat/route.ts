import { NextRequest, NextResponse } from 'next/server';
import { chatWithPollinations } from '@/lib/pollinations';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const pollinationsMsgs = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : ('assistant' as const),
      content: m.content,
    }));

    const reply = await chatWithPollinations(pollinationsMsgs);
    const isReady = reply.includes('[READY_TO_GENERATE]');
    const cleanReply = reply.replace('[READY_TO_GENERATE]', '').trim();

    return NextResponse.json({ message: cleanReply, readyToGenerate: isReady });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
