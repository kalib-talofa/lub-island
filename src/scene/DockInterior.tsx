"use client";

import * as THREE from "three";

// ---------------------------------------------------------------------------
// Dock Interior — a wooden pier platform over water with a daily chocolate
// ---------------------------------------------------------------------------

interface DockInteriorProps {
  isNight: boolean;
}

export default function DockInterior({ isNight }: DockInteriorProps) {
  const plankColor = isNight ? "#5a4530" : "#9B7653";
  const railColor = isNight ? "#4a3a28" : "#7B5633";
  const waterColor = isNight ? "#1a3050" : "#2a6090";

  const platformW = 10;
  const platformD = 10;

  return (
    <group>
      {/* Water plane — large, visible below the dock */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial
          color={waterColor}
          emissive={isNight ? "#0a1830" : "#1a4060"}
          emissiveIntensity={0.3}
          transparent
          opacity={0.85}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Dock platform — planks */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={`plank-${i}`} receiveShadow position={[0, 0.01, -platformD / 2 + i * 1.05 + 0.5]}>
          <boxGeometry args={[platformW, 0.15, 0.9]} />
          <meshStandardMaterial color={plankColor} roughness={0.9} />
        </mesh>
      ))}

      {/* Cross beams underneath */}
      {[-3, 0, 3].map((x, i) => (
        <mesh key={`beam-${i}`} position={[x, -0.1, 0]}>
          <boxGeometry args={[0.2, 0.15, platformD]} />
          <meshStandardMaterial color={railColor} roughness={0.95} />
        </mesh>
      ))}

      {/* Support pilings into water */}
      {[
        [-4, -3.5], [-4, 3.5], [4, -3.5], [4, 3.5],
        [-4, 0], [4, 0], [0, -3.5], [0, 3.5],
      ].map(([x, z], i) => (
        <mesh key={`piling-${i}`} position={[x, -0.8, z]}>
          <cylinderGeometry args={[0.12, 0.15, 1.6, 6]} />
          <meshStandardMaterial color="#4a3520" roughness={0.95} />
        </mesh>
      ))}

      {/* Railings — left, right, and front (back/−Z is open for exit) */}
      {/* Left rail */}
      <mesh position={[-platformW / 2, 0.7, 0]}>
        <boxGeometry args={[0.08, 0.08, platformD]} />
        <meshStandardMaterial color={railColor} roughness={0.85} />
      </mesh>
      {/* Right rail */}
      <mesh position={[platformW / 2, 0.7, 0]}>
        <boxGeometry args={[0.08, 0.08, platformD]} />
        <meshStandardMaterial color={railColor} roughness={0.85} />
      </mesh>
      {/* Front rail (+Z, far end of pier) */}
      <mesh position={[0, 0.7, platformD / 2]}>
        <boxGeometry args={[platformW, 0.08, 0.08]} />
        <meshStandardMaterial color={railColor} roughness={0.85} />
      </mesh>

      {/* Rail posts — sides */}
      {[-4, -2, 0, 2, 4].map((z, i) => (
        <group key={`rpost-${i}`}>
          <mesh position={[-platformW / 2, 0.45, z]}>
            <cylinderGeometry args={[0.04, 0.04, 0.8, 4]} />
            <meshStandardMaterial color={railColor} roughness={0.85} />
          </mesh>
          <mesh position={[platformW / 2, 0.45, z]}>
            <cylinderGeometry args={[0.04, 0.04, 0.8, 4]} />
            <meshStandardMaterial color={railColor} roughness={0.85} />
          </mesh>
        </group>
      ))}
      {/* Front rail posts */}
      {[-3, 0, 3].map((x, i) => (
        <mesh key={`frpost-${i}`} position={[x, 0.45, platformD / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 4]} />
          <meshStandardMaterial color={railColor} roughness={0.85} />
        </mesh>
      ))}

      {/* Mooring posts at front corners */}
      {[[-4.2, 4.2], [4.2, 4.2]].map(([x, z], i) => (
        <mesh key={`moor-${i}`} position={[x, 0.35, z]}>
          <cylinderGeometry args={[0.15, 0.2, 0.7, 6]} />
          <meshStandardMaterial color="#4a3520" roughness={0.9} />
        </mesh>
      ))}

      {/* Crate with chocolate — visual hint */}
      <group position={[3, 0.15, -3]}>
        {/* Wooden crate */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.8, 0.6, 0.8]} />
          <meshStandardMaterial color="#8B6914" roughness={0.9} />
        </mesh>
        {/* Crate straps */}
        <mesh position={[0, 0.3, 0.41]}>
          <boxGeometry args={[0.8, 0.08, 0.01]} />
          <meshStandardMaterial color="#5C3A1E" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.3, -0.41]}>
          <boxGeometry args={[0.8, 0.08, 0.01]} />
          <meshStandardMaterial color="#5C3A1E" roughness={0.9} />
        </mesh>
      </group>

      {/* Barrel */}
      <group position={[-3.5, 0.15, -3.5]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.35, 0.4, 0.8, 8]} />
          <meshStandardMaterial color="#6B4226" roughness={0.9} />
        </mesh>
        {/* Barrel rings */}
        <mesh position={[0, 0.6, 0]}>
          <torusGeometry args={[0.37, 0.02, 4, 16]} />
          <meshStandardMaterial color="#888" roughness={0.7} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <torusGeometry args={[0.4, 0.02, 4, 16]} />
          <meshStandardMaterial color="#888" roughness={0.7} metalness={0.3} />
        </mesh>
      </group>

      {/* Lantern on a post */}
      <group position={[-4.2, 0.15, 3]}>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.2, 4]} />
          <meshStandardMaterial color={railColor} roughness={0.85} />
        </mesh>
        <mesh position={[0, 1.3, 0]}>
          <boxGeometry args={[0.25, 0.3, 0.25]} />
          <meshStandardMaterial
            color="#FFCC44"
            emissive="#FFAA22"
            emissiveIntensity={isNight ? 1.2 : 0.3}
            transparent
            opacity={0.8}
          />
        </mesh>
        <pointLight
          position={[0, 1.3, 0]}
          color="#FFCC66"
          intensity={isNight ? 3.0 : 1.0}
          distance={8}
          decay={2}
        />
      </group>

      {/* EXIT sign above the open back side (−Z, top-right in isometric) */}
      <mesh position={[0, 0.9, -platformD / 2 + 0.06]}>
        <boxGeometry args={[1.2, 0.3, 0.04]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.6} roughness={0.5} />
      </mesh>

      {/* Lighting */}
      <ambientLight intensity={isNight ? 0.35 : 0.7} color={isNight ? "#6080B0" : "#A0C0E0"} />
      <hemisphereLight color={isNight ? "#304060" : "#87CEEB"} groundColor={isNight ? "#1a2a40" : "#2a5070"} intensity={0.6} />
      <directionalLight
        position={[5, 8, 3]}
        intensity={isNight ? 0.3 : 1.2}
        color={isNight ? "#6080A0" : "#FFF8E0"}
      />
      {/* Water reflections */}
      <pointLight position={[0, -0.2, 0]} color="#4488cc" intensity={isNight ? 1.5 : 0.5} distance={15} decay={1.5} />
    </group>
  );
}

// Dock interior room dimensions exported for collision/boundary use
export const DOCK_INTERIOR = {
  PLATFORM_WIDTH: 10,
  PLATFORM_DEPTH: 10,
  /** Back edge is −Z side — open for exit (top-right in isometric view) */
  EXIT_Z: -5,       // -platformD / 2
  EXIT_WIDTH: 4,     // wide enough to walk through easily
  /** Player spawn point when entering the dock (far end, away from exit) */
  ENTRY_POSITION: [0, 0, 3.5] as [number, number, number],
  /** Player spawn point when exiting the dock (outside, back on the island) */
  EXIT_POSITION: [12, 0, 14.5] as [number, number, number],
  /** Chocolate spawn position (near the crate) */
  CHOCOLATE_POSITION: [2.5, 0, -2.5] as [number, number, number],
};
