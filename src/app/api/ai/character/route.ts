import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentCast, playerPreferences, weekNumber } = body;

    // Mock new arrival character generation
    const newCharacter = {
      id: `arrival_week${weekNumber}`,
      name: weekNumber === 2 ? 'Maple' : 'Coco',
      species: weekNumber === 2 ? 'deer' : 'duck',
      personality: {
        extroversion: 65,
        agreeableness: 55,
        confidence: 70,
        humor: 60,
        loyalty: 45,
      },
      colorPalette: {
        primary: weekNumber === 2 ? '#C4956A' : '#FFFACD',
        secondary: weekNumber === 2 ? '#8B6914' : '#FFD700',
        accent: weekNumber === 2 ? '#FFD700' : '#FF6347',
      },
      catchphrase: weekNumber === 2 ? 'Oh deer!' : 'Duck yeah!',
      backstory: weekNumber === 2
        ? 'Maple is a free-spirited deer who loves autumn leaves and warm cider. She came to the island looking for genuine connection.'
        : 'Coco is a confident duck with a background in competitive swimming. They came to make a splash and steal hearts.',
      romanceInterest: 'either' as const,
      preferredTraits: ['funny', 'kind'],
      dislikedTraits: ['arrogant'],
      activityPreference: 'balanced' as const,
      preferredZone: weekNumber === 2 ? 'Garden' : 'Beach',
      relationshipToPlayer: 0,
      currentPartner: null,
      isEliminated: false,
      dayJoined: (weekNumber - 1) * 7 + 1,
    };

    return NextResponse.json({ character: newCharacter });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate character' }, { status: 500 });
  }
}
