"use client";

import { useRef, useMemo, useEffect, Suspense } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { clone as cloneSkinnedScene } from "three/examples/jsm/utils/SkeletonUtils.js";
import { PLAYER, CAVE_POSITION, LAND_PLOTS } from "@/game/constants";
import { ZONE_POSITIONS } from "@/scene/IslandEnvironment";
import { VILLA_INTERIOR, BED_POSITIONS } from "@/scene/VillaInterior";
import { CAVE_INTERIOR } from "@/scene/CaveInterior";
import { DOCK_INTERIOR } from "@/scene/DockInterior";
import { useGameStore } from "@/store/gameStore";
import { isZoneUnlocked, isStructureUnlocked } from "@/game/unlocks";

// ---------------------------------------------------------------------------
// Module-level refs for cross-component communication
// ---------------------------------------------------------------------------

export const playerPositionRef = { current: new THREE.Vector3(0, 0, 0) };
export const playerTargetRef = { current: new THREE.Vector3(0, 0, 0) };
export const joystickInputRef = {
  current: { x: 0, y: 0, active: false },
};

/** Set before exitVilla/exitCave to preserve playerPositionRef across component remount */
const _preservePosition = { current: false };

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

// ---- Base colliders (always active) ----
const BASE_COLLIDERS: CircleCollider[] = [
  // Villa (centre) — split with gap for front door
  { ...zp("villa", 0, -1.5), radius: 3.0 },
  { ...zp("villa", -2.5, 1.5), radius: 1.8 },
  { ...zp("villa", 2.5, 1.5), radius: 1.8 },
  { ...zp("villa", -4.5, 0), radius: 2.0 },
  { ...zp("villa", 4.5, 0), radius: 2.0 },
  // Beach palm trees & umbrellas
  { ...zp("beach", -8, -2), radius: 0.5 },
  { ...zp("beach", 10, -1.5), radius: 0.5 },
  { ...zp("beach", -1, -3), radius: 0.5 },
  { ...zp("beach", -3, -0.5), radius: 0.4 },
  { ...zp("beach", 3, -1), radius: 0.4 },
  { ...zp("beach", 8, -0.5), radius: 0.4 },
  // Standalone trees
  { cx: -10, cz: 12, radius: 0.5 },
  { cx: 6, cz: -6, radius: 0.5 },
  { cx: -14, cz: -4, radius: 0.5 },
  { cx: 10, cz: -10, radius: 0.5 },
  { cx: -8, cz: 4, radius: 0.5 },
  { cx: 8, cz: 5, radius: 0.5 },
  { cx: -5, cz: -4, radius: 0.5 },
  { cx: 4, cz: -10, radius: 0.5 },
  // Rocks
  { cx: -16, cz: 10, radius: 0.5 },
  { cx: -12, cz: 14, radius: 0.35 },
];

// ---- Zone-specific colliders (active only when zone is unlocked) ----
const GARDEN_ZONE_COLLIDERS: CircleCollider[] = [
  { ...zp("garden"), radius: 1.8 },
  { ...zp("garden", 2.0, 0), radius: 0.6 },
  { ...zp("garden", -2.0, 0), radius: 0.6 },
];

const ARENA_ZONE_COLLIDERS: CircleCollider[] = [
  { ...zp("arena"), radius: 1.0 },
];

const LOOKOUT_ZONE_COLLIDERS: CircleCollider[] = [
  { ...zp("lookout"), radius: 2.8 },
];

const JUNGLE_ZONE_COLLIDERS: CircleCollider[] = [
  { ...zp("jungle", -4, -5.5), radius: 0.5 },
  { ...zp("jungle", 5, -4.5), radius: 0.5 },
  { ...zp("jungle", -6, -2), radius: 0.5 },
  { ...zp("jungle", -4, -4), radius: 0.5 },
  { ...zp("jungle", -2, -1), radius: 0.5 },
  { ...zp("jungle", 0, -3), radius: 0.5 },
  { ...zp("jungle", 2, -5), radius: 0.5 },
  { ...zp("jungle", 4, -2), radius: 0.5 },
  { ...zp("jungle", 6, -4), radius: 0.5 },
  { ...zp("jungle", -5, -6), radius: 0.5 },
];

