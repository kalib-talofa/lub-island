'use strict';

import { COCONUT_CATCH, RELATIONSHIP } from '@/game/constants';

type ScoreTier = 'bronze' | 'silver' | 'gold';

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
