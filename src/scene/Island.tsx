"use client";

import IsometricCamera from "@/scene/IsometricCamera";
import DayNightCycle from "@/scene/DayNightCycle";
import IslandEnvironment from "@/scene/IslandEnvironment";
import RainSystem from "@/scene/RainSystem";
import RaceField from "@/scene/RaceField";
import VillaInterior from "@/scene/VillaInterior";
import CaveInterior from "@/scene/CaveInterior";
import DockInterior from "@/scene/DockInterior";
import PlayerController from "@/scene/PlayerController";
import NPCController from "@/scene/NPCController";
import ItemPickups from "@/scene/ItemPickups";
import { useGameStore } from "@/store/gameStore";
import { useRelationshipStore } from "@/store/relationshipStore";
import { STARTING_CAST } from "@/characters/roster";
import type { DroppedItem } from "@/systems/items";
import { useMemo } from "react";

// ---------------------------------------------------------------------------
// Island - root R3F scene component that assembles the 3D world
// ---------------------------------------------------------------------------

// Simple deterministic hash (matches NPCController)
function simpleHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

interface IslandProps {
  onNPCInteract: (npcId: string) => void;
  onBedInteract?: (npcId: string, isSleeping: boolean) => void;
  onLockedStructure?: (key: string) => void;
  droppedItems?: DroppedItem[];
  onItemPickup?: (dropId: string) => void;
}

export default function Island({ onNPCInteract, onBedInteract, onLockedStructure, droppedItems = [], onItemPickup }: IslandProps) {
  const phase = useGameStore((s) => s.phase);
  const isNight = useGameStore((s) => s.isNight);
  const isRainy = useGameStore((s) => s.isRainy);
  const isIndoors = useGameStore((s) => s.isIndoors);
  const indoorLocation = useGameStore((s) => s.indoorLocation);
  const eliminated = useRelationshipStore((s) => s.eliminated);

  // Lock player movement during events, dialogue, ceremony, etc.
  const movementLocked = phase !== "DAYTIME_FREE" && phase !== "NIGHTTIME_FREE";

  // Determine which NPCs are sleeping (same logic as NPCController)
  const sleepingNPCs = useMemo(() => {
    if (!isNight) return [];
    return STARTING_CAST
      .filter(c => !eliminated.includes(c.id))
      .filter(c => {
        if (c.activityPreference === 'early_bird') return true;
        if (c.activityPreference === 'balanced') return simpleHash(c.id) % 2 !== 0;
        return false;
      })
      .map(c => c.id);
  }, [isNight, eliminated]);

  return (
    <>
      <IsometricCamera />

      {indoorLocation === 'villa' ? (
        <>
          {/* Villa interior scene */}
          <VillaInterior isNight={isNight} sleepingNPCs={sleepingNPCs} />
          <PlayerController position={[0, 0, 5.5]} isMovementLocked={movementLocked} isIndoors indoorLocation="villa" sleepingNPCs={sleepingNPCs} onBedInteract={onBedInteract} />
          {/* Indoor item pickups (journals near beds) */}
          {droppedItems.length > 0 && onItemPickup && (
            <ItemPickups
              drops={droppedItems.filter(d => d.isIndoors)}
              onPickup={onItemPickup}
            />
          )}
        </>
      ) : indoorLocation === 'cave' ? (
        <>
          {/* Cave interior scene */}
          <CaveInterior isNight={isNight} />
          <PlayerController position={[0, 0, 4.5]} isMovementLocked={movementLocked} isIndoors indoorLocation="cave" />
        </>
      ) : indoorLocation === 'dock' ? (
        <>
          {/* Dock interior scene */}
          <DockInterior isNight={isNight} />
          <PlayerController position={[0, 0, 3.5]} isMovementLocked={movementLocked} isIndoors indoorLocation="dock" />
          {/* Dock item pickups (daily chocolate) */}
          {droppedItems.length > 0 && onItemPickup && (
            <ItemPickups
              drops={droppedItems.filter(d => d.isIndoors)}
              onPickup={onItemPickup}
            />
          )}
        </>
      ) : (
        <>
          {/* Outdoor island scene */}
          <DayNightCycle isNight={isNight} isRainy={isRainy} />
          <IslandEnvironment isNight={isNight} />
          <RaceField />
          {isRainy && <RainSystem isNight={isNight} />}
          <PlayerController position={[0, 0, 6]} isMovementLocked={movementLocked} onLockedStructure={onLockedStructure} />
          <NPCController isNight={isNight} onNPCInteract={onNPCInteract} />
          {/* Outdoor item pickups */}
          {droppedItems.length > 0 && onItemPickup && (
            <ItemPickups
              drops={droppedItems.filter(d => !d.isIndoors)}
              onPickup={onItemPickup}
            />
          )}
        </>
      )}
    </>
  );
}
