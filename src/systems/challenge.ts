'use strict';

import { COCONUT_CATCH, RELATIONSHIP, EGG_RACE } from '@/game/constants';

export type ScoreTier = 'bronze' | 'silver' | 'gold';

/**
 * Calculate how fast coconuts fall based on the player's Performance stat.
 * Higher performance = slower fall speed (easier to catch).
 */
export function getCoconutFallSpeed(performance: number): number {
  return Math.max(
    0.5,
    COCONUT_CATCH.BASE_FALL_SPEED -
      performance * COCONUT_CATCH.PERFORMANCE_SPEED_MODIFIER,
  );
}

/**
 * Calculate the catch radius based on the player's Performance stat.
 * Higher performance = wider catch zone.
 */
export function getCatchRadius(performance: number): number {
  return (
    COCONUT_CATCH.BASE_CATCH_RADIUS +
    performance * COCONUT_CATCH.PERFORMANCE_RADIUS_MODIFIER
  );
}

/**
 * Determine the tier earned from a coconut-catch score.
 */
export function getScoreTier(score: number): ScoreTier {
  if (score >= COCONUT_CATCH.GOLD_THRESHOLD) return 'gold';
  if (score >= COCONUT_CATCH.SILVER_THRESHOLD) return 'silver';
  return 'bronze';
}

/**
 * Return the relationship reward points for a given score tier.
 */
export function getRelationshipReward(tier: ScoreTier): number {
  switch (tier) {
    case 'gold':
      return RELATIONSHIP.CHALLENGE_GOLD;
    case 'silver':
      return RELATIONSHIP.CHALLENGE_SILVER;
    case 'bronze':
      return RELATIONSHIP.CHALLENGE_BRONZE;
  }
}

// ---------------------------------------------------------------------------
// Egg Spoon Race helpers
// ---------------------------------------------------------------------------

/** Tier earned from egg spoon race. */
export function getEggRaceTier(eggsDelivered: number): ScoreTier {
  if (eggsDelivered >= EGG_RACE.GOLD_EGGS) return 'gold';
  if (eggsDelivered >= EGG_RACE.SILVER_EGGS) return 'silver';
  return 'bronze';
}

/**
 * Player drop chance.
 * sabotage = guaranteed drop; best = clamped probability based on relationship.
 */
export function getPlayerDropChance(relationship: number, intent: 'best' | 'sabotage'): number {
  if (intent === 'sabotage') return 1.0;
  return Math.max(
    EGG_RACE.PLAYER_DROP_MIN,
    EGG_RACE.PLAYER_DROP_BASE - relationship * EGG_RACE.PLAYER_DROP_FACTOR,
  );
}

/** Partner (NPC) drop chance — decreases with relationship. */
export function getPartnerDropChance(relationship: number): number {
  return Math.max(
    EGG_RACE.PARTNER_DROP_MIN,
    EGG_RACE.PARTNER_DROP_BASE - relationship * EGG_RACE.PARTNER_DROP_FACTOR,
  );
}
