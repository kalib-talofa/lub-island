"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { STARTING_CAST } from "@/characters/roster";

// ---------------------------------------------------------------------------
// Villa Interior — "bigger on the inside" room with NPC beds & decorations
// ---------------------------------------------------------------------------

// Bed assignments: each NPC gets a bed spot along the walls
const BED_POSITIONS: { npcId: string; position: [number, number, number]; rotation: number }[] = [
  // Left wall beds (facing right)
  { npcId: 'rosie',    position: [-7, 0, -3],  rotation: Math.PI / 2 },
  { npcId: 'blaze',    position: [-7, 0, 0],   rotation: Math.PI / 2 },
  { npcId: 'pudge',    position: [-7, 0, 3],   rotation: Math.PI / 2 },
  // Right wall beds (facing left)
  { npcId: 'kiki',     position: [7, 0, -3],   rotation: -Math.PI / 2 },
  { npcId: 'sprocket', position: [7, 0, 0],    rotation: -Math.PI / 2 },
  { npcId: 'lily',     position: [7, 0, 3],    rotation: -Math.PI / 2 },
];

// NPC colour mapping for bed sheets
const NPC_COLORS: Record<string, string> = {
  rosie:    '#F4A6C0',
  blaze:    '#FF8C42',
  pudge:    '#D4A574',
  kiki:     '#C8A8E8',
  sprocket: '#FFD866',
  lily:     '#7ED67E',
};

interface VillaInteriorProps {
  isNight: boolean;
}

// Individual bed with frame, mattress, pillow, and name tag
function Bed({ npcId, position, rotation, isNight }: {
  npcId: string;
  position: [number, number, number];
  rotation: number;
  isNight: boolean;
}) {
  const npc = STARTING_CAST.find(c => c.id === npcId);
  const color = NPC_COLORS[npcId] ?? '#888888';
  const name = npc?.name ?? npcId;

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Bed frame */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[1.2, 0.15, 2.2]} />
        <meshStandardMaterial color={isNight ? '#4a3728' : '#6B4423'} roughness={0.9} />
      </mesh>

      {/* Mattress */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.0, 0.15, 2.0]} />
        <meshStandardMaterial color="white" roughness={0.8} />
      </mesh>

      {/* Blanket / sheets in NPC colour */}
      <mesh position={[0, 0.44, 0.2]}>
        <boxGeometry args={[0.95, 0.06, 1.4]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      {/* Pillow */}
      <mesh position={[0, 0.46, -0.7]}>
        <boxGeometry args={[0.6, 0.1, 0.35]} />
        <meshStandardMaterial color="#F5F0E6" roughness={0.8} />
      </mesh>

      {/* Headboard */}
      <mesh position={[0, 0.6, -1.05]} castShadow>
        <boxGeometry args={[1.2, 0.65, 0.1]} />
        <meshStandardMaterial color={isNight ? '#3d2e1e' : '#5C3A1E'} roughness={0.85} />
      </mesh>

      {/* Bedside table */}
      <mesh position={[0.8, 0.25, -0.6]} castShadow>
        <boxGeometry args={[0.35, 0.5, 0.35]} />
        <meshStandardMaterial color={isNight ? '#4a3728' : '#6B4423'} roughness={0.85} />
      </mesh>

      {/* Name tag on wall behind bed */}
      <mesh position={[0, 1.1, -1.12]}>
        <boxGeometry args={[0.8, 0.25, 0.02]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
    </group>
  );
}

