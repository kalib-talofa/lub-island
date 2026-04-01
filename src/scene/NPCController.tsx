"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { STARTING_CAST } from "@/characters/roster";
import { ZONE_POSITIONS } from "@/scene/IslandEnvironment";
import { useRelationshipStore } from "@/store/relationshipStore";
import { playerPositionRef } from "@/scene/PlayerController";
import { PLAYER } from "@/game/constants";
import type { AnimalSpecies } from "@/characters/CharacterData";

// ---------------------------------------------------------------------------
// Zone name mapping: character preferredZone -> ZONE_POSITIONS key
// ---------------------------------------------------------------------------

const ZONE_KEY_MAP: Record<string, string> = {
  Beach: "beach",
  Villa: "villa",
  Garden: "garden",
  "Challenge Arena": "arena",
  Jungle: "jungle",
  Dock: "dock",
  Lookout: "lookout",
};

/**
 * Per-NPC offsets from zone centres so they don't spawn inside structures
 * (e.g. Rosie was landing inside the Garden fountain).
 * Key = character id → [dx, dz] offset from zone centre.
 */
const NPC_ZONE_OFFSETS: Record<string, [number, number]> = {
  rosie:    [ 3.0,  0.0], // Garden — beside the east bench, clear of fountain
  blaze:    [-1.5,  2.0], // Arena  — edge of the ring
  pudge:    [ 3.0,  6.0], // Villa  — front yard, off to the side of the door
  kiki:     [-2.0,  1.0], // Beach  — next to a beach chair
  sprocket: [ 2.0,  0.5], // Beach  — in front of umbrella
  lily:     [-0.5,  2.0], // Jungle — on the trail, clear of trees
};

/** Module-level ref: current NPC world positions (updated when placements change) */
export const npcPositionsRef: { current: Record<string, [number, number, number]> } = {
  current: {},
};

/** Module-level ref: NPCs currently within interaction radius of the player */
export const nearbyNPCsRef: { current: Array<{ id: string; name: string }> } = {
  current: [],
};

function getZonePosition(preferredZone: string, npcId?: string): [number, number, number] {
  const key = ZONE_KEY_MAP[preferredZone] ?? preferredZone.toLowerCase();
  const base = ZONE_POSITIONS[key] ?? [0, 0, 0];
  const offset = npcId ? NPC_ZONE_OFFSETS[npcId] : undefined;
  if (offset) {
    return [base[0] + offset[0], base[1], base[2] + offset[1]];
  }
  return base;
}

// ---------------------------------------------------------------------------
// Species colour / feature config
// ---------------------------------------------------------------------------

interface SpeciesConfig {
  bodyColor: string;
  headColor: string;
  secondaryColor?: string;
}

const SPECIES_CONFIGS: Record<string, SpeciesConfig> = {
  rabbit: { bodyColor: "#F4A6C0", headColor: "#F4A6C0" }, // pink
  fox: { bodyColor: "#E87A20", headColor: "#E87A20" }, // orange
  bear: { bodyColor: "#8B5E3C", headColor: "#8B5E3C" }, // brown
  cat: { bodyColor: "#2A2A2A", headColor: "#2A2A2A" }, // black
  penguin: { bodyColor: "#1A1A1A", headColor: "#1A1A1A", secondaryColor: "#EEEEEE" }, // black/white
  frog: { bodyColor: "#3CB043", headColor: "#3CB043" }, // green
};

// ---------------------------------------------------------------------------
// Deterministic hash for balanced NPCs (night visibility 50/50)
// ---------------------------------------------------------------------------

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// ---------------------------------------------------------------------------
// NPCCharacter - reusable sub-component per species
// ---------------------------------------------------------------------------

interface NPCCharacterProps {
  species: AnimalSpecies;
  bodyColor?: string;
}

