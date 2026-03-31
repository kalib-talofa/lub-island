'use strict';

import type { Character } from '@/characters/CharacterData';
import { RELATIONSHIP, CEREMONY } from '@/game/constants';

type RelationshipTier = 'hostile' | 'cold' | 'neutral' | 'warm' | 'close' | 'romantic';

/**
 * Map a raw relationship value (-100..100) to a named tier.
 */
export function getRelationshipTier(value: number): RelationshipTier {
  if (value <= -50) return 'hostile';
  if (value <= -20) return 'cold';
  if (value <= 20) return 'neutral';
  if (value <= 50) return 'warm';
  if (value <= 80) return 'close';
  return 'romantic';
}

const TIER_LABELS: Record<RelationshipTier, string> = {
  hostile: 'Hostile',
  cold: 'Cold',
  neutral: 'Neutral',
  warm: 'Warm',
  close: 'Close',
  romantic: 'Romantic',
};

/**
 * Human-readable label for a relationship value.
 */
export function getRelationshipLabel(value: number): string {
  return TIER_LABELS[getRelationshipTier(value)];
}

/**
 * An NPC picks a partner from a list of candidates.
 *
 * The score for each candidate is:
 *   relationship value
 * + personality compatibility bonus  (0..20)
 * + random factor                    (scaled by CEREMONY constants)
 *
 * Returns the id of the chosen candidate.
 */
export function calculateNPCChoice(
  npc: Character,
  candidates: Character[],
  relationships: Record<string, number>,
): string {
  if (candidates.length === 0) {
    throw new Error('calculateNPCChoice called with no candidates');
  }

  let bestId: string = candidates[0].id;
  let bestScore = -Infinity;

  for (const candidate of candidates) {
    const relValue = relationships[candidate.id] ?? 0;

    // Personality compatibility: compare averaged trait distance
    const compat = computePersonalityCompat(npc, candidate);

    // Random factor between CEREMONY.RANDOM_FACTOR_MIN and MAX, scaled to 0..20
    const randomRange = CEREMONY.RANDOM_FACTOR_MAX - CEREMONY.RANDOM_FACTOR_MIN;
    const randomFactor =
      (CEREMONY.RANDOM_FACTOR_MIN + Math.random() * randomRange) *
      (RELATIONSHIP.MAX - RELATIONSHIP.MIN);

    const score = relValue + compat + randomFactor;

    if (score > bestScore) {
      bestScore = score;
      bestId = candidate.id;
    }
  }

  return bestId;
}

/**
 * Compute a 0..20 compatibility bonus based on how similar two characters'
 * personality profiles are (lower distance = higher bonus).
 */
function computePersonalityCompat(a: Character, b: Character): number {
  const pa = a.personality;
  const pb = b.personality;

  const diffs = [
    Math.abs(pa.extroversion - pb.extroversion),
    Math.abs(pa.agreeableness - pb.agreeableness),
    Math.abs(pa.confidence - pb.confidence),
    Math.abs(pa.humor - pb.humor),
    Math.abs(pa.loyalty - pb.loyalty),
  ];

  // Average difference 0..100 -> normalised 0..1 -> inverted -> scaled to 0..20
  const avgDiff = diffs.reduce((sum, d) => sum + d, 0) / diffs.length;
  const similarity = 1 - avgDiff / 100;
  return similarity * 20;
}
