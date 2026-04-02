"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { STARTING_CAST } from "@/characters/roster";

// ---------------------------------------------------------------------------
// Villa Interior — "bigger on the inside" room with NPC beds & decorations
// ---------------------------------------------------------------------------

// Bed assignments: each NPC gets a bed spot along the walls
export const BED_POSITIONS: { npcId: string; position: [number, number, number]; rotation: number }[] = [
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

// NPC body colours (matches NPCController)
const NPC_BODY_COLORS: Record<string, string> = {
  rosie:    '#FFB6C1',
  blaze:    '#FF6B35',
  pudge:    '#D4A574',
  kiki:     '#2A2A2A',
  sprocket: '#C0C0C0',
  lily:     '#228B22',
};

interface VillaInteriorProps {
  isNight: boolean;
  /** NPC IDs that are currently sleeping (hidden outdoors, visible on beds) */
  sleepingNPCs?: string[];
  /** Called when player interacts with a bed */
  onBedInteract?: (npcId: string, isSleeping: boolean) => void;
}

// Individual bed with frame, mattress, pillow, and name tag
function Bed({ npcId, position, rotation, isNight, isSleeping }: {
  npcId: string;
  position: [number, number, number];
  rotation: number;
  isNight: boolean;
  isSleeping: boolean;
}) {
  const color = NPC_COLORS[npcId] ?? '#888888';
  const bodyColor = NPC_BODY_COLORS[npcId] ?? '#888888';

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

      {/* Sleeping NPC on the bed — lying along local Z axis (head at -Z / pillow) */}
      {isSleeping && (
        <group position={[0, 0.5, 0]}>
          {/* Body — cylinder lying flat along the bed length (local Z) */}
          <mesh position={[0, 0.06, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.22, 0.7, 10]} />
            <meshStandardMaterial color={bodyColor} roughness={0.85} />
          </mesh>
          {/* Head — sphere near the pillow */}
          <mesh position={[0, 0.1, -0.5]}>
            <sphereGeometry args={[0.2, 10, 8]} />
            <meshStandardMaterial color={bodyColor} roughness={0.85} />
          </mesh>
          {/* Blanket over body */}
          <mesh position={[0, 0.02, 0.2]}>
            <boxGeometry args={[0.85, 0.04, 1.0]} />
            <meshStandardMaterial color={color} roughness={0.7} transparent opacity={0.8} />
          </mesh>
        </group>
      )}

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

      {/* Bedside lamp (glowing) */}
      <mesh position={[0.8, 0.55, -0.6]}>
        <cylinderGeometry args={[0.06, 0.08, 0.1, 8]} />
        <meshStandardMaterial
          color="#FFF8E0"
          emissive="#FFD060"
          emissiveIntensity={isNight ? 1.0 : 0.4}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0.8, 0.65, -0.6]}>
        <cylinderGeometry args={[0.12, 0.08, 0.12, 8]} />
        <meshStandardMaterial
          color="#FFF0D0"
          emissive="#FFD060"
          emissiveIntensity={isNight ? 0.8 : 0.3}
          roughness={0.5}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Lamp point light */}
      <pointLight
        position={[0.8, 1.0, -0.6]}
        intensity={isNight ? 1.5 : 0.6}
        color="#FFE0A0"
        distance={5}
        decay={1.8}
      />

      {/* Name tag on wall behind bed */}
      <mesh position={[0, 1.1, -1.12]}>
        <boxGeometry args={[0.8, 0.25, 0.02]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          roughness={0.5}
        />
      </mesh>
    </group>
  );
}

