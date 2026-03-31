'use strict';

import type { EventType } from '@/characters/CharacterData';
import { WEEKLY_SCHEDULE, DAYS_PER_WEEK, type DayType } from '@/game/constants';

/**
 * Get the DayType for a 1-based day number.
 * Days repeat every DAYS_PER_WEEK.
 */
export function getDayType(day: number): DayType {
  const index = ((day - 1) % DAYS_PER_WEEK + DAYS_PER_WEEK) % DAYS_PER_WEEK;
  return WEEKLY_SCHEDULE[index];
}

/**
 * Whether the given day is a ceremony day (day 7 of each week).
 */
export function isCeremonyDay(day: number): boolean {
  return getDayType(day) === 'ceremony';
}

/** Maps each DayType to the EventTypes available that day. */
const DAY_TYPE_EVENTS: Record<DayType, EventType[]> = {
  arrival: ['arrival', 'social'],
  free: ['social', 'date', 'challenge'],
  challenge: ['challenge', 'social'],
  date: ['date', 'social'],
  drama: ['drama', 'social'],
  ceremony: [],
};

/**
 * Return the list of EventTypes that can occur on the given day.
 */
export function getAvailableEventTypes(day: number): EventType[] {
  return DAY_TYPE_EVENTS[getDayType(day)];
}

/**
 * Produce a human-readable label such as "Week 1, Day 3".
 */
export function getDayLabel(day: number, week: number): string {
  return `Week ${week}, Day ${day}`;
}
