'use strict';

import type { Character, EventType, GameEvent } from '@/characters/CharacterData';
import { ENERGY_COSTS, EVENTS_PER_DAY } from '@/game/constants';
import { getDayType, getAvailableEventTypes } from '@/systems/calendar';

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
 * Generate the daily pool of EVENTS_PER_DAY events based on the weekly
 * schedule and the current cast.
 *
 * Ceremony days produce no events (empty array).
 */
export function generateDailyEvents(
  day: number,
  week: number,
  cast: Character[],
): GameEvent[] {
  const dayType = getDayType(day);
  if (dayType === 'ceremony') return [];

  const availableTypes = getAvailableEventTypes(day);
  if (availableTypes.length === 0) return [];

  const events: GameEvent[] = [];

  // First event is always the "headline" type for the day
  const headlineType: EventType =
    dayType === 'free' ? pickRandom(availableTypes) : availableTypes[0];

  events.push(buildEvent(headlineType, day, week, 0, cast));

  // Fill the remaining slots with available types
  for (let i = 1; i < EVENTS_PER_DAY; i++) {
    const type = pickRandom(availableTypes);
    events.push(buildEvent(type, day, week, i, cast));
  }

  return events;
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
