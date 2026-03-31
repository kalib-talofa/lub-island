'use strict';

import type { ItemDef } from '@/characters/CharacterData';
import { STARTING_CAST } from '@/characters/roster';

// ---------------------------------------------------------------------------
// Core item definitions
// ---------------------------------------------------------------------------

export const ITEM_DEFS: ItemDef[] = [
  {
    id: 'flowers',
    name: 'Flowers',
    description: 'A bright bouquet of tropical flowers. Give them to someone special.',
    effect: 'gift_relationship',
    effectValue: 15,
    spawnZones: ['Garden'],
    rarity: 'common',
    giftValue: 15,
    consumeOnUse: true,
  },
  {
    id: 'chocolate',
    name: 'Chocolate',
    description: 'Rich island chocolate. Gift it to boost a relationship, or eat it yourself to restore energy.',
    effect: 'energy_restore',
    effectValue: 25,
    spawnZones: ['Beach', 'Villa'],
    rarity: 'common',
    giftValue: 10,
    consumeOnUse: true,
  },
  {
    id: 'book',
    name: 'Book',
    description: 'A well-thumbed paperback. Read it to boost performance for the day, or gift it.',
    effect: 'performance_boost',
    effectValue: 15,
    spawnZones: ['Lookout'],
    rarity: 'uncommon',
    giftValue: 10,
    consumeOnUse: true,
  },
  {
    id: 'sunglasses',
    name: 'Sunglasses',
    description: 'A stylish pair of sunglasses. Wear them to boost performance, or gift them.',
    effect: 'performance_boost',
    effectValue: 10,
    spawnZones: ['Beach'],
    rarity: 'uncommon',
    giftValue: 5,
    consumeOnUse: true,
  },
  {
    id: 'producer_phone',
    name: "Producer's Phone",
    description: 'A secret phone to call the producer and choose tomorrow\'s headline event.',
    effect: 'producer_phone',
    effectValue: 0,
    spawnZones: ['Jungle'],
    rarity: 'rare',
    giftValue: 0,
    consumeOnUse: true,
  },
];

// ---------------------------------------------------------------------------
// Per-NPC character journals — spawn near their preferred zone
// ---------------------------------------------------------------------------

export const JOURNAL_DEFS: ItemDef[] = STARTING_CAST.map((npc) => ({
  id: `journal_${npc.id}`,
  name: `${npc.name}'s Journal`,
  description: `A worn leather journal with ${npc.name}'s private thoughts. Read it to unlock a special dialogue option.`,
  effect: 'reveal_info' as const,
  effectValue: 0,
  spawnZones: [npc.preferredZone],
  rarity: 'uncommon' as const,
  ownerNpcId: npc.id,
  giftValue: 0,
  consumeOnUse: false, // reusable until end of day
}));

/** All items including journals */
export const ALL_ITEMS: ItemDef[] = [...ITEM_DEFS, ...JOURNAL_DEFS];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Return every item that can spawn in the given zone. */
export function getItemsForZone(zone: string): ItemDef[] {
  return ALL_ITEMS.filter((item) =>
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

  return candidates[candidates.length - 1];
}

/** Get an item definition by id */
export function getItemById(id: string): ItemDef | undefined {
  return ALL_ITEMS.find((item) => item.id === id);
}

// ---------------------------------------------------------------------------
// Nightly item drops
// ---------------------------------------------------------------------------

const ZONES_FOR_DROPS = ['Beach', 'Villa', 'Garden', 'Jungle', 'Lookout', 'Challenge Arena', 'Dock'];

export interface DroppedItem {
  item: ItemDef;
  position: [number, number, number];
}

/**
 * Generate random item drops for the night.
 * Returns 2-4 items scattered across the island.
 * Journals bias toward their owner's preferred zone.
 */
export function generateNightlyDrops(zonePositions: Record<string, [number, number, number]>): DroppedItem[] {
  const count = 2 + Math.floor(Math.random() * 3); // 2-4 items
  const drops: DroppedItem[] = [];
  const usedIds = new Set<string>();

  for (let i = 0; i < count; i++) {
    // 30% chance of journal, 70% chance of regular item
    let item: ItemDef | null = null;

    if (Math.random() < 0.3 && JOURNAL_DEFS.length > 0) {
      // Pick a random journal
      const journal = JOURNAL_DEFS[Math.floor(Math.random() * JOURNAL_DEFS.length)];
      if (!usedIds.has(journal.id)) {
        item = journal;
      }
    }

    if (!item) {
      // Pick from a random zone
      const zone = ZONES_FOR_DROPS[Math.floor(Math.random() * ZONES_FOR_DROPS.length)];
      const candidates = ITEM_DEFS.filter(it => !usedIds.has(it.id) || it.rarity === 'common');
      if (candidates.length > 0) {
        item = candidates[Math.floor(Math.random() * candidates.length)];
      }
    }

    if (!item) continue;
    usedIds.add(item.id);

    // Place near the relevant zone
    const spawnZone = item.spawnZones[0] ?? 'Beach';
    const zoneKey = spawnZone.toLowerCase().replace(' ', '_');
    // Try various zone key formats
    const base = zonePositions[zoneKey]
      ?? zonePositions[spawnZone.toLowerCase()]
      ?? zonePositions['beach']
      ?? [0, 0, 16];

    const offsetX = (Math.random() - 0.5) * 6;
    const offsetZ = (Math.random() - 0.5) * 6;

    drops.push({
      item,
      position: [base[0] + offsetX, 0.3, base[2] + offsetZ],
    });
  }

  return drops;
}
