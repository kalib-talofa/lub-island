import { NPC_ZONE_UNLOCKS, UNLOCKABLE_STRUCTURES } from '@/game/constants';

/** Base zones that are always visible regardless of NPC arrivals. */
const BASE_ZONES = ['villa', 'beach'];

/**
 * Check if a zone is currently unlocked (visible on the island).
 * Base zones are always unlocked; others require their associated NPC to have arrived.
 */
export function isZoneUnlocked(zoneKey: string, arrivedNPCIds: string[]): boolean {
  if (BASE_ZONES.includes(zoneKey)) return true;
  const npcId = Object.entries(NPC_ZONE_UNLOCKS).find(([, zone]) => zone === zoneKey)?.[0];
  if (!npcId) return true; // unknown zones default to unlocked
  return arrivedNPCIds.includes(npcId);
}

/**
 * Check if a lockable structure (dock, cave) is currently unlocked.
 * Compares the current week/day against the structure's unlock schedule.
 */
export function isStructureUnlocked(key: string, week: number, day: number): boolean {
  const struct = UNLOCKABLE_STRUCTURES[key];
  if (!struct) return true;
  if (week > struct.week) return true;
  if (week === struct.week && day >= struct.day) return true;
  return false;
}

/**
 * Get the lock message for a structure (shown in popup when player approaches).
 */
export function getStructureLockMessage(key: string): string {
  const struct = UNLOCKABLE_STRUCTURES[key];
  if (!struct) return 'This area is locked.';
  return `Under construction! This will unlock on Week ${struct.week}, Day ${struct.day}.`;
}

/**
 * Get all currently unlocked zone keys.
 */
export function getUnlockedZones(arrivedNPCIds: string[]): string[] {
  const zones = [...BASE_ZONES];
  for (const [npcId, zone] of Object.entries(NPC_ZONE_UNLOCKS)) {
    if (arrivedNPCIds.includes(npcId)) zones.push(zone);
  }
  return zones;
}
