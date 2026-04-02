'use client';

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EGG_RACE } from '@/game/constants';

// ---------------------------------------------------------------------------
// RaceField — 3D egg spoon race arena, rendered off-island at EGG_RACE.FIELD_Z.
// ChallengeUI writes animation state to raceSimRef each frame;
// useFrame reads from it here (no React re-renders needed).
// ---------------------------------------------------------------------------

export interface RacerState {
  id: string;
  posX: number;       // -10 to +10 along field X axis
  laneZ: number;      // fixed lane offset (relative to field group)
  direction: number;  // 1 = running right, -1 = running left
  hasEgg: boolean;
  isDropping: boolean;
  visible: boolean;
  bobPhase: number;   // radians, advances during run for bounce anim
  color: string;      // hex
}

/** Written by ChallengeUI (rAF loop), read by RaceField (useFrame). */
export const raceSimRef: { current: RacerState[] } = { current: [] };

const MAX_RACERS = 8;

export default function RaceField() {
  const slotRefs = useMemo(
    () => Array.from({ length: MAX_RACERS }, () => ({ current: null as THREE.Group | null })),
    [],
  );
  const eggRefs = useMemo(
    () => Array.from({ length: MAX_RACERS }, () => ({ current: null as THREE.Mesh | null })),
    [],
  );
  const bodyMatRefs = useMemo(
    () =>
      Array.from({ length: MAX_RACERS }, () => ({
        current: null as THREE.MeshLambertMaterial | null,
      })),
    [],
  );
  const headMatRefs = useMemo(
    () =>
      Array.from({ length: MAX_RACERS }, () => ({
        current: null as THREE.MeshLambertMaterial | null,
      })),
    [],
  );

  useFrame(() => {
    const racers = raceSimRef.current;
    for (let i = 0; i < MAX_RACERS; i++) {
      const group = slotRefs[i].current;
      if (!group) continue;
      const racer = racers[i];
      if (!racer || !racer.visible) {
        group.visible = false;
        continue;
      }
      group.visible = true;
      group.position.set(
        racer.posX,
        racer.isDropping ? 0 : Math.sin(racer.bobPhase) * 0.09,
        racer.laneZ,
      );
      bodyMatRefs[i].current?.color.set(racer.color);
      headMatRefs[i].current?.color.set(racer.color);
      const egg = eggRefs[i].current;
      if (egg) egg.visible = racer.hasEgg && !racer.isDropping;
    }
  });

  const HX = EGG_RACE.FIELD_HALF_X;       // 10
  const LS = EGG_RACE.LANE_SPACING;        // 2.5
  const FIELD_HALF_Z = LS * 2;             // 5 — covers 3 lanes + margin

  return (
    <group position={[0, 0, EGG_RACE.FIELD_Z]}>
      {/* Grass platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[HX * 2 + 6, FIELD_HALF_Z * 2 + 2]} />
        <meshLambertMaterial color="#3a8a3a" />
      </mesh>

      {/* Dirt track surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[HX * 2 + 1, FIELD_HALF_Z * 2 - 0.5]} />
        <meshLambertMaterial color="#c8a76a" />
      </mesh>

      {/* Start stripe (left) */}
      <mesh position={[-HX, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.35, FIELD_HALF_Z * 2]} />
        <meshBasicMaterial color="white" />
      </mesh>

      {/* End stripe (right) */}
      <mesh position={[HX, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.35, FIELD_HALF_Z * 2]} />
        <meshBasicMaterial color="white" />
      </mesh>

      {/* Lane dividers */}
      {[-LS / 2, LS / 2].map((z) => (
        <mesh key={z} position={[0, 0.01, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[HX * 2 + 1, 0.12]} />
          <meshBasicMaterial color="rgba(255,255,255,0.4)" />
        </mesh>
      ))}

      {/* Corner flag poles at each end */}
      {([-HX, HX] as number[]).flatMap((x) =>
        ([-FIELD_HALF_Z + 0.5, FIELD_HALF_Z - 0.5] as number[]).map((z) => (
          <group key={`fp-${x}-${z}`} position={[x, 0, z]}>
            <mesh position={[0, 0.75, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 1.5, 6]} />
              <meshLambertMaterial color="#b08040" />
            </mesh>
            <mesh position={[x < 0 ? 0.22 : -0.22, 1.47, 0]}>
              <boxGeometry args={[0.44, 0.28, 0.06]} />
              <meshLambertMaterial color={x < 0 ? '#ee3333' : '#ffdd00'} />
            </mesh>
          </group>
        )),
      )}

      {/* Pre-allocated racer slots (hidden until race starts) */}
      {Array.from({ length: MAX_RACERS }, (_, i) => (
        <group
          key={i}
          ref={(el) => { slotRefs[i].current = el as THREE.Group | null; }}
          visible={false}
        >
          {/* Body */}
          <mesh castShadow position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.18, 0.2, 0.72, 8]} />
            <meshLambertMaterial
              ref={(el) => {
                bodyMatRefs[i].current = el as THREE.MeshLambertMaterial | null;
              }}
              color="#888888"
            />
          </mesh>
          {/* Head */}
          <mesh castShadow position={[0, 1.05, 0]}>
            <sphereGeometry args={[0.21, 8, 6]} />
            <meshLambertMaterial
              ref={(el) => {
                headMatRefs[i].current = el as THREE.MeshLambertMaterial | null;
              }}
              color="#888888"
            />
          </mesh>
          {/* Egg (shown when carrier has egg and not dropping) */}
          <mesh
            ref={(el) => { eggRefs[i].current = el as THREE.Mesh | null; }}
            position={[0.3, 0.88, 0]}
            visible={false}
          >
            <sphereGeometry args={[0.12, 7, 5]} />
            <meshLambertMaterial color="#fffde7" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
