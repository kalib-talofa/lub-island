'use strict';

import type { Character, EventType, GameEvent } from '@/characters/CharacterData';
import { ENERGY_COSTS, EVENTS_PER_DAY, FTUE_ARRIVALS } from '@/game/constants';
import { isCeremonyDay, isFreeRoamDay, getAvailableEventTypes } from '@/systems/calendar';

/** Deterministic id built from day + week + index. */
function makeEventId(day: number, week: number, index: number): string {
  return `evt_w${week}_d${day}_${index}`;
}

/** Pick a random element from an array. */
function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Pick N random non-duplicate NPCs (or fewer if cast is small). */
function pickRandomNPCs(cast: Character[], n: number): Character[] {
  const pool = cast.filter((c) => !c.isEliminated && c.id !== 'player');
  const picked: Character[] = [];
  const used = new Set<string>();
  const limit = Math.min(n, pool.length);
  while (picked.length < limit) {
    const npc = pickRandom(pool);
    if (!used.has(npc.id)) {
      used.add(npc.id);
      picked.push(npc);
    }
  }
  return picked;
}

/** Map EventType to its energy cost. */
function eventEnergyCost(type: EventType): number {
  switch (type) {
    case 'challenge':
      return ENERGY_COSTS.CHALLENGE_EVENT;
    case 'date':
      return ENERGY_COSTS.DATE_EVENT;
    case 'social':
      return ENERGY_COSTS.SOCIAL_EVENT;
    case 'arrival':
      return ENERGY_COSTS.SOCIAL_EVENT;
    case 'drama':
      return ENERGY_COSTS.SOCIAL_EVENT;
  }
}

const EVENT_LOCATIONS: Record<EventType, readonly string[]> = {
  challenge: ['Challenge Arena', 'Beach'],
  date: ['Garden', 'Beach', 'Lookout'],
  social: ['Villa', 'Beach', 'Garden'],
  arrival: ['Villa'],
  drama: ['Villa', 'Jungle'],
};

const EVENT_TITLES: Record<EventType, readonly string[]> = {
  challenge: ['Coconut Catch Showdown', 'Island Challenge', 'Prove Your Worth'],
  date: ['Sunset Stroll', 'Moonlit Dinner', 'Garden Picnic'],
  social: ['Beach Bonfire', 'Pool Party', 'Group Chat'],
  arrival: ['New Arrival', 'Welcome to the Island', 'A Fresh Face'],
  drama: ['Secret Revealed', 'Tensions Rise', 'The Truth Comes Out'],
};

const EVENT_DESCRIPTIONS: Record<EventType, readonly string[]> = {
  challenge: [
    'Compete in a head-to-head island challenge to impress everyone!',
    'Show off your skills in a thrilling competition.',
    'Time to prove you belong on Lub Island.',
  ],
  date: [
    'Spend some quality one-on-one time with a special someone.',
    'A chance to deepen your connection with another islander.',
    'Romance is in the air -- make the most of it!',
  ],
  social: [
    'Hang out with the group and build friendships.',
    'A relaxed gathering where anything can happen.',
    'Get to know your fellow islanders a little better.',
  ],
  arrival: [
    'A new islander has arrived and is ready to shake things up!',
    'Welcome the newest member of the island.',
    'Someone new steps off the boat. First impressions matter!',
  ],
  drama: [
    'Hidden alliances are exposed. Watch your back!',
    'A shocking revelation changes everything.',
    'Conflict erupts among the islanders.',
  ],
};

/**
 * Build a single GameEvent for a given type, day, week, and index.
 */
function buildEvent(
  type: EventType,
  day: number,
  week: number,
  index: number,
  cast: Character[],
): GameEvent {
  const npcCount = type === 'date' ? 1 : 2;
  const npcs = pickRandomNPCs(cast, npcCount);

  return {
    id: makeEventId(day, week, index),
    type,
    title: pickRandom(EVENT_TITLES[type]),
    description: pickRandom(EVENT_DESCRIPTIONS[type]),
    energyCost: eventEnergyCost(type),
    location: pickRandom(EVENT_LOCATIONS[type]),
    involvedNPCs: npcs.map((n) => n.id),
  };
}

/**
 * Build an arrival event for a specific NPC (used in FTUE).
 */
function buildArrivalEvent(
  title: string,
  description: string,
  npcId: string,
  day: number,
  week: number,
  index: number,
): GameEvent {
  return {
    id: makeEventId(day, week, index),
    type: 'arrival',
    title,
    description,
    energyCost: eventEnergyCost('arrival'),
    location: 'Villa',
    involvedNPCs: [npcId],
  };
}

// ---------------------------------------------------------------------------
// FTUE event generation (Week 1)
// ---------------------------------------------------------------------------