// Cave exterior — solid block when locked, side-colliders with door gap when unlocked
const CAVE_LOCKED_COLLIDERS: CircleCollider[] = [
  { cx: CAVE_POSITION[0], cz: CAVE_POSITION[2], radius: 2.8 },
];
const CAVE_UNLOCKED_COLLIDERS: CircleCollider[] = [
  { cx: CAVE_POSITION[0] - 2.2, cz: CAVE_POSITION[2], radius: 1.5 },
  { cx: CAVE_POSITION[0] + 2.2, cz: CAVE_POSITION[2], radius: 1.5 },
  { cx: CAVE_POSITION[0], cz: CAVE_POSITION[2] - 1.8, radius: 1.5 },
];

// Dock barrier when locked — blocks entry onto the pier
const DOCK_LOCKED_COLLIDERS: CircleCollider[] = [
  { cx: ZONE_POSITIONS.dock[0], cz: ZONE_POSITIONS.dock[2], radius: 1.5 },
];

/**
 * Resolve movement against a list of circle colliders using normal-based sliding.
 * Finds the deepest-penetrating collider, projects the movement onto its tangent,
 * and returns a slide position — preventing corner-sticking.
 */
function resolveSlide(
  cx: number, cz: number,
  nx: number, nz: number,
  playerRadius: number,
  colliders: CircleCollider[],
): { x: number; z: number } {
  // Find the deepest-penetrating collider at the desired position
  let hit: CircleCollider | null = null;
  let deepest = -1;
  for (const c of colliders) {
    const dx = nx - c.cx;
    const dz = nz - c.cz;
    const minDist = c.radius + playerRadius;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < minDist) {
      const pen = minDist - dist;
      if (pen > deepest) { deepest = pen; hit = c; }
    }
  }
  if (!hit) return { x: nx, z: nz }; // no collision — full movement clear

  // Collision normal: direction from collider center to the player's current position
  let normalX = cx - hit.cx;
  let normalZ = cz - hit.cz;
  const len = Math.sqrt(normalX * normalX + normalZ * normalZ);
  if (len < 0.001) return { x: cx, z: cz }; // degenerate (inside collider centre)
  normalX /= len;
  normalZ /= len;

  // Project movement onto tangent (remove the component into the wall)
  const moveX = nx - cx;
  const moveZ = nz - cz;
  const dot = moveX * normalX + moveZ * normalZ;
  const slideX = cx + (moveX - dot * normalX);
  const slideZ = cz + (moveZ - dot * normalZ);

  // Accept slide if clear of all colliders
  for (const c of colliders) {
    const dx = slideX - c.cx;
    const dz = slideZ - c.cz;
    const minDist = c.radius + playerRadius;
    if (dx * dx + dz * dz < minDist * minDist) return { x: cx, z: cz }; // cornered — stop
  }
  return { x: slideX, z: slideZ };
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

// ---------------------------------------------------------------------------
// Cave interior colliders
// ---------------------------------------------------------------------------

const CAVE_INTERIOR_COLLIDERS: CircleCollider[] = [
  // Glowing pool in center
  { cx: 0, cz: -1, radius: 2.2 },
  // Rock formations
  { cx: -5, cz: -4, radius: 0.6 },
  { cx: 4, cz: -3, radius: 0.6 },
  { cx: -3, cz: 3, radius: 0.6 },
  { cx: 5, cz: 2, radius: 0.6 },
];

/** Check if player is within the cave room bounds */
function withinCaveRoom(x: number, z: number, margin: number): boolean {
  const halfW = CAVE_INTERIOR.ROOM_WIDTH / 2 - margin;
  const halfD = CAVE_INTERIOR.ROOM_DEPTH / 2 - margin;
  return x > -halfW && x < halfW && z > -halfD && z < halfD;
}

/** Check if player is at the cave exit door zone */
function isAtCaveDoorExit(x: number, z: number): boolean {
  const doorHalf = CAVE_INTERIOR.DOOR_WIDTH / 2;
  return x > -doorHalf && x < doorHalf && z > CAVE_INTERIOR.DOOR_Z - 1.0;
}

// Cave door trigger zone on the outdoor island (front of cave exterior)
const CAVE_DOOR_OUTDOOR = {
  x: CAVE_POSITION[0],
  z: CAVE_POSITION[2] + 1.6,
  radius: 0.8,
};

function isAtCaveDoorOutside(x: number, z: number): boolean {
  const dx = x - CAVE_DOOR_OUTDOOR.x;
  const dz = z - CAVE_DOOR_OUTDOOR.z;
  return dx * dx + dz * dz < CAVE_DOOR_OUTDOOR.radius * CAVE_DOOR_OUTDOOR.radius;
}