export default function VillaInterior({ isNight, sleepingNPCs = [] }: VillaInteriorProps) {
  const wallColor = isNight ? '#4a4540' : '#E8DCC8';
  const floorColor = isNight ? '#554a40' : '#C4A66A';
  const trimColor = isNight ? '#5a4838' : '#6B4423';

  // Room dimensions — bigger on the inside!
  const roomW = 18;
  const roomD = 14;
  const roomH = 4;

  const sleepingSet = useMemo(() => new Set(sleepingNPCs), [sleepingNPCs]);

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
        <meshStandardMaterial color={isNight ? '#5a3040' : '#9B4D6E'} roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <planeGeometry args={[5.2, 3.2]} />
        <meshStandardMaterial color={isNight ? '#6a3a4a' : '#B8607A'} roughness={0.9} />
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

      {/* Front wall (+Z) — with door opening, nearly transparent so camera can see inside */}
      <mesh position={[-roomW / 4 - 0.5, roomH / 2, roomD / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[roomW / 2 - 1, roomH]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} side={THREE.DoubleSide} transparent opacity={0.08} />
      </mesh>
      <mesh position={[roomW / 4 + 0.5, roomH / 2, roomD / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[roomW / 2 - 1, roomH]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} side={THREE.DoubleSide} transparent opacity={0.08} />
      </mesh>
      <mesh position={[0, roomH - 0.5, roomD / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2, 1]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} side={THREE.DoubleSide} transparent opacity={0.08} />
      </mesh>

      {/* Door frame trim */}
      <mesh position={[-1, roomH / 2 - 0.5, roomD / 2 - 0.02]}>
        <boxGeometry args={[0.12, roomH - 1, 0.08]} />
        <meshStandardMaterial color={trimColor} roughness={0.85} transparent opacity={0.15} />
      </mesh>
      <mesh position={[1, roomH / 2 - 0.5, roomD / 2 - 0.02]}>
        <boxGeometry args={[0.12, roomH - 1, 0.08]} />
        <meshStandardMaterial color={trimColor} roughness={0.85} transparent opacity={0.15} />
      </mesh>

      {/* Door mat */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, roomD / 2 - 0.8]}>
        <planeGeometry args={[1.6, 0.8]} />
        <meshStandardMaterial color={isNight ? '#4a4030' : '#8B7355'} roughness={0.95} />
      </mesh>

      {/* EXIT sign above door */}
      <mesh position={[0, 3.2, roomD / 2 - 0.06]}>
        <boxGeometry args={[1.2, 0.3, 0.04]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.6} roughness={0.5} />
      </mesh>

      {/* Wall trim / baseboard */}
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
          isSleeping={sleepingSet.has(bed.npcId)}
        />
      ))}

      {/* Central lounge area — couch */}
      <mesh position={[0, 0.35, -1]} castShadow>
        <boxGeometry args={[3, 0.4, 1.0]} />
        <meshStandardMaterial color={isNight ? '#5a4850' : '#7B4D6E'} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.7, -1.4]} castShadow>
        <boxGeometry args={[3, 0.5, 0.2]} />
        <meshStandardMaterial color={isNight ? '#5a4850' : '#7B4D6E'} roughness={0.8} />
      </mesh>
      <mesh position={[-1.4, 0.55, -1]} castShadow>
        <boxGeometry args={[0.2, 0.5, 1.0]} />
        <meshStandardMaterial color={isNight ? '#5a4850' : '#7B4D6E'} roughness={0.8} />
      </mesh>
      <mesh position={[1.4, 0.55, -1]} castShadow>
        <boxGeometry args={[0.2, 0.5, 1.0]} />
        <meshStandardMaterial color={isNight ? '#5a4850' : '#7B4D6E'} roughness={0.8} />
      </mesh>

      {/* Coffee table — tabletop */}
      <mesh position={[0, 0.35, 1.5]} castShadow>
        <boxGeometry args={[1.6, 0.08, 0.8]} />
        <meshStandardMaterial color={isNight ? '#5a4838' : '#6B4423'} roughness={0.85} />
      </mesh>
      {/* Coffee table legs — 4 legs positioned under the tabletop */}
      {[[-0.65, -0.25], [0.65, -0.25], [-0.65, 0.25], [0.65, 0.25]].map(([lx, lz], i) => (
        <mesh key={`tl-${i}`} position={[lx, 0.16, 1.5 + lz]}>
          <cylinderGeometry args={[0.04, 0.04, 0.3, 6]} />
          <meshStandardMaterial color={isNight ? '#5a4838' : '#6B4423'} roughness={0.85} />
        </mesh>
      ))}

      {/* ================================================================= */}
      {/* Interior lighting — very bright to ensure visibility              */}
      {/* ================================================================= */}

      {/* Strong ambient — base illumination for the entire room */}
      <ambientLight intensity={isNight ? 1.0 : 1.4} color={isNight ? '#D0C8E8' : '#FFF8F0'} />

      {/* Main overhead light */}
      <pointLight
        position={[0, 3.5, 0]}
        intensity={isNight ? 3.0 : 4.0}
        color={isNight ? '#FFD080' : '#FFF8F0'}
        distance={25}
        decay={1.0}
      />

      {/* Left side overhead */}
      <pointLight
        position={[-6, 3.0, 0]}
        intensity={isNight ? 2.0 : 2.5}
        color={isNight ? '#FFD080' : '#FFF8F0'}
        distance={16}
        decay={1.2}
      />
      {/* Right side overhead */}
      <pointLight
        position={[6, 3.0, 0]}
        intensity={isNight ? 2.0 : 2.5}
        color={isNight ? '#FFD080' : '#FFF8F0'}
        distance={16}
        decay={1.2}
      />

      {/* Back wall light */}
      <pointLight
        position={[0, 2.5, -5]}
        intensity={isNight ? 1.5 : 2.0}
        color={isNight ? '#FFD080' : '#FFF8F0'}
        distance={12}
        decay={1.5}
      />

      {/* Door area light */}
      <pointLight
        position={[0, 2.5, 6]}
        intensity={isNight ? 1.2 : 1.5}
        color={isNight ? '#80C0FF' : '#FFF8F0'}
        distance={10}
        decay={1.5}
      />

      {/* Hemisphere light for even fill */}
      <hemisphereLight
        color={isNight ? '#8090C0' : '#FFF8F0'}
        groundColor={isNight ? '#504840' : '#C4A66A'}
        intensity={isNight ? 0.8 : 1.0}
      />
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
