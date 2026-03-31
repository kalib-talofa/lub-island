'use strict';

import { ENERGY_COSTS } from '@/game/constants';

type EnergyCostKey = keyof typeof ENERGY_COSTS;

/**
 * Check whether the player can afford an energy cost.
 */
export function canAfford(currentEnergy: number, cost: number): boolean {
  return currentEnergy >= cost;
}

/**
 * Spend energy and return the new value.
 * Throws if the player cannot afford the cost.
 */
export function spendEnergy(currentEnergy: number, cost: number): number {
  if (!canAfford(currentEnergy, cost)) {
    throw new Error(
      `Not enough energy: have ${currentEnergy}, need ${cost}`,
    );
  }
  return currentEnergy - cost;
}

/** Map from human-readable action strings to ENERGY_COSTS keys. */
const ACTION_KEY_MAP: Record<string, EnergyCostKey> = {
  challenge: 'CHALLENGE_EVENT',
  challenge_event: 'CHALLENGE_EVENT',
  date: 'DATE_EVENT',
  date_event: 'DATE_EVENT',
  social: 'SOCIAL_EVENT',
  social_event: 'SOCIAL_EVENT',
  talk_day: 'TALK_NPC_DAY',
  talk_npc_day: 'TALK_NPC_DAY',
  pick_up_item: 'PICK_UP_ITEM',
  pickup: 'PICK_UP_ITEM',
  producer_phone: 'PRODUCER_PHONE',
  talk_night: 'TALK_NPC_NIGHT',
  talk_npc_night: 'TALK_NPC_NIGHT',
  walk: 'WALK',
};

/**
 * Look up the energy cost for a named action string.
 * Throws if the action is unrecognised.
 */
export function getEnergyCostForAction(action: string): number {
  const key = ACTION_KEY_MAP[action.toLowerCase()];
  if (key === undefined) {
    throw new Error(`Unknown action: "${action}"`);
  }
  return ENERGY_COSTS[key];
}

const LOW_ENERGY_THRESHOLD = 20;
const CRITICAL_ENERGY_THRESHOLD = 10;

/**
 * Return a warning string when energy is dangerously low, or null if fine.
 */
export function getEnergyWarning(currentEnergy: number): string | null {
  if (currentEnergy <= CRITICAL_ENERGY_THRESHOLD) {
    return 'Your energy is critically low! You should rest soon.';
  }
  if (currentEnergy <= LOW_ENERGY_THRESHOLD) {
    return 'Your energy is running low. Consider saving it for important events.';
  }
  return null;
}
