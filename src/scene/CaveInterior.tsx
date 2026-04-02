"use client";

import * as THREE from "three";

// ---------------------------------------------------------------------------
// Cave Interior — a rocky underground chamber the player can explore
// ---------------------------------------------------------------------------

interface CaveInteriorProps {
  isNight: boolean;
}

export default function CaveInterior({ isNight }: CaveInteriorProps) {
  const wallColor = isNight ? '#3a3540' : '#5a5550';
  const floorColor = isNight ? '#3a3530' : '#6a6050';
  const rockColor = isNight ? '#4a4540' : '#706860';

  const roomW = 14;
  const roomD = 12;
  const roomH = 4.5;

  return (
    <group>
      {/* Floor — rough stone */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[roomW, roomD]} />
        <meshStandardMaterial color={floorColor} roughness={1.0} />
      </mesh>

      {/* Back wall (north, -Z) */}
      <mesh position={[0, roomH / 2, -roomD / 2]} receiveShadow>
        <planeGeometry args={[roomW, roomH]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} />
      </mesh>

      {/* Left wall (-X) */}
      <mesh position={[-roomW / 2, roomH / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[roomD, roomH]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} />
      </mesh>

      {/* Right wall (+X) */}
      <mesh position={[roomW / 2, roomH / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[roomD, roomH]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} />
      </mesh>

      {/* Front wall (+Z) with door opening — transparent for camera visibility */}
      <mesh position={[-roomW / 4 - 0.5, roomH / 2, roomD / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[roomW / 2 - 1, roomH]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} side={THREE.DoubleSide} transparent opacity={0.08} />
      </mesh>
      <mesh position={[roomW / 4 + 0.5, roomH / 2, roomD / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[roomW / 2 - 1, roomH]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} side={THREE.DoubleSide} transparent opacity={0.08} />
      </mesh>
      <mesh position={[0, roomH - 0.5, roomD / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2, 1]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} side={THREE.DoubleSide} transparent opacity={0.08} />
      </mesh>

      {/* EXIT sign above door */}
      <mesh position={[0, 3.5, roomD / 2 - 0.06]}>
        <boxGeometry args={[1.2, 0.3, 0.04]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.6} roughness={0.5} />
      </mesh>

      {/* Stalactites hanging from ceiling */}
      {[
        [-4, 0, -3], [-1, 0, -4], [2, 0, -2], [5, 0, -4],
        [-3, 0, 1], [3, 0, 2], [-5, 0, -1], [0, 0, 3],
        [4, 0, -1], [-2, 0, 4],
      ].map((pos, i) => (
        <mesh key={`stal-${i}`} position={[pos[0], roomH - 0.3 - (i % 3) * 0.3, pos[2]]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.15 + (i % 3) * 0.05, 0.6 + (i % 4) * 0.3, 5]} />
          <meshStandardMaterial color={rockColor} roughness={0.95} />
        </mesh>
      ))}

      {/* Rock formations on the floor */}
      {[
        [-5, 0, -4], [4, 0, -3], [-3, 0, 3], [5, 0, 2],
      ].map((pos, i) => (
        <mesh key={`rock-${i}`} position={[pos[0], 0.3 + i * 0.1, pos[2]]} rotation={[0, i * 1.2, 0]}>
          <dodecahedronGeometry args={[0.4 + i * 0.1, 0]} />
          <meshStandardMaterial color={rockColor} roughness={0.95} flatShading />
        </mesh>
      ))}

      {/* Glowing pool in the center */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -1]}>
        <circleGeometry args={[2, 16]} />
        <meshStandardMaterial
          color="#2a5588"
          emissive="#1a4070"
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
          roughness={0.2}
        />
      </mesh>
      <pointLight position={[0, 0.5, -1]} color="#4488bb" intensity={2.0} distance={8} decay={1.5} />

      {/* Mushroom clusters with bioluminescent glow */}
      {[
        [-4, 0, 0], [3, 0, -4], [-2, 0, 4], [5, 0, 0],
      ].map((pos, i) => {
        const colors = ['#44cc88', '#88bbff', '#cc88ff', '#ffaa44'];
        return (
          <group key={`shroom-${i}`} position={[pos[0], 0, pos[2]]}>
            {/* Stem */}
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.06, 0.08, 0.4, 6]} />
              <meshStandardMaterial color="#aaa090" roughness={0.9} />
            </mesh>
            {/* Cap */}
            <mesh position={[0, 0.4, 0]}>
              <sphereGeometry args={[0.18, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial
                color={colors[i]}
                emissive={colors[i]}
                emissiveIntensity={0.8}
                roughness={0.6}
              />
            </mesh>
            <pointLight position={[0, 0.5, 0]} color={colors[i]} intensity={0.8} distance={4} decay={2} />
          </group>
        );
      })}

      {/* Interior lighting */}
      <ambientLight intensity={isNight ? 0.4 : 0.6} color="#8090B0" />
      <pointLight position={[0, 3.5, 0]} intensity={1.5} color="#9090A0" distance={20} decay={1.0} />
      <pointLight position={[-5, 2.5, -3]} intensity={0.8} color="#6080A0" distance={12} decay={1.5} />
      <pointLight position={[5, 2.5, 3]} intensity={0.8} color="#6080A0" distance={12} decay={1.5} />
      <hemisphereLight color="#607090" groundColor="#403830" intensity={0.5} />
    </group>
  );
}

// Cave interior room dimensions exported for collision/boundary use
export const CAVE_INTERIOR = {
  ROOM_WIDTH: 14,
  ROOM_DEPTH: 12,
  DOOR_Z: 6,       // roomD / 2 = front wall Z position
  DOOR_WIDTH: 2,    // opening width
  /** Player spawn point when entering the cave (just inside the door) */
  ENTRY_POSITION: [0, 0, 4.5] as [number, number, number],
  /** Player spawn point when exiting the cave (outside, past trigger zone) */
  EXIT_POSITION: [-17.5, 0, 0] as [number, number, number],
};
