import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { npcProfile, situation, relationshipLevel, playerStats } = body;

    // Mock AI-generated dialogue
    // In production, this would call the Anthropic API
    const mockResponses: Record<string, string[]> = {
      default: [
        "It's a beautiful day on the island, isn't it?",
        "I've been thinking about what makes this place special...",
        "You know, you're different from the other islanders.",
      ],
    };

    const lines = mockResponses.default;

    return NextResponse.json({
      lines,
      choices: [
        "Tell me more about that.",
        "I feel the same way!",
        "Interesting...",
      ],
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate dialogue' }, { status: 500 });
  }
}
