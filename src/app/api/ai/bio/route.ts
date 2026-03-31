import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerChoices, relationships, stats, weekNumber } = body;

    // Mock player bio generation
    const bios = [
      "A mysterious newcomer with surprisingly high energy levels. Has been spotted chatting up everyone on the island. The other contestants aren't sure if they're genuine or playing the game.",
      "This dark horse has been quietly building connections while dominating every challenge. A morning person with a competitive streak — they've already become the one to watch.",
      "Known for their awkward but endearing pickup lines, this contestant has somehow charmed their way into several hearts. Their secret? An inexhaustible supply of chocolate and genuine kindness.",
    ];

    const bio = bios[Math.min(weekNumber - 1, bios.length - 1)];

    return NextResponse.json({ bio });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate bio' }, { status: 500 });
  }
}