function NPCCharacter({ species, bodyColor }: NPCCharacterProps) {
  const config = SPECIES_CONFIGS[species] ?? SPECIES_CONFIGS.rabbit;
  const color = bodyColor ?? config.bodyColor;

  const earGeometry = useMemo(() => {
    if (species === "rabbit") {
      // Long cone ears
      const geo = new THREE.ConeGeometry(0.08, 0.5, 8);
      geo.translate(0, 0.25, 0);
      return geo;
    }
    if (species === "fox") {
      // Pointed triangle ears
      const geo = new THREE.ConeGeometry(0.12, 0.3, 4);
      geo.translate(0, 0.15, 0);
      return geo;
    }
    if (species === "bear") {
      // Round small ears (sphere)
      return null; // rendered separately
    }
    if (species === "cat") {
      // Pointed small ears
      const geo = new THREE.ConeGeometry(0.08, 0.2, 4);
      geo.translate(0, 0.1, 0);
      return geo;
    }
    return null;
  }, [species]);

  return (
    <group>
      {/* Body - cylinder */}
      <mesh castShadow position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.6, 12]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>

      {/* Penguin white belly */}
      {species === "penguin" && (
        <mesh position={[0, 0.45, 0.08]}>
          <cylinderGeometry args={[0.18, 0.22, 0.55, 12]} />
          <meshStandardMaterial color={config.secondaryColor ?? "#EEEEEE"} roughness={0.85} />
        </mesh>
      )}

      {/* Head - sphere */}
      <mesh castShadow position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.25, 12, 10]} />
        <meshStandardMaterial
          color={species === "penguin" ? "#1A1A1A" : color}
          roughness={0.85}
        />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.08, 0.98, 0.22]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>
      <mesh position={[0.08, 0.98, 0.22]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>

      {/* Species-specific features */}

      {/* Rabbit: long cone ears */}
      {species === "rabbit" && earGeometry && (
        <>
          <mesh position={[-0.1, 1.2, 0]} rotation={[0, 0, 0.15]} geometry={earGeometry}>
            <meshStandardMaterial color={color} roughness={0.85} />
          </mesh>
          <mesh position={[0.1, 1.2, 0]} rotation={[0, 0, -0.15]} geometry={earGeometry}>
            <meshStandardMaterial color={color} roughness={0.85} />
          </mesh>
        </>
      )}

      {/* Fox: pointed triangle ears */}
      {species === "fox" && earGeometry && (
        <>
          <mesh position={[-0.15, 1.18, 0]} rotation={[0, 0, 0.2]} geometry={earGeometry}>
            <meshStandardMaterial color={color} roughness={0.85} />
          </mesh>
          <mesh position={[0.15, 1.18, 0]} rotation={[0, 0, -0.2]} geometry={earGeometry}>
            <meshStandardMaterial color={color} roughness={0.85} />
          </mesh>
        </>
      )}

      {/* Bear: round small sphere ears */}
      {species === "bear" && (
        <>
          <mesh position={[-0.2, 1.15, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color={color} roughness={0.85} />
          </mesh>
          <mesh position={[0.2, 1.15, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color={color} roughness={0.85} />
          </mesh>
        </>
      )}

      {/* Cat: pointed small ears */}
      {species === "cat" && earGeometry && (
        <>
          <mesh position={[-0.14, 1.18, 0]} rotation={[0, 0, 0.2]} geometry={earGeometry}>
            <meshStandardMaterial color={color} roughness={0.85} />
          </mesh>
          <mesh position={[0.14, 1.18, 0]} rotation={[0, 0, -0.2]} geometry={earGeometry}>
            <meshStandardMaterial color={color} roughness={0.85} />
          </mesh>
        </>
      )}

      {/* Penguin: small wings (flattened boxes) */}
      {species === "penguin" && (
        <>
          <mesh position={[-0.35, 0.45, 0]} rotation={[0, 0, 0.3]} scale={[0.08, 0.3, 0.15]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#1A1A1A" roughness={0.85} />
          </mesh>
          <mesh position={[0.35, 0.45, 0]} rotation={[0, 0, -0.3]} scale={[0.08, 0.3, 0.15]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#1A1A1A" roughness={0.85} />
          </mesh>
        </>
      )}

      {/* Frog: big sphere eyes on top of head */}
      {species === "frog" && (
        <>
          <mesh position={[-0.14, 1.2, 0.05]}>
            <sphereGeometry args={[0.12, 10, 10]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
          </mesh>
          <mesh position={[0.14, 1.2, 0.05]}>
            <sphereGeometry args={[0.12, 10, 10]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
          </mesh>
          {/* Pupils */}
          <mesh position={[-0.14, 1.22, 0.16]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#1A1A1A" />
          </mesh>
          <mesh position={[0.14, 1.22, 0.16]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#1A1A1A" />
          </mesh>
        </>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Single NPC wrapper: handles idle animation, facing, interaction
// ---------------------------------------------------------------------------

interface SingleNPCProps {
  npcId: string;
  name: string;
  species: AnimalSpecies;
  bodyColor?: string;
  position: [number, number, number];
  onInteract: (npcId: string) => void;
}

function SingleNPC({ npcId, name, species, bodyColor, position, onInteract }: SingleNPCProps) {
  const groupRef = useRef<THREE.Group>(null);
  const idlePhase = useRef(simpleHash(npcId) % 1000); // stagger idle
  const wasNearby = useRef(false);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // --- Idle animation: gentle Y rotation oscillation + hover bob ---
    idlePhase.current += delta;
    const rotOscillation = Math.sin(idlePhase.current * 0.8) * 0.3;
    const bobY = Math.sin(idlePhase.current * 1.5) * 0.04;

    // --- Distance to player ---
    const dx = playerPositionRef.current.x - position[0];
    const dz = playerPositionRef.current.z - position[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    const isNearby = dist < PLAYER.INTERACTION_RADIUS;

    // --- Face toward player when nearby ---
    if (isNearby) {
      const angleToPlayer = Math.atan2(dx, dz);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        angleToPlayer,
        0.1,
      );
    } else {
      groupRef.current.rotation.y = rotOscillation;
    }

    // Position with bob
    groupRef.current.position.set(position[0], position[1] + bobY, position[2]);

    // --- Enter/exit interaction radius ---
    if (isNearby && !wasNearby.current) {
      // Player just entered radius - could trigger interaction prompt
    }
    wasNearby.current = isNearby;
  });

  // Check proximity for interaction bubble rendering (done in useFrame,
  // but for the declarative bubble we rely on a ref that the frame loop sets).
  const interactionRef = useRef(false);

  useFrame(() => {
    const dx = playerPositionRef.current.x - position[0];
    const dz = playerPositionRef.current.z - position[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    interactionRef.current = dist < PLAYER.INTERACTION_RADIUS;

    // We show/hide the bubble group directly for performance
    if (bubbleRef.current) {
      bubbleRef.current.visible = interactionRef.current;
    }
  });

  const bubbleRef = useRef<THREE.Group>(null);

  const handleClick = () => {
    // Only interact when nearby
    const dx = playerPositionRef.current.x - position[0];
    const dz = playerPositionRef.current.z - position[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < PLAYER.INTERACTION_RADIUS) {
      onInteract(npcId);
    }
  };

  return (
    <group ref={groupRef} position={position} onClick={handleClick}>
      <NPCCharacter species={species} bodyColor={bodyColor} />

      {/* Name tag above head */}
      <Text
        position={[0, 1.55, 0]}
        fontSize={0.18}
        color="#FFFFFF"
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {name}
      </Text>

      {/* Interaction bubble - white sphere with "!" */}
      <group ref={bubbleRef} visible={false}>
        <mesh position={[0, 1.9, 0]}>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        <Text
          position={[0, 1.9, 0.23]}
          fontSize={0.40}
          color="#FF2222"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          !
        </Text>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// NPCController - renders all active NPCs
// ---------------------------------------------------------------------------

interface NPCControllerProps {
  isNight: boolean;
  onNPCInteract: (npcId: string) => void;
}

export default function NPCController({ isNight, onNPCInteract }: NPCControllerProps) {
  const eliminated = useRelationshipStore((s) => s.eliminated);

  // Compute NPC placements, filtering eliminated and applying night logic
  const npcPlacements = useMemo(() => {
    const beachPos = ZONE_POSITIONS["beach"] ?? [0, 0, 16];

    return STARTING_CAST.filter((c) => !eliminated.includes(c.id)).map((character) => {
      const dayPos = getZonePosition(character.preferredZone, character.id);
      let finalPos: [number, number, number] = dayPos;
      let visible = true;

      if (isNight) {
        switch (character.activityPreference) {
          case "early_bird":
            // Sleeping - hidden at night
            visible = false;
            break;
          case "night_owl":
            // Move to beach (bonfire area)
            finalPos = [
              beachPos[0] + (simpleHash(character.id) % 5) - 2,
              beachPos[1],
              beachPos[2] + (simpleHash(character.id + "z") % 5) - 2,
            ];
            break;
          case "balanced":
            // 50/50 based on deterministic seed
            if (simpleHash(character.id) % 2 === 0) {
              // Visible at bonfire
              finalPos = [
                beachPos[0] + (simpleHash(character.id + "bx") % 5) - 2,
                beachPos[1],
                beachPos[2] + (simpleHash(character.id + "bz") % 5) - 2,
              ];
            } else {
              // Sleeping
              visible = false;
            }
            break;
        }
      }

      return {
        id: character.id,
        name: character.name,
        species: character.species,
        bodyColor: character.colorPalette.primary === "black" ? "#2A2A2A" : undefined,
        position: finalPos,
        visible,
      };
    });
  }, [isNight, eliminated]);

  // Keep the module-level positions ref in sync
  useMemo(() => {
    const positions: Record<string, [number, number, number]> = {};
    for (const npc of npcPlacements) {
      if (npc.visible) positions[npc.id] = npc.position;
    }
    npcPositionsRef.current = positions;
  }, [npcPlacements]);

  // Track which NPCs are within interaction radius of the player each frame
  const visibleNPCs = useMemo(
    () => npcPlacements.filter((n) => n.visible),
    [npcPlacements],
  );
  const visibleNPCsRef = useRef(visibleNPCs);
  visibleNPCsRef.current = visibleNPCs;

  useFrame(() => {
    const nearby: Array<{ id: string; name: string }> = [];
    for (const npc of visibleNPCsRef.current) {
      const dx = playerPositionRef.current.x - npc.position[0];
      const dz = playerPositionRef.current.z - npc.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < PLAYER.INTERACTION_RADIUS) {
        nearby.push({ id: npc.id, name: npc.name });
      }
    }
    nearbyNPCsRef.current = nearby;
  });

  return (
    <>
      {npcPlacements
        .filter((npc) => npc.visible)
        .map((npc) => (
          <SingleNPC
            key={npc.id}
            npcId={npc.id}
            name={npc.name}
            species={npc.species}
            bodyColor={npc.bodyColor}
            position={npc.position}
            onInteract={onNPCInteract}
          />
        ))}
    </>
  );
}
