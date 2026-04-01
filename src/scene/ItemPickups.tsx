"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { playerPositionRef } from "@/scene/PlayerController";
import type { DroppedItem } from "@/systems/items";

const PICKUP_RADIUS = 1.8;

// Item colours per type
const ITEM_COLORS: Record<string, string> = {
  flowers: "#FF69B4",
  chocolate: "#8B4513",
  book: "#4169E1",
  sunglasses: "#FFD700",
  producer_phone: "#00FF88",
};

function getItemColor(itemId: string): string {
  if (itemId.startsWith("journal_")) return "#C8A8E8";
  return ITEM_COLORS[itemId] ?? "#FFFFFF";
}

const ITEM_LABELS: Record<string, string> = {
  flowers: "\u{1F490}",
  chocolate: "\u{1F36B}",
  book: "\u{1F4D6}",
  sunglasses: "\u{1F576}\u{FE0F}",
  producer_phone: "\u{1F4F1}",
};

function getItemLabel(itemId: string): string {
  if (itemId.startsWith("journal_")) return "\u{1F4D3}";
  return ITEM_LABELS[itemId] ?? "?";
}

// ---------------------------------------------------------------------------
// Single pickup
// ---------------------------------------------------------------------------

interface PickupProps {
  drop: DroppedItem;
  onPickup: (dropId: string) => void;
}

function Pickup({ drop, onPickup }: PickupProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const phase = useRef(Math.random() * 10); // stagger animation
  const pickedUp = useRef(false);

  const color = useMemo(() => getItemColor(drop.item.id), [drop.item.id]);
  const label = useMemo(() => getItemLabel(drop.item.id), [drop.item.id]);

  useFrame((_, delta) => {
    if (pickedUp.current) return;
    if (!meshRef.current) return;

    phase.current += delta;

    // Gentle bob + spin
    const bob = Math.sin(phase.current * 2) * 0.15;
    meshRef.current.position.y = drop.position[1] + 0.3 + bob;
    meshRef.current.rotation.y += delta * 1.5;

    // Pulse glow
    if (glowRef.current) {
      glowRef.current.intensity = 1.4 + Math.sin(phase.current * 3) * 0.6;
    }

    // Check player distance for auto-pickup
    const dx = playerPositionRef.current.x - drop.position[0];
    const dz = playerPositionRef.current.z - drop.position[2];
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < PICKUP_RADIUS) {
      pickedUp.current = true;
      onPickup(drop.dropId);
    }
  });

  return (
    <group position={[drop.position[0], 0, drop.position[2]]}>
      {/* Glowing item sphere */}
      <mesh ref={meshRef} position={[0, drop.position[1] + 0.3, 0]}>
        <dodecahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          toneMapped={false}
          roughness={0.3}
        />
      </mesh>

      {/* Point light glow */}
      <pointLight
        ref={glowRef}
        position={[0, 0.5, 0]}
        color={color}
        intensity={1}
        distance={4}
        decay={2}
      />

      {/* Label floating above */}
      <Text
        position={[0, 1.0, 0]}
        fontSize={0.3}
        anchorX="center"
        anchorY="bottom"
      >
        {label}
      </Text>

      {/* Ground ring indicator */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.45, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// ItemPickups controller
// ---------------------------------------------------------------------------

interface ItemPickupsProps {
  drops: DroppedItem[];
  onPickup: (dropId: string) => void;
}

export default function ItemPickups({ drops, onPickup }: ItemPickupsProps) {
  return (
    <>
      {drops.map((drop) => (
        <Pickup key={drop.dropId} drop={drop} onPickup={onPickup} />
      ))}
    </>
  );
}