// ---------------------------------------------------------------------------
// Dock interior colliders & boundary
// ---------------------------------------------------------------------------

const DOCK_INTERIOR_COLLIDERS: CircleCollider[] = [
  // Crate
  { cx: 3, cz: -3, radius: 0.7 },
  // Barrel
  { cx: -3.5, cz: -3.5, radius: 0.5 },
  // Lantern post
  { cx: -4.2, cz: 3, radius: 0.3 },
];

/** Check if player is within the dock platform bounds */
function withinDockPlatform(x: number, z: number, margin: number): boolean {
  const halfW = DOCK_INTERIOR.PLATFORM_WIDTH / 2 - margin;
  const halfD = DOCK_INTERIOR.PLATFORM_DEPTH / 2 - margin;
  return x > -halfW && x < halfW && z > -halfD && z < halfD;
}

/** Check if player is at the dock exit zone (−Z edge, top-right in isometric) */
function isAtDockExit(x: number, z: number): boolean {
  const doorHalf = DOCK_INTERIOR.EXIT_WIDTH / 2;
  return x > -doorHalf && x < doorHalf && z < DOCK_INTERIOR.EXIT_Z + 1.0;
}

// Dock entrance trigger zone on the outdoor island (front of the pier)
const DOCK_DOOR_OUTDOOR = {
  x: ZONE_POSITIONS.dock[0],
  z: ZONE_POSITIONS.dock[2] - 0.5,
  radius: 1.2,
};

function isAtDockDoorOutside(x: number, z: number): boolean {
  const dx = x - DOCK_DOOR_OUTDOOR.x;
  const dz = z - DOCK_DOOR_OUTDOOR.z;
  return dx * dx + dz * dz < DOCK_DOOR_OUTDOOR.radius * DOCK_DOOR_OUTDOOR.radius;
}

// Dock colliders when UNLOCKED — block walking along the pier sides, only entrance is from the front
const DOCK_UNLOCKED_COLLIDERS: CircleCollider[] = [
  // Left side of pier
  { cx: ZONE_POSITIONS.dock[0] - 1.5, cz: ZONE_POSITIONS.dock[2] + 2, radius: 1.0 },
  { cx: ZONE_POSITIONS.dock[0] - 1.5, cz: ZONE_POSITIONS.dock[2] + 5, radius: 1.0 },
  { cx: ZONE_POSITIONS.dock[0] - 1.5, cz: ZONE_POSITIONS.dock[2] + 8, radius: 1.0 },
  // Right side of pier
  { cx: ZONE_POSITIONS.dock[0] + 1.5, cz: ZONE_POSITIONS.dock[2] + 2, radius: 1.0 },
  { cx: ZONE_POSITIONS.dock[0] + 1.5, cz: ZONE_POSITIONS.dock[2] + 5, radius: 1.0 },
  { cx: ZONE_POSITIONS.dock[0] + 1.5, cz: ZONE_POSITIONS.dock[2] + 8, radius: 1.0 },
  // End of pier
  { cx: ZONE_POSITIONS.dock[0], cz: ZONE_POSITIONS.dock[2] + 10, radius: 1.5 },
];

// Locked structure proximity radius
const LOCKED_PROXIMITY_RADIUS = 4.0;

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

interface PlotBounds { cx: number; cz: number; semiX: number; semiZ: number }

/** Check if a position is within the walkable island area.
 *  Includes the base island + any unlocked NPC land plots. */
function isWithinIsland(x: number, z: number, extraPlots?: PlotBounds[]): boolean {
  // Main island circle
  if (x * x + z * z < ISLAND_RADIUS * ISLAND_RADIUS) return true;
  // Beach sand — ellipse centered at (0, 16), semi-axes 18 x 6
  const sx = x / 18;
  const sz = (z - 16) / 6;
  if (sx * sx + sz * sz < 1) return true;
  // Beach/south grass extension — ellipse centered at (0, 10), semi-axes ~15 x 9
  const bx = x / 15;
  const bz = (z - 10) / 9;
  if (bx * bx + bz * bz < 1) return true;
  // Dock/southeast extension — ellipse centered at (8, 10), semi-axes ~10 x 8
  const dx = (x - 8) / 10;
  const dz = (z - 10) / 8;
  if (dx * dx + dz * dz < 1) return true;
  // North extension — ellipse centered at (0, -6), semi-axes ~14 x 10
  const nx = x / 14;
  const nz = (z + 6) / 10;
  if (nx * nx + nz * nz < 1) return true;
  // Dynamic NPC land plots
  if (extraPlots) {
    for (const p of extraPlots) {
      const px = (x - p.cx) / p.semiX;
      const pz = (z - p.cz) / p.semiZ;
      if (px * px + pz * pz < 1) return true;
    }
  }
  return false;
}

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
  indoorLocation?: 'villa' | 'cave' | 'dock' | null;
  sleepingNPCs?: string[];
  onBedInteract?: (npcId: string, isSleeping: boolean) => void;
  onLockedStructure?: (key: string) => void;
}

