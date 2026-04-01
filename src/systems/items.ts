'use strict';

import type { ItemDef } from '@/characters/CharacterData';
import { STARTING_CAST } from '@/characters/roster';
import { BED_POSITIONS } from '@/scene/VillaInterior';

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
  spawnZones: [npc.preferredZone, 'Villa'],
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

/** Map display zone names → ZONE_POSITIONS keys */
const ZONE_KEY_MAP: Record<string, string> = {
  'Beach': 'beach',
  'Villa': 'villa',
  'Garden': 'garden',
  'Challenge Arena': 'arena',
  'Jungle': 'jungle',
  'Dock': 'dock',
  'Lookout': 'lookout',
};

/** Zones where items can drop — use open-area zones the player can easily walk to */
const ZONES_FOR_DROPS = ['beach', 'garden', 'arena', 'dock', 'lookout'];

const ISLAND_RADIUS = 19;

export interface DroppedItem {
  item: ItemDef;
  position: [number, number, number];
  /** If true, this item is inside the villa */
  isIndoors?: boolean;
}

/** Ensure a position is within the island circle and not too close to origin (villa). */
function clampToPlayableArea(x: number, z: number): [number, number] {
  const dist = Math.sqrt(x * x + z * z);
  if (dist > ISLAND_RADIUS) {
    const scale = ISLAND_RADIUS / dist;
    x *= scale;
    z *= scale;
  }
  return [x, z];
}

/**
 * Generate random item drops for the night.
 * Returns 2-4 items scattered across the island in open areas.
 */
export function generateNightlyDrops(zonePositions: Record<string, [number, number, number]>): DroppedItem[] {
  const count = 3 + Math.floor(Math.random() * 2); // guaranteed 3-4 items
  const drops: DroppedItem[] = [];
  const usedIds = new Set<string>();

  for (let i = 0; i < count; i++) {
    // 30% chance of journal, 70% chance of regular item
    let item: ItemDef | null = null;

    if (Math.random() < 0.3 && JOURNAL_DEFS.length > 0) {
      const journal = JOURNAL_DEFS[Math.floor(Math.random() * JOURNAL_DEFS.length)];
      if (!usedIds.has(journal.id)) {
        item = journal;
      }
    }

    if (!item) {
      // Common items are always eligible; non-common only if not already used
      const candidates = ITEM_DEFS.filter(it => it.rarity === 'common' || !usedIds.has(it.id));
      item = candidates[Math.floor(Math.random() * candidates.length)] ?? ITEM_DEFS[0];
    }
    usedIds.add(item.id);

    // Journals have a 50% chance of spawning near their NPC's bed inside the villa
    if (item.ownerNpcId && Math.random() < 0.5) {
      const bed = BED_POSITIONS.find(b => b.npcId === item.ownerNpcId);
      if (bed) {
        // Place near the bed with a small offset
        const bx = bed.position[0] + (Math.random() - 0.5) * 1.5;
        const bz = bed.position[2] + (Math.random() - 0.5) * 1.5;
        drops.push({
          item,
          position: [bx, 0.3, bz],
          isIndoors: true,
        });
        continue;
      }
    }

    // Pick a drop zone — prefer the item's spawn zone if it maps to a known key
    const preferredZone = item.spawnZones[0];
    const preferredKey = preferredZone ? ZONE_KEY_MAP[preferredZone] : undefined;
    const dropZoneKey = preferredKey && zonePositions[preferredKey]
      ? preferredKey
      : ZONES_FOR_DROPS[Math.floor(Math.random() * ZONES_FOR_DROPS.length)];

    const base = zonePositions[dropZoneKey] ?? zonePositions['beach'] ?? [0, 0, 16];

    // Offset from zone centre — keep modest so items land in the open
    const offsetX = (Math.random() - 0.5) * 5;
    const offsetZ = (Math.random() - 0.5) * 5;
    const [cx, cz] = clampToPlayableArea(base[0] + offsetX, base[2] + offsetZ);

    drops.push({
      item,
      position: [cx, 0.3, cz],
    });
  }

  return drops;
}