function generateFTUEEvents(
  day: number,
  cast: Character[],
  arrivedNPCIds: string[],
): GameEvent[] {
  const events: GameEvent[] = [];

  if (day === 1) {
    // Day 1: Welcome to Island, A Fresh Face, New Arrival — each for one of the 3 starting NPCs
    const day1NPCs = FTUE_ARRIVALS[1] ?? [];
    const titles = ['Welcome to the Island', 'A Fresh Face', 'New Arrival'];
    const descs = [
      'Welcome the newest member of the island.',
      'Someone new steps off the boat. First impressions matter!',
      'A new islander has arrived and is ready to shake things up!',
    ];
    for (let i = 0; i < Math.min(EVENTS_PER_DAY, day1NPCs.length); i++) {
      events.push(buildArrivalEvent(titles[i], descs[i], day1NPCs[i], day, 1, i));
    }
  } else if (day === 2) {
    // Day 2: New Arrival (4th NPC), New Arrival (5th NPC), Challenge
    const day2NPCs = FTUE_ARRIVALS[2] ?? [];
    for (let i = 0; i < day2NPCs.length; i++) {
      events.push(buildArrivalEvent(
        'New Arrival',
        `${day2NPCs[i].charAt(0).toUpperCase() + day2NPCs[i].slice(1)} has arrived on the island!`,
        day2NPCs[i], day, 1, i,
      ));
    }
    // Fill remaining slot with a challenge
    events.push(buildEvent('challenge', day, 1, events.length, cast));
  } else if (day === 3) {
    // Day 3: New Arrival (6th NPC), Date, Drama
    const day3NPCs = FTUE_ARRIVALS[3] ?? [];
    if (day3NPCs.length > 0) {
      events.push(buildArrivalEvent(
        'New Arrival',
        `${day3NPCs[0].charAt(0).toUpperCase() + day3NPCs[0].slice(1)} has arrived on the island!`,
        day3NPCs[0], day, 1, 0,
      ));
    }
    events.push(buildEvent('date', day, 1, 1, cast));
    events.push(buildEvent('drama', day, 1, 2, cast));
  }

  return events;
}

// ---------------------------------------------------------------------------
// Week 2+ event generation
// ---------------------------------------------------------------------------

function generateWeek2Events(
  day: number,
  week: number,
  cast: Character[],
  producerChoice?: EventType | null,
): GameEvent[] {
  const events: GameEvent[] = [];
  const availableTypes = getAvailableEventTypes(day, week);
  if (availableTypes.length === 0) return [];

  // Guaranteed event type by day-in-week
  const guaranteedType: EventType | null =
    (day === 1) ? 'social' :          // Day 1: social only
    (day === 2) ? 'challenge' :       // Day 2: guaranteed challenge
    (day === 3) ? 'date' :            // Day 3: guaranteed date
    (day === 4) ? 'drama' :           // Day 4: guaranteed drama
    null;

  // Day 1 of week 2+: all social events
  if (day === 1) {
    for (let i = 0; i < EVENTS_PER_DAY; i++) {
      events.push(buildEvent('social', day, week, i, cast));
    }
    return events;
  }

  // First event is always the guaranteed type
  const headlineType: EventType = guaranteedType ?? pickRandom(availableTypes);
  events.push(buildEvent(headlineType, day, week, 0, cast));

  // Pick which remaining slot gets the producer's choice (if any)
  const producerSlot = producerChoice ? 1 + Math.floor(Math.random() * (EVENTS_PER_DAY - 1)) : -1;

  // Fill remaining slots
  for (let i = 1; i < EVENTS_PER_DAY; i++) {
    const type = (i === producerSlot && producerChoice) ? producerChoice : pickRandom(availableTypes);
    events.push(buildEvent(type, day, week, i, cast));
  }

  return events;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate the daily pool of events based on the week and day.
 *
 * Ceremony days and free-roam days produce no events (empty array).
 */
export function generateDailyEvents(
  day: number,
  week: number,
  cast: Character[],
  producerChoice?: EventType | null,
  arrivedNPCIds?: string[],
): GameEvent[] {
  // Ceremony days and free-roam days have no events
  if (isCeremonyDay(day, week)) return [];
  if (isFreeRoamDay(day, week)) return [];

  // Week 1: fully baked FTUE events
  if (week === 1) {
    return generateFTUEEvents(day, cast, arrivedNPCIds ?? []);
  }

  // Week 2+: normal event generation
  return generateWeek2Events(day, week, cast, producerChoice);
}

/**
 * Produce a short human-readable description of a GameEvent.
 */
export function getEventDescription(event: GameEvent): string {
  const npcList =
    event.involvedNPCs.length > 0
      ? ` with ${event.involvedNPCs.join(', ')}`
      : '';
  return `${event.title} (${event.type})${npcList} at ${event.location} [${event.energyCost} energy]`;
}
