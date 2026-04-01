"use client";

import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PLAYER } from "@/game/constants";
import { ZONE_POSITIONS } from "@/scene/IslandEnvironment";
import { VILLA_INTERIOR, BED_POSITIONS } from "@/scene/VillaInterior";
import { useGameStore } from "@/store/gameStore";

// ---------------------------------------------------------------------------
// Module-level refs for cross-component communication
// ---------------------------------------------------------------------------

export const playerPositionRef = { current: new THREE.Vector3(0, 0, 0) };
export const playerTargetRef = { current: new THREE.Vector3(0, 0, 0) };
export const joystickInputRef = {
  current: { x: 0, y: 0, active: false },
};

// ---------------------------------------------------------------------------
// WASD keyboard input (module-level so it works alongside the joystick)
// ---------------------------------------------------------------------------

const keysDown = new Set<string>();

if (typeof window !== "undefined") {
  window.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if (["w", "a", "s", "d"].includes(k)) {
      keysDown.add(k);
    }
  });
  window.addEventListener("keyup", (e) => {
    keysDown.delete(e.key.toLowerCase());
  });
}

function getKeyboardInput(): { x: number; y: number; active: boolean } {
  let x = 0;
  let y = 0;
  if (keysDown.has("a")) x -= 1;
  if (keysDown.has("d")) x += 1;
  if (keysDown.has("w")) y -= 1; // up on screen = negative Y
  if (keysDown.has("s")) y += 1;
  const len = Math.sqrt(x * x + y * y);
  if (len > 0) {
    x /= len;
    y /= len;
  }
  return { x, y, active: len > 0 };
}

// ---------------------------------------------------------------------------
// Structure colliders  (circles: [cx, cz, radius])
// These prevent the player from walking through buildings & large props.
// ---------------------------------------------------------------------------

interface CircleCollider {
  cx: number;
  cz: number;
  radius: number;
}

// Helper: offset a position relative to a zone centre
const zp = (zone: string, dx = 0, dz = 0): { cx: number; cz: number } => ({
  cx: ZONE_POSITIONS[zone][0] + dx,
  cz: ZONE_POSITIONS[zone][2] + dz,
});

const STRUCTURE_COLLIDERS: CircleCollider[] = [
  // ---- Villa (centre) ----
  // Split the main hall into two side colliders with a gap for the front door
  // Back half of villa (deeper into -Z)
  { ...zp("villa", 0, -1.5), radius: 3.0 },
  // Left side of front (blocks walking through left wall)
  { ...zp("villa", -2.5, 1.5), radius: 1.8 },
  // Right side of front (blocks walking through right wall)
  { ...zp("villa", 2.5, 1.5), radius: 1.8 },
  // Left wing room at x=-4.5
  { ...zp("villa", -4.5, 0), radius: 2.0 },
  // Right wing room at x=+4.5
  { ...zp("villa", 4.5, 0), radius: 2.0 },

  // ---- Garden fountain ----
  { ...zp("garden"), radius: 1.8 },
  // Garden benches (two, at ±2 from centre)
  { ...zp("garden", 2.0, 0), radius: 0.6 },
  { ...zp("garden", -2.0, 0), radius: 0.6 },

  // ---- Challenge Arena podium ----
  { ...zp("arena"), radius: 1.0 },

  // ---- Lookout mound ----
  { ...zp("lookout"), radius: 2.8 },

  // ---- Beach palm trees (relative to beach zone) ----
  { ...zp("beach", -8, -2), radius: 0.5 },
  { ...zp("beach", 10, -1.5), radius: 0.5 },
  { ...zp("beach", -1, -3), radius: 0.5 },
  // Beach umbrellas
  { ...zp("beach", -3, -0.5), radius: 0.4 },
  { ...zp("beach", 3, -1), radius: 0.4 },
  { ...zp("beach", 8, -0.5), radius: 0.4 },

  // ---- Jungle trees (relative to jungle zone) ----
  { ...zp("jungle", -4, -5.5), radius: 0.5 },  // palm
  { ...zp("jungle", 5, -4.5), radius: 0.5 },   // palm
  // Jungle simple trees (dense cluster)
  { ...zp("jungle", -6, -2), radius: 0.5 },
  { ...zp("jungle", -4, -4), radius: 0.5 },
  { ...zp("jungle", -2, -1), radius: 0.5 },
  { ...zp("jungle", 0, -3), radius: 0.5 },
  { ...zp("jungle", 2, -5), radius: 0.5 },
  { ...zp("jungle", 4, -2), radius: 0.5 },
  { ...zp("jungle", 6, -4), radius: 0.5 },
  { ...zp("jungle", -5, -6), radius: 0.5 },

  // ---- Standalone trees (placed in world root) ----
  { cx: -10, cz: 12, radius: 0.5 },   // palm
  { cx: 6, cz: -6, radius: 0.5 },     // palm
  { cx: -14, cz: -4, radius: 0.5 },   // palm
  { cx: 10, cz: -10, radius: 0.5 },   // palm
  { cx: -8, cz: 4, radius: 0.5 },     // simple tree
  { cx: 8, cz: 5, radius: 0.5 },      // simple tree
  { cx: -5, cz: -4, radius: 0.5 },    // simple tree
  { cx: 4, cz: -10, radius: 0.5 },    // simple tree

  // ---- Rocks ----
  { cx: -16, cz: 10, radius: 0.5 },
  { cx: 17, cz: 5, radius: 0.4 },
  { cx: -12, cz: 14, radius: 0.35 },
];

