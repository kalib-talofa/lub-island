"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const DROP_COUNT = 1800;
const AREA = 65;       // coverage radius in world units
const SPAWN_HEIGHT = 35;
const DROP_SPEED = 18; // base units/sec
const DROP_SPEED_VARIANCE = 8;
const DROP_LENGTH = 0.9;

export default function RainSystem({ isNight }: { isNight: boolean }) {
  const linesRef = useRef<THREE.LineSegments>(null);

  // Build geometry and per-drop speed once
  const { geometry, speeds } = useMemo(() => {
    const positions = new Float32Array(DROP_COUNT * 6); // 2 verts × 3 coords
    const speeds = new Float32Array(DROP_COUNT);

    for (let i = 0; i < DROP_COUNT; i++) {
      const x = (Math.random() - 0.5) * AREA;
      const y = Math.random() * SPAWN_HEIGHT;
      const z = (Math.random() - 0.5) * AREA;

      positions[i * 6 + 0] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = z;
      positions[i * 6 + 3] = x;
      positions[i * 6 + 4] = y - DROP_LENGTH;
      positions[i * 6 + 5] = z;

      speeds[i] = DROP_SPEED + Math.random() * DROP_SPEED_VARIANCE;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geometry: geo, speeds };
  }, []);

  useFrame((_, delta) => {
    if (!linesRef.current) return;
    const pos = linesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < DROP_COUNT; i++) {
      const dy = speeds[i] * delta;
      pos[i * 6 + 1] -= dy;
      pos[i * 6 + 4] -= dy;

      // Reset drop to top when it reaches the ground
      if (pos[i * 6 + 4] < 0) {
        const x = (Math.random() - 0.5) * AREA;
        const z = (Math.random() - 0.5) * AREA;
        const y = SPAWN_HEIGHT + Math.random() * 5;

        pos[i * 6 + 0] = x;
        pos[i * 6 + 1] = y;
        pos[i * 6 + 2] = z;
        pos[i * 6 + 3] = x;
        pos[i * 6 + 4] = y - DROP_LENGTH;
        pos[i * 6 + 5] = z;
      }
    }

    linesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial
        color={isNight ? "#6688AA" : "#99BBCC"}
        transparent
        opacity={0.45}
      />
    </lineSegments>
  );
}
