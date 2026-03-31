"use client";

import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PLAYER } from "@/game/constants";
import { ZONE_POSITIONS } from "@/scene/IslandEnvironment";

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
  // Main hall: box 6×5 → radius ~3.5 at centre
  { ...zp("villa"), radius: 3.5 },
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
// Constants
// ---------------------------------------------------------------------------

const ISLAND_RADIUS = 18;
const BOB_SPEED = 10;
const BOB_AMPLITUDE = 0.06;
/** Isometric camera Y rotation (45 deg) used to convert joystick → world */
const ISO_ANGLE = Math.PI / 4;

// ---------------------------------------------------------------------------
// PlayerController
// ---------------------------------------------------------------------------

interface PlayerControllerProps {
  position?: [number, number, number];
  isMovementLocked: boolean;
}

export default function PlayerController({
  position = [0, 0, 0],
  isMovementLocked,
}: PlayerControllerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bobPhase = useRef(0);
  const currentRotation = useRef(0);
  const isMoving = useRef(false);

  // Initialise module-level refs once
  useMemo(() => {
    playerPositionRef.current.set(position[0], position[1], position[2]);
    playerTargetRef.current.set(position[0], position[1], position[2]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ----- frame loop -------------------------------------------------------
  useFrame((_, delta) => {
    if (!groupRef.current) return;

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

      // Island-bounds collision (circle around origin)
      const distSq = nextX * nextX + nextZ * nextZ;
      const withinIsland = distSq < ISLAND_RADIUS * ISLAND_RADIUS;

      // Structure collision
      const hitsStructure = collidesWithStructure(nextX, nextZ, PLAYER.COLLISION_RADIUS);

      if (withinIsland && !hitsStructure) {
        playerPositionRef.current.x = nextX;
        playerPositionRef.current.z = nextZ;
      } else if (withinIsland) {
        // Try sliding along one axis at a time
        const slideX = playerPositionRef.current.x + worldX * speed;
        const slideZ = playerPositionRef.current.z + worldZ * speed;
        if (!collidesWithStructure(slideX, playerPositionRef.current.z, PLAYER.COLLISION_RADIUS)) {
          playerPositionRef.current.x = slideX;
        } else if (!collidesWithStructure(playerPositionRef.current.x, slideZ, PLAYER.COLLISION_RADIUS)) {
          playerPositionRef.current.z = slideZ;
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
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.6, 12]} />
        <meshStandardMaterial color={BODY_COLOR} roughness={0.85} />
      </mesh>

      {/* Head – sphere */}
      <mesh position={[0, 0.95, 0]}>
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