function collidesWithStructure(x: number, z: number, playerRadius: number): boolean {
  for (const c of STRUCTURE_COLLIDERS) {
    const dx = x - c.cx;
    const dz = z - c.cz;
    const minDist = c.radius + playerRadius;
    if (dx * dx + dz * dz < minDist * minDist) {
      return true;
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// Interior colliders (villa inside — couch, beds, tables)
// ---------------------------------------------------------------------------

const INTERIOR_COLLIDERS: CircleCollider[] = [
  // Couch
  { cx: 0, cz: -1, radius: 1.8 },
  // Coffee table
  { cx: 0, cz: 0.8, radius: 0.9 },
  // Left wall beds (3 beds)
  { cx: -7, cz: -3, radius: 1.2 },
  { cx: -7, cz: 0, radius: 1.2 },
  { cx: -7, cz: 3, radius: 1.2 },
  // Right wall beds (3 beds)
  { cx: 7, cz: -3, radius: 1.2 },
  { cx: 7, cz: 0, radius: 1.2 },
  { cx: 7, cz: 3, radius: 1.2 },
];

function collidesWithInterior(x: number, z: number, playerRadius: number): boolean {
  for (const c of INTERIOR_COLLIDERS) {
    const dx = x - c.cx;
    const dz = z - c.cz;
    const minDist = c.radius + playerRadius;
    if (dx * dx + dz * dz < minDist * minDist) {
      return true;
    }
  }
  return false;
}

/** Check if player is within the room bounds (walls) */
function withinRoom(x: number, z: number, margin: number): boolean {
  const halfW = VILLA_INTERIOR.ROOM_WIDTH / 2 - margin;
  const halfD = VILLA_INTERIOR.ROOM_DEPTH / 2 - margin;
  return x > -halfW && x < halfW && z > -halfD && z < halfD;
}

/** Check if player is at the door exit zone (front wall, within door opening) */
function isAtDoorExit(x: number, z: number): boolean {
  const doorHalf = VILLA_INTERIOR.DOOR_WIDTH / 2;
  return x > -doorHalf && x < doorHalf && z > VILLA_INTERIOR.DOOR_Z - 1.0;
}

// Door trigger zone on the outdoor island (front of villa, tight to the door)
const VILLA_DOOR_OUTDOOR = {
  x: ZONE_POSITIONS.villa[0],     // 0
  z: ZONE_POSITIONS.villa[2] + 2.5, // front face of villa, just before the door
  radius: 0.8,
};

function isAtVillaDoorOutside(x: number, z: number): boolean {
  const dx = x - VILLA_DOOR_OUTDOOR.x;
  const dz = z - VILLA_DOOR_OUTDOOR.z;
  return dx * dx + dz * dz < VILLA_DOOR_OUTDOOR.radius * VILLA_DOOR_OUTDOOR.radius;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ISLAND_RADIUS = 20;
const BOB_SPEED = 10;
const BOB_AMPLITUDE = 0.06;
/** Isometric camera Y rotation (45 deg) used to convert joystick → world */
const ISO_ANGLE = Math.PI / 4;

// ---------------------------------------------------------------------------
// PlayerController
// ---------------------------------------------------------------------------

const BED_INTERACT_RADIUS = 2.0;

interface PlayerControllerProps {
  position?: [number, number, number];
  isMovementLocked: boolean;
  isIndoors?: boolean;
  sleepingNPCs?: string[];
  onBedInteract?: (npcId: string, isSleeping: boolean) => void;
}

export default function PlayerController({
  position = [0, 0, 0],
  isMovementLocked,
  isIndoors = false,
  sleepingNPCs = [],
  onBedInteract,
}: PlayerControllerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bobPhase = useRef(0);
  const currentRotation = useRef(0);
  const isMoving = useRef(false);
  const doorCooldown = useRef(0); // prevent rapid enter/exit
  const bedCooldown = useRef(0); // prevent rapid bed interactions

  const enterVilla = useGameStore((s) => s.enterVilla);
  const exitVilla = useGameStore((s) => s.exitVilla);

  // Initialise module-level refs once
  useMemo(() => {
    playerPositionRef.current.set(position[0], position[1], position[2]);
    playerTargetRef.current.set(position[0], position[1], position[2]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ----- frame loop -------------------------------------------------------
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Door cooldown timer
    if (doorCooldown.current > 0) doorCooldown.current -= delta;
    if (bedCooldown.current > 0) bedCooldown.current -= delta;

    // Merge joystick + WASD input
    const joy = joystickInputRef.current;
    const kbd = getKeyboardInput();
    const inputX = joy.active ? joy.x : kbd.x;
    const inputY = joy.active ? joy.y : kbd.y;
    const hasInput = joy.active || kbd.active;

    // ---- movement --------------------------------------------------------
    if (hasInput && !isMovementLocked && (Math.abs(inputX) > 0.05 || Math.abs(inputY) > 0.05)) {
      // Rotate input by the isometric camera angle so "up" on the
      // joystick / W key moves the character visually upward on screen.
      const cos = Math.cos(-ISO_ANGLE);
      const sin = Math.sin(-ISO_ANGLE);
      const worldX = inputX * cos - inputY * sin;
      const worldZ = inputX * sin + inputY * cos;

      const speed = PLAYER.MOVE_SPEED * delta;
      const nextX = playerPositionRef.current.x + worldX * speed;
      const nextZ = playerPositionRef.current.z + worldZ * speed;

      if (isIndoors) {
        // ---- INDOOR movement (villa interior) ----
        const inRoom = withinRoom(nextX, nextZ, PLAYER.COLLISION_RADIUS);
        const hitsInterior = collidesWithInterior(nextX, nextZ, PLAYER.COLLISION_RADIUS);

        if (inRoom && !hitsInterior) {
          playerPositionRef.current.x = nextX;
          playerPositionRef.current.z = nextZ;
        } else if (inRoom) {
          // Sliding
          if (!collidesWithInterior(nextX, playerPositionRef.current.z, PLAYER.COLLISION_RADIUS)
              && withinRoom(nextX, playerPositionRef.current.z, PLAYER.COLLISION_RADIUS)) {
            playerPositionRef.current.x = nextX;
          } else if (!collidesWithInterior(playerPositionRef.current.x, nextZ, PLAYER.COLLISION_RADIUS)
              && withinRoom(playerPositionRef.current.x, nextZ, PLAYER.COLLISION_RADIUS)) {
            playerPositionRef.current.z = nextZ;
          }
        }

        // Check for door exit
        if (doorCooldown.current <= 0 && isAtDoorExit(playerPositionRef.current.x, playerPositionRef.current.z)) {
          doorCooldown.current = 1.0;
          playerPositionRef.current.set(
            VILLA_INTERIOR.EXIT_POSITION[0],
            VILLA_INTERIOR.EXIT_POSITION[1],
            VILLA_INTERIOR.EXIT_POSITION[2],
          );
          exitVilla();
        }

        // Check for bed proximity interaction
        if (bedCooldown.current <= 0 && onBedInteract) {
          for (const bed of BED_POSITIONS) {
            const dx = playerPositionRef.current.x - bed.position[0];
            const dz = playerPositionRef.current.z - bed.position[2];
            if (dx * dx + dz * dz < BED_INTERACT_RADIUS * BED_INTERACT_RADIUS) {
              bedCooldown.current = 2.0;
              onBedInteract(bed.npcId, sleepingNPCs.includes(bed.npcId));
              break;
            }
          }
        }
      } else {
        // ---- OUTDOOR movement (island) ----
        const distSq = nextX * nextX + nextZ * nextZ;
        const withinIslandBounds = distSq < ISLAND_RADIUS * ISLAND_RADIUS;
        const hitsStructure = collidesWithStructure(nextX, nextZ, PLAYER.COLLISION_RADIUS);

        // Check for villa door entry — modify collision near front door
        const nearVillaDoor = isAtVillaDoorOutside(nextX, nextZ);

        if (nearVillaDoor && doorCooldown.current <= 0) {
          doorCooldown.current = 1.0;
          // Teleport inside and enter
          playerPositionRef.current.set(
            VILLA_INTERIOR.ENTRY_POSITION[0],
            VILLA_INTERIOR.ENTRY_POSITION[1],
            VILLA_INTERIOR.ENTRY_POSITION[2],
          );
          enterVilla();
        } else if (withinIslandBounds && !hitsStructure) {
          playerPositionRef.current.x = nextX;
          playerPositionRef.current.z = nextZ;
        } else if (withinIslandBounds) {
          // Try sliding along one axis at a time
          if (!collidesWithStructure(nextX, playerPositionRef.current.z, PLAYER.COLLISION_RADIUS)) {
            playerPositionRef.current.x = nextX;
          } else if (!collidesWithStructure(playerPositionRef.current.x, nextZ, PLAYER.COLLISION_RADIUS)) {
            playerPositionRef.current.z = nextZ;
          }
        }
      }

      // Face movement direction
      const targetAngle = Math.atan2(worldX, worldZ);
      currentRotation.current = lerpAngle(currentRotation.current, targetAngle, 0.15);

      isMoving.current = true;
    } else {
      isMoving.current = false;
    }

    // ---- walk bob ---------------------------------------------------------
    if (isMoving.current) {
      bobPhase.current += delta * BOB_SPEED;
    } else {
      // Settle bob back to 0
      bobPhase.current *= 0.9;
    }
    const bobY = Math.sin(bobPhase.current) * BOB_AMPLITUDE;

    // ---- apply to group ---------------------------------------------------
    groupRef.current.position.set(
      playerPositionRef.current.x,
      playerPositionRef.current.y + bobY,
      playerPositionRef.current.z,
    );
    groupRef.current.rotation.y = currentRotation.current;

    // Sync target ref (useful for camera / UI)
    playerTargetRef.current.copy(playerPositionRef.current);
  });

  // ---- render ------------------------------------------------------------
  return (
    <group ref={groupRef} position={position}>
      <DogCharacter />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Dog character mesh (capsule body + sphere head + triangle ears)
// ---------------------------------------------------------------------------

const BODY_COLOR = "#D4A05A"; // warm tan / golden
const NOSE_COLOR = "#3A2518";
const EAR_COLOR = "#B8863A";
const EYE_COLOR = "#1A1A1A";

function DogCharacter() {
  // Ear geometry (triangle / cone flattened)
  const earGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.15, 0.3, 4);
    geo.translate(0, 0.15, 0);
    return geo;
  }, []);

  return (
    <group>
      {/* Body – cylinder */}
      <mesh castShadow position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.6, 12]} />
        <meshStandardMaterial color={BODY_COLOR} roughness={0.85} />
      </mesh>

      {/* Head – sphere */}
      <mesh castShadow position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.25, 12, 10]} />
        <meshStandardMaterial color={BODY_COLOR} roughness={0.85} />
      </mesh>

      {/* Left ear */}
      <mesh
        position={[-0.15, 1.2, 0]}
        rotation={[0, 0, 0.25]}
        geometry={earGeometry}
      >
        <meshStandardMaterial color={EAR_COLOR} roughness={0.85} />
      </mesh>

      {/* Right ear */}
      <mesh
        position={[0.15, 1.2, 0]}
        rotation={[0, 0, -0.25]}
        geometry={earGeometry}
      >
        <meshStandardMaterial color={EAR_COLOR} roughness={0.85} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.08, 0.98, 0.22]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color={EYE_COLOR} />
      </mesh>
      <mesh position={[0.08, 0.98, 0.22]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color={EYE_COLOR} />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 0.9, 0.26]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color={NOSE_COLOR} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Shortest-path angle lerp that wraps around -PI..PI */
function lerpAngle(a: number, b: number, t: number): number {
  let diff = b - a;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return a + diff * t;
}
