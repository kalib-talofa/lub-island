'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EGG_RACE } from '@/game/constants';
import { NPCCharacter } from '@/scene/NPCController';
import type { AnimalSpecies } from '@/characters/CharacterData';

// ---------------------------------------------------------------------------
// RaceField — 3D egg spoon race arena positioned off-island at FIELD_Z.
//
// Two external refs:
//  raceSimRef   — written each frame by ChallengeUI (posX, hasEgg, isDropping,
//                 bobPhase, visible).  Slot 0 = player (usually invisible since
//                 the actual Ferret model handles it).
//  raceDefsRef  — written ONCE by ChallengeUI at race start (species, bodyColor,
//                 laneZ per slot).  RaceField polls for it in useFrame and
//                 triggers one React re-render to build the character mesh tree.
// ---------------------------------------------------------------------------

export interface RacerState {
  id: string;
  posX: number;       // -FIELD_HALF_X to +FIELD_HALF_X
  laneZ: number;      // fixed lane offset (relative to field group)
  direction: number;  // 1 = right, -1 = left
  hasEgg: boolean;
  isDropping: boolean;
  visible: boolean;
  bobPhase: number;
}

export interface RacerDef {
  id: string;
  species: AnimalSpecies;
  laneZ: number;
}

/** Per-frame simulation state — written by ChallengeUI rAF loop. */
export const raceSimRef: { current: RacerState[] } = { current: [] };

/** One-time racer definitions — written by ChallengeUI on race start, reset on unmount. */
export const raceDefsRef: { current: RacerDef[] } = { current: [] };

const MAX_RACERS = 8;

export default function RaceField() {
  const [racerDefs, setRacerDefs] = useState<RacerDef[]>([]);
  const defsLoadedRef = useRef(false);

  // Group refs and egg refs — indexed 0..MAX_RACERS-1
  const slotRefs = useMemo(
    () => Array.from({ length: MAX_RACERS }, () => ({ current: null as THREE.Group | null })),
    [],
  );
  const eggRefs = useMemo(
    () => Array.from({ length: MAX_RACERS }, () => ({ current: null as THREE.Mesh | null })),
    [],
  );

  useFrame(() => {
    // Reset when ChallengeUI clears defs (race ended / unmounted)
    if (defsLoadedRef.current && raceDefsRef.current.length === 0) {
      defsLoadedRef.current = false;
      setRacerDefs([]);
    }
    // One-time load: pick up racer defs when ChallengeUI populates them
    if (!defsLoadedRef.current && raceDefsRef.current.length > 0) {
      defsLoadedRef.current = true;
      setRacerDefs([...raceDefsRef.current]);
    }

    // Per-frame: update group positions from raceSimRef
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
        racer.isDropping ? 0 : Math.sin(racer.bobPhase) * 0.08,
        racer.laneZ,
      );
      const egg = eggRefs[i].current;
      if (egg) egg.visible = racer.hasEgg && !racer.isDropping;
    }
  });

  const HX = EGG_RACE.FIELD_HALF_X;
  const LS = EGG_RACE.LANE_SPACING;
  const HALF_Z = LS * 2 + 0.5;

  return (
    <group position={[0, 0, EGG_RACE.FIELD_Z]}>
      {/* Grass base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[HX * 2 + 5, HALF_Z * 2 + 1.5]} />
        <meshLambertMaterial color="#3a8a3a" />
      </mesh>

      {/* Dirt track */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[HX * 2 + 1, HALF_Z * 2]} />
        <meshLambertMaterial color="#c8a76a" />
      </mesh>

      {/* Start line */}
      <mesh position={[-HX, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.25, HALF_Z * 2]} />
        <meshBasicMaterial color="white" />
      </mesh>

      {/* End line */}
      <mesh position={[HX, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.25, HALF_Z * 2]} />
        <meshBasicMaterial color="white" />
      </mesh>

      {/* Lane dividers */}
      {[-LS / 2, LS / 2].map((z) => (
        <mesh key={z} position={[0, 0.012, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[HX * 2 + 1, 0.08]} />
          <meshBasicMaterial color="rgba(255,255,255,0.5)" />
        </mesh>
      ))}

      {/* Corner flag poles */}
      {([-HX, HX] as number[]).flatMap((x) =>
        ([-HALF_Z + 0.3, HALF_Z - 0.3] as number[]).map((z) => (
          <group key={`fp-${x}-${z}`} position={[x, 0, z]}>
            <mesh position={[0, 0.65, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 1.3, 6]} />
              <meshLambertMaterial color="#b08040" />
            </mesh>
            <mesh position={[x < 0 ? 0.18 : -0.18, 1.25, 0]}>
              <boxGeometry args={[0.36, 0.22, 0.05]} />
              <meshLambertMaterial color={x < 0 ? '#ee3333' : '#ffdd00'} />
            </mesh>
          </group>
        )),
      )}

      {/* Pre-allocated character slots */}
      {Array.from({ length: MAX_RACERS }, (_, i) => {
        const def = racerDefs[i];
        return (
          <group
            key={i}
            ref={(el) => { slotRefs[i].current = el as THREE.Group | null; }}
            visible={false}
          >
            {def && (
              <>
                <NPCCharacter species={def.species} />
                {/* Egg carried above the character's hand */}
                <mesh
                  ref={(el) => { eggRefs[i].current = el as THREE.Mesh | null; }}
                  position={[0.3, 0.8, 0]}
                  visible={false}
                >
                  <sphereGeometry args={[0.1, 7, 5]} />
                  <meshLambertMaterial color="#fffde7" />
                </mesh>
              </>
            )}
          </group>
        );
      })}
    </group>
  );
}
