"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

// ---------------------------------------------------------------------------
// Colour / intensity presets
// ---------------------------------------------------------------------------

// Daytime lighting
const DAY_AMBIENT_INTENSITY = 0.6;
const DAY_DIR_INTENSITY = 1.2;
const DAY_DIR_COLOR = new THREE.Color("#FFF5E0"); // warm sunlight
const DAY_DIR_POSITION: [number, number, number] = [-10, 20, 5]; // upper-left
const DAY_SKY_COLOR = new THREE.Color("#87CEEB"); // hemisphere sky
const DAY_GROUND_COLOR = new THREE.Color("#4A8C3F"); // hemisphere ground
const DAY_HEMI_INTENSITY = 0.5;

// Nighttime lighting
const NIGHT_AMBIENT_INTENSITY = 0.12;
const NIGHT_DIR_INTENSITY = 0.35;
const NIGHT_DIR_COLOR = new THREE.Color("#B0C4DE"); // cool moonlight
const NIGHT_DIR_POSITION: [number, number, number] = [8, 18, -6];
const NIGHT_SKY_COLOR = new THREE.Color("#0A0A2A");
const NIGHT_GROUND_COLOR = new THREE.Color("#1A1A1A");
const NIGHT_HEMI_INTENSITY = 0.15;

// Warm night point-lights (e.g. torches / villa lights)
const NIGHT_POINT_INTENSITY = 1.2;
const NIGHT_POINT_COLOR = new THREE.Color("#FF9944");

const LERP_FACTOR = 0.02; // ~2-3s transition

// ---------------------------------------------------------------------------
// DayNightCycle
// ---------------------------------------------------------------------------

interface DayNightCycleProps {
  isNight: boolean;
}

export default function DayNightCycle({ isNight }: DayNightCycleProps) {
  // Refs for lights we need to animate each frame
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const dirRef = useRef<THREE.DirectionalLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const pointARef = useRef<THREE.PointLight>(null);
  const pointBRef = useRef<THREE.PointLight>(null);
  const starsGroupRef = useRef<THREE.Group>(null);

  // Lerped "nightness" value: 0 = full day, 1 = full night
  const nightAmount = useRef(isNight ? 1 : 0);

  // Scratch colours to avoid per-frame allocations
  const scratch = useMemo(
    () => ({
      dirColor: new THREE.Color(),
      skyColor: new THREE.Color(),
      groundColor: new THREE.Color(),
      dirPos: new THREE.Vector3(),
    }),
    [],
  );

  useFrame(() => {
    // Advance lerp toward target
    const target = isNight ? 1 : 0;
    nightAmount.current += (target - nightAmount.current) * LERP_FACTOR;
    const t = nightAmount.current;

    // ---- ambient light ---------------------------------------------------
    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        DAY_AMBIENT_INTENSITY,
        NIGHT_AMBIENT_INTENSITY,
        t,
      );
    }

    // ---- directional light -----------------------------------------------
    if (dirRef.current) {
      dirRef.current.intensity = THREE.MathUtils.lerp(
        DAY_DIR_INTENSITY,
        NIGHT_DIR_INTENSITY,
        t,
      );
      scratch.dirColor.copy(DAY_DIR_COLOR).lerp(NIGHT_DIR_COLOR, t);
      dirRef.current.color.copy(scratch.dirColor);

      scratch.dirPos.set(
        THREE.MathUtils.lerp(DAY_DIR_POSITION[0], NIGHT_DIR_POSITION[0], t),
        THREE.MathUtils.lerp(DAY_DIR_POSITION[1], NIGHT_DIR_POSITION[1], t),
        THREE.MathUtils.lerp(DAY_DIR_POSITION[2], NIGHT_DIR_POSITION[2], t),
      );
      dirRef.current.position.copy(scratch.dirPos);
    }

    // ---- hemisphere light ------------------------------------------------
    if (hemiRef.current) {
      hemiRef.current.intensity = THREE.MathUtils.lerp(
        DAY_HEMI_INTENSITY,
        NIGHT_HEMI_INTENSITY,
        t,
      );
      scratch.skyColor.copy(DAY_SKY_COLOR).lerp(NIGHT_SKY_COLOR, t);
      scratch.groundColor.copy(DAY_GROUND_COLOR).lerp(NIGHT_GROUND_COLOR, t);
      hemiRef.current.color.copy(scratch.skyColor);
      hemiRef.current.groundColor.copy(scratch.groundColor);
    }

    // ---- warm night point lights -----------------------------------------
    if (pointARef.current) {
      pointARef.current.intensity = THREE.MathUtils.lerp(0, NIGHT_POINT_INTENSITY, t);
    }
    if (pointBRef.current) {
      pointBRef.current.intensity = THREE.MathUtils.lerp(0, NIGHT_POINT_INTENSITY, t);
    }

    // ---- stars fade ------------------------------------------------------
    if (starsGroupRef.current) {
      // Use a steeper curve so stars only appear when fairly dark
      const starsOpacity = THREE.MathUtils.clamp((t - 0.4) / 0.6, 0, 1);
      starsGroupRef.current.visible = starsOpacity > 0.01;
      // Scale trick: drei <Stars> uses point materials so we adjust group
      // opacity via children traversal on first visible frame only when
      // value changes meaningfully.
      starsGroupRef.current.traverse((child) => {
        const asPoints = child as unknown as { isPoints?: boolean; material?: THREE.PointsMaterial };
        if (asPoints.isPoints && asPoints.material) {
          asPoints.material.transparent = true;
          asPoints.material.opacity = starsOpacity;
        }
      });
    }
  });

  return (
    <>
      {/* Ambient */}
      <ambientLight ref={ambientRef} intensity={DAY_AMBIENT_INTENSITY} />

      {/* Main directional (sun / moon) */}
      <directionalLight
        ref={dirRef}
        color={DAY_DIR_COLOR}
        intensity={DAY_DIR_INTENSITY}
        position={DAY_DIR_POSITION}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Hemisphere fill */}
      <hemisphereLight
        ref={hemiRef}
        args={[DAY_SKY_COLOR, DAY_GROUND_COLOR, DAY_HEMI_INTENSITY]}
      />

      {/* Night warm point lights (villa area, dock area) */}
      <pointLight
        ref={pointARef}
        color={NIGHT_POINT_COLOR}
        intensity={0}
        distance={12}
        decay={2}
        position={[0, 2, 0]}
      />
      <pointLight
        ref={pointBRef}
        color={NIGHT_POINT_COLOR}
        intensity={0}
        distance={10}
        decay={2}
        position={[12, 2, 16]}
      />

      {/* Starfield – drei Stars component wrapped in a group for fading */}
      <group ref={starsGroupRef} visible={false}>
        <Stars
          radius={80}
          depth={60}
          count={1500}
          factor={3}
          saturation={0.1}
          fade
          speed={0.5}
        />
      </group>
    </>
  );
}