export default function VillaInterior({ isNight }: VillaInteriorProps) {
  const wallColor = isNight ? '#2a2520' : '#E8DCC8';
  const floorColor = isNight ? '#3d3530' : '#C4A66A';
  const ceilingColor = isNight ? '#2a2520' : '#DDD5C0';
  const trimColor = isNight ? '#4a3728' : '#6B4423';

  // Room dimensions — bigger on the inside!
  const roomW = 18;
  const roomD = 14;
  const roomH = 4;

  return (
    <group>
      {/* Floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[roomW, roomD]} />
        <meshStandardMaterial color={floorColor} roughness={0.95} />
      </mesh>

      {/* Floor rug — central decorative rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color={isNight ? '#4a2030' : '#9B4D6E'} roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <planeGeometry args={[5.2, 3.2]} />
        <meshStandardMaterial color={isNight ? '#5a2a3a' : '#B8607A'} roughness={0.9} />
      </mesh>

      {/* No ceiling rendered — isometric camera looks down from above */}

      {/* Back wall (north, -Z) */}
      <mesh position={[0, roomH / 2, -roomD / 2]} receiveShadow>
        <planeGeometry args={[roomW, roomH]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} />
      </mesh>

      {/* Left wall (-X) */}
      <mesh position={[-roomW / 2, roomH / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[roomD, roomH]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} />
      </mesh>

      {/* Right wall (+X) */}
      <mesh position={[roomW / 2, roomH / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[roomD, roomH]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} />
      </mesh>

      {/* Front wall (+Z) — with door opening */}
      {/* Left section of front wall */}
      <mesh position={[-roomW / 4 - 0.5, roomH / 2, roomD / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[roomW / 2 - 1, roomH]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* Right section of front wall */}
      <mesh position={[roomW / 4 + 0.5, roomH / 2, roomD / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[roomW / 2 - 1, roomH]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* Top of door frame */}
      <mesh position={[0, roomH - 0.5, roomD / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2, 1]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Door frame trim */}
      <mesh position={[-1, roomH / 2 - 0.5, roomD / 2 - 0.02]}>
        <boxGeometry args={[0.12, roomH - 1, 0.08]} />
        <meshStandardMaterial color={trimColor} roughness={0.85} />
      </mesh>
      <mesh position={[1, roomH / 2 - 0.5, roomD / 2 - 0.02]}>
        <boxGeometry args={[0.12, roomH - 1, 0.08]} />
        <meshStandardMaterial color={trimColor} roughness={0.85} />
      </mesh>

      {/* Door mat */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, roomD / 2 - 0.8]}>
        <planeGeometry args={[1.6, 0.8]} />
        <meshStandardMaterial color={isNight ? '#3a3020' : '#8B7355'} roughness={0.95} />
      </mesh>

      {/* EXIT sign above door */}
      <mesh position={[0, 3.2, roomD / 2 - 0.06]}>
        <boxGeometry args={[1.2, 0.3, 0.04]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.3} roughness={0.5} />
      </mesh>

      {/* Wall trim / baseboard along all walls */}
      <mesh position={[0, 0.08, -roomD / 2 + 0.04]}>
        <boxGeometry args={[roomW, 0.16, 0.08]} />
        <meshStandardMaterial color={trimColor} roughness={0.85} />
      </mesh>
      <mesh position={[-roomW / 2 + 0.04, 0.08, 0]}>
        <boxGeometry args={[0.08, 0.16, roomD]} />
        <meshStandardMaterial color={trimColor} roughness={0.85} />
      </mesh>
      <mesh position={[roomW / 2 - 0.04, 0.08, 0]}>
        <boxGeometry args={[0.08, 0.16, roomD]} />
        <meshStandardMaterial color={trimColor} roughness={0.85} />
      </mesh>

      {/* Beds */}
      {BED_POSITIONS.map((bed) => (
        <Bed
          key={bed.npcId}
          npcId={bed.npcId}
          position={bed.position}
          rotation={bed.rotation}
          isNight={isNight}
        />
      ))}

      {/* Central lounge area — couch */}
      <mesh position={[0, 0.35, -1]} castShadow>
        <boxGeometry args={[3, 0.4, 1.0]} />
        <meshStandardMaterial color={isNight ? '#3a2830' : '#7B4D6E'} roughness={0.8} />
      </mesh>
      {/* Couch back */}
      <mesh position={[0, 0.7, -1.4]} castShadow>
        <boxGeometry args={[3, 0.5, 0.2]} />
        <meshStandardMaterial color={isNight ? '#3a2830' : '#7B4D6E'} roughness={0.8} />
      </mesh>
      {/* Couch arm rests */}
      <mesh position={[-1.4, 0.55, -1]} castShadow>
        <boxGeometry args={[0.2, 0.5, 1.0]} />
        <meshStandardMaterial color={isNight ? '#3a2830' : '#7B4D6E'} roughness={0.8} />
      </mesh>
      <mesh position={[1.4, 0.55, -1]} castShadow>
        <boxGeometry args={[0.2, 0.5, 1.0]} />
        <meshStandardMaterial color={isNight ? '#3a2830' : '#7B4D6E'} roughness={0.8} />
      </mesh>

      {/* Coffee table */}
      <mesh position={[0, 0.25, 0.8]} castShadow>
        <boxGeometry args={[1.6, 0.08, 0.8]} />
        <meshStandardMaterial color={isNight ? '#4a3728' : '#6B4423'} roughness={0.85} />
      </mesh>
      {/* Table legs */}
      {[[-0.65, 0.12, 0.25], [0.65, 0.12, 0.25], [-0.65, 0.12, -0.25], [0.65, 0.12, -0.25]].map((p, i) => (
        <mesh key={`tl-${i}`} position={[p[0], p[1] + 0.8 - 0.12, p[2] + 0.8]}>
          <cylinderGeometry args={[0.04, 0.04, 0.24, 6]} />
          <meshStandardMaterial color={isNight ? '#4a3728' : '#6B4423'} roughness={0.85} />
        </mesh>
      ))}

      {/* Interior lighting */}
      <pointLight
        position={[0, 3.5, 0]}
        intensity={isNight ? 0.6 : 1.2}
        color={isNight ? '#FFD080' : '#FFF8F0'}
        distance={20}
        decay={1.5}
      />
      {/* Secondary fill lights */}
      <pointLight
        position={[-6, 2.5, 0]}
        intensity={isNight ? 0.3 : 0.5}
        color={isNight ? '#FFD080' : '#FFF8F0'}
        distance={12}
        decay={2}
      />
      <pointLight
        position={[6, 2.5, 0]}
        intensity={isNight ? 0.3 : 0.5}
        color={isNight ? '#FFD080' : '#FFF8F0'}
        distance={12}
        decay={2}
      />

      {/* Ambient boost for interior */}
      <ambientLight intensity={isNight ? 0.3 : 0.5} color={isNight ? '#8090C0' : '#FFF8F0'} />
    </group>
  );
}

// Interior room dimensions exported for collision/boundary use
export const VILLA_INTERIOR = {
  ROOM_WIDTH: 18,
  ROOM_DEPTH: 14,
  DOOR_Z: 7,      // roomD / 2 = front wall Z position
  DOOR_WIDTH: 2,   // opening width
  /** Player spawn point when entering the villa (just inside the door) */
  ENTRY_POSITION: [0, 0, 5.5] as [number, number, number],
  /** Player spawn point when exiting the villa (outside the door, past trigger zone) */
  EXIT_POSITION: [0, 0, 5.5] as [number, number, number],
};
