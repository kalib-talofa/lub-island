"use client";

import { useRef, useMemo, useEffect, Suspense } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { clone as cloneSkinnedScene } from "three/examples/jsm/utils/SkeletonUtils.js";
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
  const isNight = useGameStore((s) => s.phase === 'NIGHTTIME_FREE');

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
      {isNight && (
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

    // Helper: apply arm-down rotation using the probed axis
    const applyArmDown = (armName: string, side: 'L' | 'R', angle: number) => {
      if (!probe) return;
      const axis = side === 'L' ? probe.L_axis : probe.R_axis;
      const sign = side === 'L' ? probe.L_sign : probe.R_sign;
      const a = sign * angle;
      _euler.set(
        axis === 'x' ? a : 0,
        axis === 'y' ? a : 0,
        axis === 'z' ? a : 0,
      );
      _quat.setFromEuler(_euler);
      const entry = bones[armName];
      if (entry) entry.bone.quaternion.copy(entry.bindQuat).multiply(_quat);
    };

    if (!walking) {
      // --- IDLE ---
      applyPose("Spine01", sin * 0.02, 0, 0);
      applyPose("Spine02", sin * 0.01, 0, 0);
      applyPose("Head", -sin * 0.03, cos * 0.02, 0);

      // Arms at rest — use probed axis with ~80° down
      applyArmDown("L_Upperarm", "L", 1.4);
      applyArmDown("R_Upperarm", "R", 1.4);
      applyPose("L_Forearm", 0, 0, 0);
      applyPose("R_Forearm", 0, 0, 0);

      // Legs idle
      applyPose("L_Thigh", 0, 0, 0);
      applyPose("L_Calf", 0, 0, 0);
      applyPose("R_Thigh", 0, 0, 0);
      applyPose("R_Calf", 0, 0, 0);
      applyPose("Hip", 0, 0, 0);
    } else {
      // --- WALK CYCLE ---
      const stride = 0.4;
      const armSwing = 0.5;
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

      // Arms: rest (down via Z) + forward/back swing (via X, perpendicular axis)
      const armL = Math.sin(t + Math.PI);
      const armR = Math.sin(t);
      if (probe) {
        // Apply arm-down on probed Z axis, then add swing on X axis
        const lEntry = bones["L_Upperarm"];
        const rEntry = bones["R_Upperarm"];
        if (lEntry) {
          _euler.set(armL * armSwing, 0, probe.L_sign * 1.4);
          _quat.setFromEuler(_euler);
          lEntry.bone.quaternion.copy(lEntry.bindQuat).multiply(_quat);
        }
        if (rEntry) {
          _euler.set(armR * armSwing, 0, probe.R_sign * 1.4);
          _quat.setFromEuler(_euler);
          rEntry.bone.quaternion.copy(rEntry.bindQuat).multiply(_quat);
        }
      }
      applyPose("L_Forearm", 0, 0, 0);
      applyPose("R_Forearm", 0, 0, 0);
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
