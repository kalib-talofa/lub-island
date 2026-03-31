'use strict';

import { STAT_FLOOR, BIO_TARGETS } from '@/game/constants';

/** Clamp a value between min and max (inclusive). */
export function clamp(min: number, max: number, val: number): number {
  if (val < min) return min;
  if (val > max) return max;
  return val;
}

/**
 * Convert sleep data into an Energy stat (0-100, floored at STAT_FLOOR).
 *
 * sleepHours   : 0..BIO_TARGETS.SLEEP_HOURS_MAX  -> 0-70 contribution
 * sleepQuality : 0..100                           -> 0-30 contribution
 */
export function computeEnergy(sleepHours: number, sleepQuality: number): number {
  const hourRatio = clamp(0, 1, sleepHours / BIO_TARGETS.SLEEP_HOURS_MAX);
  const qualityRatio = clamp(0, 1, sleepQuality / 100);
  const raw = hourRatio * 70 + qualityRatio * 30;
  return clamp(STAT_FLOOR, 100, Math.round(raw));
}

/**
 * Convert active minutes into a Charm stat (0-100, floored at STAT_FLOOR).
 */
export function computeCharm(activeMinutes: number): number {
  const ratio = clamp(0, 1, activeMinutes / BIO_TARGETS.ACTIVE_MINUTES_MAX);
  const raw = ratio * 100;
  return clamp(STAT_FLOOR, 100, Math.round(raw));
}

/**
 * Convert step count into a Performance stat (0-100, floored at STAT_FLOOR).
 */
export function computePerformance(stepCount: number): number {
  const ratio = clamp(0, 1, stepCount / BIO_TARGETS.STEPS_MAX);
  const raw = ratio * 100;
  return clamp(STAT_FLOOR, 100, Math.round(raw));
}
