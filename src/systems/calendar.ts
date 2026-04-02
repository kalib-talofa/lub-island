'use strict';

import type { EventType } from '@/characters/CharacterData';
import { getDaysInWeek, getWeekSchedule, type DayType } from '@/game/constants';

/**
 * Get the DayType for a 1-based day number within a given week.
 */
export function getDayType(day: number, week = 2): DayType {
  const schedule = getWeekSchedule(week);
  const index = Math.min(day - 1, schedule.length - 1);
  return schedule[Math.max(0, index)];
}

/**
 * Whether the given day is a ceremony day (last day of the week).
 */
export function isCeremonyDay(day: number, week = 2): boolean {
  return day >= getDaysInWeek(week);
}

/**
 * Whether the given day is a free day (no events, just roam).
 * Week 1: no free days (Day 3 still has events).
 * Week 2+: Day 5 is the free day.
 */
export function isFreeRoamDay(day: number, week: number): boolean {
  if (week === 1) return false;
  return day === getDaysInWeek(week) - 1; // day before ceremony
}

/** Maps each DayType to the EventTypes available that day. */
const DAY_TYPE_EVENTS: Record<DayType, EventType[]> = {
  arrival: ['arrival', 'social'],
  free: ['social', 'date', 'challenge', 'drama'],
  challenge: ['challenge', 'social'],
  date: ['date', 'social'],
  drama: ['drama', 'social'],
  ceremony: [],
};

/**
 * Return the list of EventTypes that can occur on the given day.
 */
export function getAvailableEventTypes(day: number, week = 2): EventType[] {
  return DAY_TYPE_EVENTS[getDayType(day, week)];
}

/**
 * Produce a human-readable label such as "Week 1, Day 3".
 */
export function getDayLabel(day: number, week: number): string {
  return `Week ${week}, Day ${day}`;
}
