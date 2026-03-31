"use client";

import IsometricCamera from "@/scene/IsometricCamera";
import DayNightCycle from "@/scene/DayNightCycle";
import IslandEnvironment from "@/scene/IslandEnvironment";
import PlayerController from "@/scene/PlayerController";
import NPCController from "@/scene/NPCController";
import ItemPickups from "@/scene/ItemPickups";
import { useGameStore } from "@/store/gameStore";
import type { DroppedItem } from "@/systems/items";

// ---------------------------------------------------------------------------
// Island - root R3F scene component that assembles the 3D world
// ---------------------------------------------------------------------------

interface IslandProps {
  onNPCInteract: (npcId: string) => void;
  droppedItems?: DroppedItem[];
  onItemPickup?: (index: number) => void;
}

export default function Island({ onNPCInteract, droppedItems = [], onItemPickup }: IslandProps) {
  const phase = useGameStore((s) => s.phase);
  const isNight = useGameStore((s) => s.isNight);

  // Lock player movement during events, dialogue, ceremony, etc.
  const movementLocked = phase !== "DAYTIME_FREE" && phase !== "NIGHTTIME_FREE";

  return (
    <>
      <IsometricCamera />
      <DayNightCycle isNight={isNight} />
      <IslandEnvironment isNight={isNight} />
      <PlayerController position={[0, 0, 5]} isMovementLocked={movementLocked} />
      <NPCController isNight={isNight} onNPCInteract={onNPCInteract} />
      {droppedItems.length > 0 && onItemPickup && (
        <ItemPickups drops={droppedItems} onPickup={onItemPickup} />
      )}
    </>
  );
}