export default function PlayerController({
  position = [0, 0, 0],
  isMovementLocked,
  isIndoors = false,
  indoorLocation = null,
  sleepingNPCs = [],
  onBedInteract,
  onLockedStructure,
}: PlayerControllerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bobPhase = useRef(0);
  const currentRotation = useRef(0);
  const isMoving = useRef(false);
  const doorCooldown = useRef(0); // prevent rapid enter/exit
  const bedCooldown = useRef(0); // prevent rapid bed interactions
  const lockedCooldown = useRef(0); // prevent rapid locked structure popups

  const enterVilla = useGameStore((s) => s.enterVilla);
  const exitVilla = useGameStore((s) => s.exitVilla);
  const enterCave = useGameStore((s) => s.enterCave);
  const exitCave = useGameStore((s) => s.exitCave);
  const enterDock = useGameStore((s) => s.enterDock);
  const exitDock = useGameStore((s) => s.exitDock);
  const arrivedNPCIds = useGameStore((s) => s.arrivedNPCIds);
  const week = useGameStore((s) => s.week);
  const day = useGameStore((s) => s.day);
  const isNight = useGameStore((s) => s.phase === 'NIGHTTIME_FREE');

  // Dynamic outdoor colliders — recomputed when zones/structures unlock
  const activeColliders = useMemo(() => {
    const colliders: CircleCollider[] = [...BASE_COLLIDERS];
    if (isZoneUnlocked('garden', arrivedNPCIds)) colliders.push(...GARDEN_ZONE_COLLIDERS);
    if (isZoneUnlocked('arena', arrivedNPCIds)) colliders.push(...ARENA_ZONE_COLLIDERS);
    if (isZoneUnlocked('lookout', arrivedNPCIds)) colliders.push(...LOOKOUT_ZONE_COLLIDERS);
    if (isZoneUnlocked('jungle', arrivedNPCIds)) colliders.push(...JUNGLE_ZONE_COLLIDERS);
    if (isStructureUnlocked('cave', week, day)) {
      colliders.push(...CAVE_UNLOCKED_COLLIDERS);
    } else {
      colliders.push(...CAVE_LOCKED_COLLIDERS);
    }
    if (isStructureUnlocked('dock', week, day)) {
      colliders.push(...DOCK_UNLOCKED_COLLIDERS);
    } else {
      colliders.push(...DOCK_LOCKED_COLLIDERS);
    }
    return colliders;
  }, [arrivedNPCIds, week, day]);
  const activeCollidersRef = useRef(activeColliders);
  activeCollidersRef.current = activeColliders;

  // Compute unlocked land plots for walkable bounds
  const unlockedPlots = useMemo(() => {
    const plots: PlotBounds[] = [];
    for (const [zoneKey, plot] of Object.entries(LAND_PLOTS)) {
      if (isZoneUnlocked(zoneKey, arrivedNPCIds)) {
        plots.push({ cx: plot.center[0], cz: plot.center[2], semiX: plot.semiX, semiZ: plot.semiZ });
      }
    }
    return plots;
  }, [arrivedNPCIds]);
  const unlockedPlotsRef = useRef(unlockedPlots);
  unlockedPlotsRef.current = unlockedPlots;

  // Initialise module-level refs — skip if exiting a building (position already set)
  useMemo(() => {
    if (_preservePosition.current) {
      _preservePosition.current = false;
      playerTargetRef.current.copy(playerPositionRef.current);
    } else {
      playerPositionRef.current.set(position[0], position[1], position[2]);
      playerTargetRef.current.set(position[0], position[1], position[2]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ----- frame loop -------------------------------------------------------
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Cooldown timers
    if (doorCooldown.current > 0) doorCooldown.current -= delta;
    if (bedCooldown.current > 0) bedCooldown.current -= delta;
    if (lockedCooldown.current > 0) lockedCooldown.current -= delta;

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
        if (indoorLocation === 'dock') {
          // ---- INDOOR movement (dock interior) ----
          const inPlatform = withinDockPlatform(nextX, nextZ, PLAYER.COLLISION_RADIUS);

          if (inPlatform) {
            const resolved = resolveSlide(
              playerPositionRef.current.x, playerPositionRef.current.z,
              nextX, nextZ,
              PLAYER.COLLISION_RADIUS,
              DOCK_INTERIOR_COLLIDERS,
            );
            if (withinDockPlatform(resolved.x, resolved.z, PLAYER.COLLISION_RADIUS)) {
              playerPositionRef.current.x = resolved.x;
              playerPositionRef.current.z = resolved.z;
            }
          }

          // Check for dock exit
          if (doorCooldown.current <= 0 && isAtDockExit(playerPositionRef.current.x, playerPositionRef.current.z)) {
            doorCooldown.current = 1.0;
            playerPositionRef.current.set(
              DOCK_INTERIOR.EXIT_POSITION[0],
              DOCK_INTERIOR.EXIT_POSITION[1],
              DOCK_INTERIOR.EXIT_POSITION[2],
            );
            _preservePosition.current = true;
            exitDock();
          }
        } else if (indoorLocation === 'cave') {
          // ---- INDOOR movement (cave interior) ----
          const inRoom = withinCaveRoom(nextX, nextZ, PLAYER.COLLISION_RADIUS);

          if (inRoom) {
            const resolved = resolveSlide(
              playerPositionRef.current.x, playerPositionRef.current.z,
              nextX, nextZ,
              PLAYER.COLLISION_RADIUS,
              CAVE_INTERIOR_COLLIDERS,
            );
            if (withinCaveRoom(resolved.x, resolved.z, PLAYER.COLLISION_RADIUS)) {
              playerPositionRef.current.x = resolved.x;
              playerPositionRef.current.z = resolved.z;
            }
          }

          // Check for cave door exit
          if (doorCooldown.current <= 0 && isAtCaveDoorExit(playerPositionRef.current.x, playerPositionRef.current.z)) {
            doorCooldown.current = 1.0;
            playerPositionRef.current.set(
              CAVE_INTERIOR.EXIT_POSITION[0],
              CAVE_INTERIOR.EXIT_POSITION[1],
              CAVE_INTERIOR.EXIT_POSITION[2],
            );
            _preservePosition.current = true;
            exitCave();
          }
        } else {
          // ---- INDOOR movement (villa interior) ----
          const inRoom = withinRoom(nextX, nextZ, PLAYER.COLLISION_RADIUS);

          if (inRoom) {
            const resolved = resolveSlide(
              playerPositionRef.current.x, playerPositionRef.current.z,
              nextX, nextZ,
              PLAYER.COLLISION_RADIUS,
              INTERIOR_COLLIDERS,
            );
            if (withinRoom(resolved.x, resolved.z, PLAYER.COLLISION_RADIUS)) {
              playerPositionRef.current.x = resolved.x;
              playerPositionRef.current.z = resolved.z;
            }
          }

          // Check for villa door exit
          if (doorCooldown.current <= 0 && isAtDoorExit(playerPositionRef.current.x, playerPositionRef.current.z)) {
            doorCooldown.current = 1.0;
            playerPositionRef.current.set(
              VILLA_INTERIOR.EXIT_POSITION[0],
              VILLA_INTERIOR.EXIT_POSITION[1],
              VILLA_INTERIOR.EXIT_POSITION[2],
            );
            _preservePosition.current = true;
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
        }
      } else {
        // ---- OUTDOOR movement (island) ----
        const withinIslandBounds = isWithinIsland(nextX, nextZ, unlockedPlotsRef.current);

        // Check for villa door entry
        const nearVillaDoor = isAtVillaDoorOutside(nextX, nextZ);
        // Check for cave door entry (only when cave is unlocked)
        const caveUnlocked = isStructureUnlocked('cave', week, day);
        const nearCaveDoor = caveUnlocked && isAtCaveDoorOutside(nextX, nextZ);
        // Check for dock entrance (only when dock is unlocked)
        const dockUnlocked = isStructureUnlocked('dock', week, day);
        const nearDockDoor = dockUnlocked && isAtDockDoorOutside(nextX, nextZ);

        if (nearVillaDoor && doorCooldown.current <= 0) {
          doorCooldown.current = 1.0;
          playerPositionRef.current.set(
            VILLA_INTERIOR.ENTRY_POSITION[0],
            VILLA_INTERIOR.ENTRY_POSITION[1],
            VILLA_INTERIOR.ENTRY_POSITION[2],
          );
          enterVilla();
        } else if (nearCaveDoor && doorCooldown.current <= 0) {
          doorCooldown.current = 1.0;
          playerPositionRef.current.set(
            CAVE_INTERIOR.ENTRY_POSITION[0],
            CAVE_INTERIOR.ENTRY_POSITION[1],
            CAVE_INTERIOR.ENTRY_POSITION[2],
          );
          enterCave();
        } else if (nearDockDoor && doorCooldown.current <= 0) {
          doorCooldown.current = 1.0;
          playerPositionRef.current.set(
            DOCK_INTERIOR.ENTRY_POSITION[0],
            DOCK_INTERIOR.ENTRY_POSITION[1],
            DOCK_INTERIOR.ENTRY_POSITION[2],
          );
          enterDock();
        } else if (withinIslandBounds) {
          const resolved = resolveSlide(
            playerPositionRef.current.x, playerPositionRef.current.z,
            nextX, nextZ,
            PLAYER.COLLISION_RADIUS,
            activeCollidersRef.current,
          );
          playerPositionRef.current.x = resolved.x;
          playerPositionRef.current.z = resolved.z;
        }

        // Check locked structure proximity
        if (lockedCooldown.current <= 0 && onLockedStructure) {
          const px = playerPositionRef.current.x;
          const pz = playerPositionRef.current.z;
          if (!isStructureUnlocked('dock', week, day)) {
            const ddx = px - ZONE_POSITIONS.dock[0];
            const ddz = pz - ZONE_POSITIONS.dock[2];
            if (ddx * ddx + ddz * ddz < LOCKED_PROXIMITY_RADIUS * LOCKED_PROXIMITY_RADIUS) {
              lockedCooldown.current = 3.0;
              onLockedStructure('dock');
            }
          }
          if (!isStructureUnlocked('cave', week, day)) {
            const dcx = px - CAVE_POSITION[0];
            const dcz = pz - CAVE_POSITION[2];
            if (dcx * dcx + dcz * dcz < LOCKED_PROXIMITY_RADIUS * LOCKED_PROXIMITY_RADIUS) {
              lockedCooldown.current = 3.0;
              onLockedStructure('cave');
            }
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
      {(isNight || indoorLocation === 'cave') && (
        <pointLight
          color="#ffe8a0"
          intensity={6}
          distance={8}
          decay={2}
          position={[0, 1.2, 0]}
          castShadow={false}
        />
      )}
      <Suspense fallback={null}>
        <FerretCharacter isMoving={isMoving} />
      </Suspense>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Ferret GLB character (rigged model with procedural animation)
// ---------------------------------------------------------------------------

const FERRET_SCALE = 1.2;

/** Look up a bone by name from the skeleton hierarchy */
function findBone(root: THREE.Object3D, name: string): THREE.Bone | null {
  let found: THREE.Bone | null = null;
  root.traverse((child) => {
    if ((child as THREE.Bone).isBone && child.name === name) {
      found = child as THREE.Bone;
    }
  });
  return found;
}

// Reusable quaternion / euler helpers (avoid per-frame allocations)
const _euler = new THREE.Euler();
const _quat = new THREE.Quaternion();

function FerretCharacter({ isMoving }: { isMoving: React.MutableRefObject<boolean> }) {
  const { scene } = useGLTF("/models/Characters/Ferret.glb");
  const modelRef = useRef<THREE.Group>(null);
  const animPhase = useRef(0);

  // Clone with SkeletonUtils so skinned mesh + skeleton bindings are preserved
  const clonedScene = useMemo(() => {
    const clone = cloneSkinnedScene(scene);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  // Cache bone references + their original (bind-pose) quaternions
  const bones = useMemo(() => {
    const names = [
      "Hip", "Waist", "Spine01", "Spine02", "Head",
      "L_Clavicle", "L_Upperarm", "L_Forearm", "L_Hand",
      "R_Clavicle", "R_Upperarm", "R_Forearm", "R_Hand",
      "L_Thigh", "L_Calf", "L_Foot",
      "R_Thigh", "R_Calf", "R_Foot",
    ] as const;

    const map: Record<string, { bone: THREE.Bone; bindQuat: THREE.Quaternion }> = {};
    for (const name of names) {
      const bone = findBone(clonedScene, name);
      if (bone) {
        map[name] = { bone, bindQuat: bone.quaternion.clone() };
      }
    }
    return map;
  }, [clonedScene]);

  // Centre and ground the model based on its bounding box
  const layout = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const targetHeight = 1.2;
    const fitScale = targetHeight / size.y;
    const pivotZ = box.min.z + size.z * 0.75;
    return {
      fitScale,
      offset: new THREE.Vector3(-center.x, -box.min.y, -pivotZ),
    };
  }, [clonedScene]);

  // Helper: apply an additive euler rotation on top of bind pose
  const applyPose = (name: string, rx: number, ry: number, rz: number) => {
    const entry = bones[name];
    if (!entry) return;
    _euler.set(rx, ry, rz);
    _quat.setFromEuler(_euler);
    entry.bone.quaternion.copy(entry.bindQuat).multiply(_quat);
  };

  // ---------------------------------------------------------------------------
  // Probe the actual bone axes on the first few frames so we know exactly
  // which euler rotation brings each arm downward.
  // ---------------------------------------------------------------------------
  const probeResult = useRef<{
    L_axis: 'x' | 'y' | 'z'; L_sign: number;
    R_axis: 'x' | 'y' | 'z'; R_sign: number;
  } | null>(null);
  const frameCount = useRef(0);

  useFrame((_, delta) => {
    if (!modelRef.current) return;

    frameCount.current++;

    // On frame 5, probe each axis to find which one moves the hand downward
    if (!probeResult.current && frameCount.current === 5) {
      const result: { L_axis: 'x'|'y'|'z'; L_sign: number; R_axis: 'x'|'y'|'z'; R_sign: number } = { L_axis: 'x', L_sign: 1, R_axis: 'x', R_sign: 1 };

      for (const [armName, side] of [["L_Upperarm", "L"], ["R_Upperarm", "R"]] as const) {
        const entry = bones[armName];
        const handEntry = bones[side === "L" ? "L_Hand" : "R_Hand"];
        if (!entry || !handEntry) continue;

        // Reset to bind and get baseline hand world position
        entry.bone.quaternion.copy(entry.bindQuat);
        entry.bone.updateWorldMatrix(true, true);
        const baseY = handEntry.bone.getWorldPosition(new THREE.Vector3()).y;

        let bestAxis: 'x' | 'y' | 'z' = 'x';
        let bestSign = 1;
        let lowestY = Infinity;

        // Try each axis with +/- rotation
        for (const axis of ['x', 'y', 'z'] as const) {
          for (const sign of [1, -1]) {
            const testAngle = sign * 1.5;
            _euler.set(
              axis === 'x' ? testAngle : 0,
              axis === 'y' ? testAngle : 0,
              axis === 'z' ? testAngle : 0,
            );
            _quat.setFromEuler(_euler);
            entry.bone.quaternion.copy(entry.bindQuat).multiply(_quat);
            entry.bone.updateWorldMatrix(true, true);
            const handY = handEntry.bone.getWorldPosition(new THREE.Vector3()).y;

            if (handY < lowestY) {
              lowestY = handY;
              bestAxis = axis;
              bestSign = sign;
            }
          }
        }

        // Reset to bind
        entry.bone.quaternion.copy(entry.bindQuat);

        if (side === "L") { result.L_axis = bestAxis; result.L_sign = bestSign; }
        else { result.R_axis = bestAxis; result.R_sign = bestSign; }

        console.log(`[ARM] ${armName}: best axis=${bestAxis} sign=${bestSign} (baseY=${baseY.toFixed(3)} lowestY=${lowestY.toFixed(3)})`);
      }

      probeResult.current = result;
    }

    const walking = isMoving.current;
    const speed = walking ? 8 : 2.5;
    animPhase.current += delta * speed;
    const t = animPhase.current;
    const sin = Math.sin(t);
    const cos = Math.cos(t);
    const breathY = Math.sin(t) * 0.015;
    const probe = probeResult.current;

    // Helper: apply arm pose with down angle + forward tilt + outward splay
    // downAngle: how far down (probed axis), fwd: forward tilt (X), splay: outward from body (Y)
    const applyArm = (armName: string, side: 'L' | 'R', downAngle: number, fwd: number, splay: number) => {
      if (!probe) return;
      const entry = bones[armName];
      if (!entry) return;
      const sign = side === 'L' ? probe.L_sign : probe.R_sign;
      const axis = side === 'L' ? probe.L_axis : probe.R_axis;
      // Outward splay flips direction for left vs right arm
      const splayDir = side === 'L' ? -1 : 1;
      _euler.set(
        fwd + (axis === 'x' ? sign * downAngle : 0),
        splay * splayDir + (axis === 'y' ? sign * downAngle : 0),
        axis === 'z' ? sign * downAngle : 0,
      );
      _quat.setFromEuler(_euler);
      entry.bone.quaternion.copy(entry.bindQuat).multiply(_quat);
    };

    // Arm tuning constants
    const armDown = 1.0;      // ~57° down (was 1.4/~80° — less extreme, more to the sides)
    const armFwd = 0.3;       // forward tilt to bring arms to sides instead of behind
    const armSplay = 0.2;     // outward push to prevent clipping into pudgy body

    if (!walking) {
      // --- IDLE ---
      applyPose("Spine01", sin * 0.02, 0, 0);
      applyPose("Spine02", sin * 0.01, 0, 0);
      applyPose("Head", -sin * 0.03, cos * 0.02, 0);

      // Arms at rest — at sides, slightly forward, splayed out from body
      applyArm("L_Upperarm", "L", armDown, armFwd, armSplay);
      applyArm("R_Upperarm", "R", armDown, armFwd, armSplay);
      // Slight forearm bend so hands aren't stiff
      applyPose("L_Forearm", 0.15, 0, 0);
      applyPose("R_Forearm", 0.15, 0, 0);

      // Legs idle
      applyPose("L_Thigh", 0, 0, 0);
      applyPose("L_Calf", 0, 0, 0);
      applyPose("R_Thigh", 0, 0, 0);
      applyPose("R_Calf", 0, 0, 0);
      applyPose("Hip", 0, 0, 0);
    } else {
      // --- WALK CYCLE ---
      const stride = 0.4;
      const waddle = 0.08;
      const bounce = 0.04;

      applyPose("Hip", 0, 0, Math.sin(t) * waddle);
      applyPose("Spine01", Math.sin(t * 2) * bounce, 0, -Math.sin(t) * waddle * 0.5);
      applyPose("Spine02", 0, Math.sin(t) * 0.05, 0);
      applyPose("Head", 0, -Math.sin(t) * 0.04, -Math.sin(t) * waddle * 0.3);

      // Legs
      const legL = Math.sin(t);
      const legR = Math.sin(t + Math.PI);
      applyPose("L_Thigh", legL * stride, 0, 0);
      applyPose("L_Calf", Math.max(0, -legL) * stride * 0.6, 0, 0);
      applyPose("L_Foot", -legL * stride * 0.3, 0, 0);
      applyPose("R_Thigh", legR * stride, 0, 0);
      applyPose("R_Calf", Math.max(0, -legR) * stride * 0.6, 0, 0);
      applyPose("R_Foot", -legR * stride * 0.3, 0, 0);

      // Arms: gentle flap (oscillate down angle) instead of forward/back swing
      const flapL = Math.sin(t + Math.PI) * 0.15;  // ±0.15 rad flap
      const flapR = Math.sin(t) * 0.15;
      applyArm("L_Upperarm", "L", armDown + flapL, armFwd, armSplay);
      applyArm("R_Upperarm", "R", armDown + flapR, armFwd, armSplay);
      applyPose("L_Forearm", 0.15, 0, 0);
      applyPose("R_Forearm", 0.15, 0, 0);
    }

    // Scale: gentle breathing
    const s = layout.fitScale * FERRET_SCALE;
    const breathScale = 1 + breathY;
    modelRef.current.scale.set(s, s * breathScale, s);
  });

  const s = layout.fitScale * FERRET_SCALE;

  return (
    <group ref={modelRef} scale={[s, s, s]}>
      <primitive
        object={clonedScene}
        position={[layout.offset.x, layout.offset.y, layout.offset.z]}
      />
    </group>
  );
}

useGLTF.preload("/models/Characters/Ferret.glb");

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
