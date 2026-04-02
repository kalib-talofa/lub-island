"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

// ---------------------------------------------------------------------------
// Colour / intensity presets
// ---------------------------------------------------------------------------

// Daytime lighting
const DAY_AMBIENT_INTENSITY = 0.8;
const DAY_DIR_INTENSITY = 1.5;
const DAY_DIR_COLOR = new THREE.Color("#FFF5E0"); // warm sunlight
const DAY_DIR_POSITION: [number, number, number] = [-10, 20, 5]; // upper-left
const DAY_SKY_COLOR = new THREE.Color("#87CEEB"); // hemisphere sky
const DAY_GROUND_COLOR = new THREE.Color("#4A8C3F"); // hemisphere ground
const DAY_HEMI_INTENSITY = 0.6;

// Nighttime lighting — brighter than before so gameplay is visible
const NIGHT_AMBIENT_INTENSITY = 0.35;
const NIGHT_DIR_INTENSITY = 0.45;
const NIGHT_DIR_COLOR = new THREE.Color("#C8B8E8"); // soft purple moonlight
const NIGHT_DIR_POSITION: [number, number, number] = [8, 18, -6];
const NIGHT_SKY_COLOR = new THREE.Color("#2A1A40"); // dark purple sky
const NIGHT_GROUND_COLOR = new THREE.Color("#1A1A30"); // purple-tinted ground
const NIGHT_HEMI_INTENSITY = 0.3;

// Rainy day lighting — overcast, grey-blue, diffuse
const RAIN_AMBIENT_INTENSITY = 0.5;
const RAIN_DIR_INTENSITY = 0.4;
const RAIN_DIR_COLOR = new THREE.Color("#B0C0D0"); // cool grey-blue
const RAIN_SKY_COLOR = new THREE.Color("#6A7F8E"); // overcast sky
const RAIN_GROUND_COLOR = new THREE.Color("#3A4A38"); // dark wet ground
const RAIN_HEMI_INTENSITY = 0.55;

// Warm night point-lights (torches / villa lights) — stronger emissive feel
const NIGHT_POINT_INTENSITY = 2.5;
const NIGHT_POINT_COLOR = new THREE.Color("#FF9944");

const LERP_FACTOR = 0.02; // ~2-3s transition

// ---------------------------------------------------------------------------
// DayNightCycle
// ---------------------------------------------------------------------------

interface DayNightCycleProps {
  isNight: boolean;
  isRainy: boolean;
}

export default function DayNightCycle({ isNight, isRainy }: DayNightCycleProps) {
  // Refs for lights we need to animate each frame
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const dirRef = useRef<THREE.DirectionalLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const pointARef = useRef<THREE.PointLight>(null);
  const pointBRef = useRef<THREE.PointLight>(null);
  const starsGroupRef = useRef<THREE.Group>(null);

  // Lerped "nightness" value: 0 = full day, 1 = full night
  const nightAmount = useRef(isNight ? 1 : 0);
  // Lerped "raininess" value: 0 = clear, 1 = full rain
  const rainAmount = useRef(isRainy ? 1 : 0);

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
    // Advance lerps toward targets
    const nightTarget = isNight ? 1 : 0;
    nightAmount.current += (nightTarget - nightAmount.current) * LERP_FACTOR;
    const t = nightAmount.current;

    const rainTarget = isRainy ? 1 : 0;
    rainAmount.current += (rainTarget - rainAmount.current) * LERP_FACTOR;
    const r = rainAmount.current;

    // ---- ambient light ---------------------------------------------------
    // Day base blends toward rain, then that blends toward night
    if (ambientRef.current) {
      const dayBase = THREE.MathUtils.lerp(DAY_AMBIENT_INTENSITY, RAIN_AMBIENT_INTENSITY, r);
      ambientRef.current.intensity = THREE.MathUtils.lerp(dayBase, NIGHT_AMBIENT_INTENSITY, t);
    }

    // ---- directional light -----------------------------------------------
    if (dirRef.current) {
      const dayBase = THREE.MathUtils.lerp(DAY_DIR_INTENSITY, RAIN_DIR_INTENSITY, r);
      dirRef.current.intensity = THREE.MathUtils.lerp(dayBase, NIGHT_DIR_INTENSITY, t);

      // Color: day→rain by r, then →night by t
      scratch.dirColor.copy(DAY_DIR_COLOR).lerp(RAIN_DIR_COLOR, r).lerp(NIGHT_DIR_COLOR, t);
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
      const dayHemiBase = THREE.MathUtils.lerp(DAY_HEMI_INTENSITY, RAIN_HEMI_INTENSITY, r);
      hemiRef.current.intensity = THREE.MathUtils.lerp(dayHemiBase, NIGHT_HEMI_INTENSITY, t);

      scratch.skyColor.copy(DAY_SKY_COLOR).lerp(RAIN_SKY_COLOR, r).lerp(NIGHT_SKY_COLOR, t);
      scratch.groundColor.copy(DAY_GROUND_COLOR).lerp(RAIN_GROUND_COLOR, r).lerp(NIGHT_GROUND_COLOR, t);
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
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.002}
        shadow-normalBias={0.05}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />

      {/* Hemisphere fill */}
      <hemisphereLight
        ref={hemiRef}
        args={[DAY_SKY_COLOR, DAY_GROUND_COLOR, DAY_HEMI_INTENSITY]}
      />

      {/* Night warm point lights (villa area, beach/bonfire area) */}
      <pointLight
        ref={pointARef}
        color={NIGHT_POINT_COLOR}
        intensity={0}
        distance={18}
        decay={1.5}
        position={[0, 3, 0]}
      />
      <pointLight
        ref={pointBRef}
        color={NIGHT_POINT_COLOR}
        intensity={0}
        distance={15}
        decay={1.5}
        position={[0, 2, 16]}
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
