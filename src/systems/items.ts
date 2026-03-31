'use strict';

import type { ItemDef } from '@/characters/CharacterData';

export const ITEM_DEFS: ItemDef[] = [
  {
    id: 'producer_phone',
    name: "Producer's Phone",
    description:
      'A secret phone that lets you call the producer for inside information about the other islanders.',
    effect: 'producer_phone',
    effectValue: 0,
    spawnZones: ['Jungle'],
    rarity: 'rare',
  },
  {
    id: 'character_journal',
    name: 'Character Journal',
    description:
      'A worn leather journal containing personal notes about another islander. Reading it reveals hidden info.',
    effect: 'reveal_info',
    effectValue: 0,
    spawnZones: ['Villa'],
    rarity: 'uncommon',
  },
  {
    id: 'flowers',
    name: 'Flowers',
    description:
      'A bright bouquet of tropical flowers. Give them to someone to boost your relationship.',
    effect: 'gift_relationship',
    effectValue: 15,
    spawnZones: ['Garden'],
    rarity: 'common',
  },
  {
    id: 'chocolate',
    name: 'Chocolate',
    description:
      'Rich island chocolate. Gift it to boost a relationship, or eat it yourself to restore energy.',
    effect: 'gift_relationship',
    effectValue: 10,
    spawnZones: ['Beach', 'Villa'],
    rarity: 'common',
  },
  {
    id: 'book',
    name: 'Book',
    description:
      'A well-thumbed paperback found at the lookout. Reading it gives you something interesting to talk about.',
    effect: 'charm_boost',
    effectValue: 15,
    spawnZones: ['Lookout'],
    rarity: 'uncommon',
  },
  {
    id: 'sunglasses',
    name: 'Sunglasses',
    description: 'A stylish pair of sunglasses. Purely cosmetic, but you look great in them.',
    effect: 'cosmetic',
    effectValue: 0,
    spawnZones: ['Beach'],
    rarity: 'uncommon',
  },
];

/**
 * Return every item that can spawn in the given zone.
 */
export function getItemsForZone(zone: string): ItemDef[] {
  return ITEM_DEFS.filter((item) =>
    item.spawnZones.some((z) => z.toLowerCase() === zone.toLowerCase()),
  );
}

/** Rarity-based spawn weights. Higher = more likely to be picked. */
const RARITY_WEIGHT: Record<ItemDef['rarity'], number> = {
  common: 6,
  uncommon: 3,
  rare: 1,
};

/**
 * Pick a random item that can spawn in the given zone, weighted by rarity.
 * Returns null if no items exist for that zone.
 */
export function getRandomSpawnItem(zone: string): ItemDef | null {
  const candidates = getItemsForZone(zone);
  if (candidates.length === 0) return null;

  const totalWeight = candidates.reduce(
    (sum, item) => sum + RARITY_WEIGHT[item.rarity],
    0,
  );

  let roll = Math.random() * totalWeight;
  for (const item of candidates) {
    roll -= RARITY_WEIGHT[item.rarity];
    if (roll <= 0) return item;
  }

  // Fallback (shouldn't happen)
  return candidates[candidates.length - 1];
}
