"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { playerPositionRef } from "@/scene/PlayerController";

// ---------------------------------------------------------------------------
// InteractionZone - proximity-triggered interaction areas
// ---------------------------------------------------------------------------

interface InteractionZoneProps {
  position: [number, number, number];
  radius: number;
  onEnter: () => void;
  onExit: () => void;
  label?: string;
  /** Show a faint transparent circle on the ground for debug (default: false) */
  debug?: boolean;
}

export default function InteractionZone({
  position,
  radius,
  onEnter,
  onExit,
  label,
  debug = false,
}: InteractionZoneProps) {
  const isInside = useRef(false);
  const labelGroupRef = useRef<THREE.Group>(null);

  // Threshold for showing the label (slightly larger than the zone radius so
  // the player can read the label before entering)
  const labelVisibilityRadius = radius + 2;

  useFrame(() => {
    const dx = playerPositionRef.current.x - position[0];
    const dz = playerPositionRef.current.z - position[2];
    const dist = Math.sqrt(dx * dx + dz * dz);

    // Enter / exit detection
    if (dist < radius && !isInside.current) {
      isInside.current = true;
      onEnter();
    } else if (dist >= radius && isInside.current) {
      isInside.current = false;
      onExit();
    }

    // Show / hide label based on proximity
    if (labelGroupRef.current) {
      labelGroupRef.current.visible = dist < labelVisibilityRadius;
    }
  });

  return (
    <group position={position}>
      {/* Debug: faint transparent circle on the ground */}
      {debug && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[radius - 0.08, radius, 48]} />
          <meshBasicMaterial
            color="#FFFFFF"
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Floating label */}
      {label && (
        <group ref={labelGroupRef} visible={false}>
          <Text
            position={[0, 1.8, 0]}
            fontSize={0.3}
            color="#FFFFFF"
            anchorX="center"
            anchorY="bottom"
            outlineWidth={0.025}
            outlineColor="#000000"
          >
            {label}
          </Text>
        </group>
      )}
    </group>
  );
}
