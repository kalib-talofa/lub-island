"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Instance, Instances } from "@react-three/drei";

// ---------------------------------------------------------------------------
// Zone positions - exported so NPCs / other systems can reference them
// ---------------------------------------------------------------------------

export const ZONE_POSITIONS: Record<string, [number, number, number]> = {
  beach: [0, 0, 16],
  villa: [0, 0.1, 0],
  garden: [14, 0, 2],
  arena: [-14, 0, 2],
  jungle: [0, 0, -14],
  dock: [12, 0, 16],
  lookout: [12, 1.5, -12],
};

// ---------------------------------------------------------------------------
// Reusable sub-components
// ---------------------------------------------------------------------------

function PalmTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const trunkHeight = 3 * scale;
  const lean = 0.4 * scale;
  return (
    <group position={position}>
      {/* Trunk - slightly tilted */}
      <mesh position={[lean * 0.5, trunkHeight / 2, 0]} rotation={[0, 0, -0.12]}>
        <cylinderGeometry args={[0.15 * scale, 0.25 * scale, trunkHeight, 8]} />
        <meshStandardMaterial color="#8B6914" roughness={0.9} />
      </mesh>
      {/* Canopy leaves - overlapping elongated spheres */}
      {[0, 1.2, 2.4, 3.6, 4.8].map((rot, i) => (
        <mesh
          key={i}
          position={[lean * 0.5 + Math.cos(rot) * 0.6 * scale, trunkHeight + 0.2 * scale, Math.sin(rot) * 0.6 * scale]}
          rotation={[Math.sin(rot) * 0.5, rot, Math.cos(rot) * 0.4]}
          scale={[1.6 * scale, 0.35 * scale, 0.7 * scale]}
        >
          <sphereGeometry args={[0.7, 8, 6]} />
          <meshStandardMaterial color="#2E8B22" roughness={0.85} />
        </mesh>
      ))}
      {/* Top coconut cluster */}
      <mesh position={[lean * 0.5, trunkHeight - 0.1, 0.15 * scale]}>
        <sphereGeometry args={[0.18 * scale, 6, 6]} />
        <meshStandardMaterial color="#5C4018" roughness={0.8} />
      </mesh>
    </group>
  );
}

function SimpleTree({ position, color = "#228B22" }: { position: [number, number, number]; color?: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 1.6, 6]} />
        <meshStandardMaterial color="#6B4423" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.0, 0]}>
        <coneGeometry args={[0.9, 1.8, 7]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.8, 0]}>
        <coneGeometry args={[0.6, 1.2, 7]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
    </group>
  );
}

function Rock({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <mesh position={position} scale={scale} rotation={[Math.random() * 0.3, Math.random() * Math.PI, 0]}>
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#808080" roughness={0.95} flatShading />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Zone components
// ---------------------------------------------------------------------------

function Beach({ isNight }: { isNight: boolean }) {
  const sandColor = isNight ? "#A89060" : "#F4D68C";
  return (
    <group position={[ZONE_POSITIONS.beach[0], ZONE_POSITIONS.beach[1], ZONE_POSITIONS.beach[2]]}>
      {/* Sand area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} scale={[18, 6, 1]}>
        <circleGeometry args={[1, 32]} />
        <meshStandardMaterial color={sandColor} roughness={1} />
      </mesh>

      {/* Beach chairs */}
      {([[-4, 0, 1], [2, 0, 2], [6, 0, 0.5]] satisfies [number, number, number][]).map((pos, i) => (
        <group key={`chair-${i}`} position={pos} rotation={[0, 0.3 * i, 0]}>
          {/* Seat */}
          <mesh position={[0, 0.3, 0]} rotation={[-0.3, 0, 0]}>
            <boxGeometry args={[0.8, 0.06, 1.2]} />
            <meshStandardMaterial color={["#E84040", "#3080E0", "#E8C840"][i]} roughness={0.7} />
          </mesh>
          {/* Legs */}
          {[[-0.35, 0, -0.4], [0.35, 0, -0.4], [-0.35, 0, 0.4], [0.35, 0, 0.4]].map((lp, li) => (
            <mesh key={li} position={[lp[0], 0.15, lp[2]]}>
              <cylinderGeometry args={[0.03, 0.03, 0.3, 4]} />
              <meshStandardMaterial color="#D2B48C" roughness={0.8} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Umbrellas */}
      {([[-3, 0, -0.5], [3, 0, -1], [8, 0, -0.5]] satisfies [number, number, number][]).map((pos, i) => (
        <group key={`umb-${i}`} position={pos}>
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 3, 6]} />
            <meshStandardMaterial color="#D2B48C" roughness={0.8} />
          </mesh>
          <mesh position={[0, 2.8, 0]}>
            <coneGeometry args={[1.2, 0.6, 8]} />
            <meshStandardMaterial color={["#FF6347", "#FFD700", "#48D1CC"][i]} roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Towels */}
      {([[0, 0.02, 2], [5, 0.02, 1.5]] satisfies [number, number, number][]).map((pos, i) => (
        <mesh key={`towel-${i}`} position={pos} rotation={[-Math.PI / 2, 0, 0.4 * i]}>
          <boxGeometry args={[1.2, 0.7, 0.02]} />
          <meshStandardMaterial color={["#FF69B4", "#87CEEB"][i]} roughness={0.9} />
        </mesh>
      ))}

      {/* Night-time bonfire */}
      {isNight && (
        <group position={[-1, 0, 0]}>
          {/* Log base */}
          {[0, 1.05, 2.1].map((r, i) => (
            <mesh key={i} position={[Math.cos(r) * 0.3, 0.12, Math.sin(r) * 0.3]} rotation={[0, r, Math.PI / 2]}>
              <cylinderGeometry args={[0.08, 0.08, 0.6, 5]} />
              <meshStandardMaterial color="#5C3A1E" roughness={0.95} />
            </mesh>
          ))}
          {/* Fire glow */}
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.35, 8, 8]} />
            <meshStandardMaterial color="#FF6600" emissive="#FF4400" emissiveIntensity={2.5} transparent opacity={0.85} />
          </mesh>
          <mesh position={[0, 0.75, 0]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial color="#FFAA00" emissive="#FF8800" emissiveIntensity={3} transparent opacity={0.7} />
          </mesh>
          <pointLight position={[0, 0.8, 0]} color="#FF6633" intensity={8} distance={8} />
        </group>
      )}

      {/* A few palm trees along the beach */}
      <PalmTree position={[-8, 0, -2]} scale={1.1} />
      <PalmTree position={[10, 0, -1.5]} scale={0.9} />
      <PalmTree position={[-1, 0, -3]} scale={1.0} />
    </group>
  );
}

function Villa({ isNight }: { isNight: boolean }) {
  const wallColor = isNight ? "#9B7548" : "#C89660";
  const roofColor = isNight ? "#7A3020" : "#A0522D";
  return (
    <group position={[ZONE_POSITIONS.villa[0], ZONE_POSITIONS.villa[1], ZONE_POSITIONS.villa[2]]}>
      {/* Main hall */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[6, 3, 5]} />
        <meshStandardMaterial color={wallColor} roughness={0.8} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 3.3, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[5, 1.6, 4]} />
        <meshStandardMaterial color={roofColor} roughness={0.85} />
      </mesh>

      {/* Left wing room */}
      <mesh position={[-4.5, 1.0, 0]}>
        <boxGeometry args={[3, 2, 3.5]} />
        <meshStandardMaterial color={wallColor} roughness={0.8} />
      </mesh>
      <mesh position={[-4.5, 2.25, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[2.8, 1.0, 4]} />
        <meshStandardMaterial color={roofColor} roughness={0.85} />
      </mesh>

      {/* Right wing room */}
      <mesh position={[4.5, 1.0, 0]}>
        <boxGeometry args={[3, 2, 3.5]} />
        <meshStandardMaterial color={wallColor} roughness={0.8} />
      </mesh>
      <mesh position={[4.5, 2.25, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[2.8, 1.0, 4]} />
        <meshStandardMaterial color={roofColor} roughness={0.85} />
      </mesh>

      {/* Porch / deck area (front) */}
      <mesh position={[0, 0.08, 3.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[8, 3, 0.15]} />
        <meshStandardMaterial color="#B8860B" roughness={0.9} />
      </mesh>
      {/* Porch pillars */}
      {[-3.5, -1.2, 1.2, 3.5].map((x, i) => (
        <mesh key={i} position={[x, 1.0, 4.8]}>
          <cylinderGeometry args={[0.1, 0.1, 2, 6]} />
          <meshStandardMaterial color="#DEB887" roughness={0.7} />
        </mesh>
      ))}
      {/* Porch roof beam */}
      <mesh position={[0, 2.0, 4.8]}>
        <boxGeometry args={[8, 0.15, 0.3]} />
        <meshStandardMaterial color={roofColor} roughness={0.85} />
      </mesh>

      {/* Door */}
      <mesh position={[0, 1.0, 2.51]}>
        <boxGeometry args={[1.0, 2.0, 0.05]} />
        <meshStandardMaterial color="#5C3A1E" roughness={0.85} />
      </mesh>
      {/* Windows */}
      {([[-1.8, 1.5, 2.51], [1.8, 1.5, 2.51]] satisfies [number, number, number][]).map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.8, 0.8, 0.05]} />
          <meshStandardMaterial
            color={isNight ? "#FFEE88" : "#ADD8E6"}
            emissive={isNight ? "#FFDD44" : "#000000"}
            emissiveIntensity={isNight ? 0.8 : 0}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function Garden({ isNight }: { isNight: boolean }) {
  const flowerColors = ["#FF69B4", "#FF4500", "#FFD700", "#9370DB", "#FF6347", "#DA70D6"];
  return (
    <group position={[ZONE_POSITIONS.garden[0], ZONE_POSITIONS.garden[1], ZONE_POSITIONS.garden[2]]}>
      {/* Grassy patch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[6, 24]} />
        <meshStandardMaterial color={isNight ? "#1A5C1A" : "#2E8B2E"} roughness={1} />
      </mesh>

      {/* Fountain - central */}
      <group position={[0, 0, 0]}>
        {/* Base pool */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[1.5, 1.6, 0.5, 16]} />
          <meshStandardMaterial color="#B0B0B0" roughness={0.6} />
        </mesh>
        {/* Water in pool */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[1.35, 1.35, 0.15, 16]} />
          <meshStandardMaterial color="#4488CC" transparent opacity={0.6} roughness={0.2} />
        </mesh>
        {/* Pedestal */}
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.25, 0.35, 1.0, 8]} />
          <meshStandardMaterial color="#C0C0C0" roughness={0.5} />
        </mesh>
        {/* Top bowl */}
        <mesh position={[0, 1.5, 0]}>
          <torusGeometry args={[0.5, 0.15, 8, 16]} />
          <meshStandardMaterial color="#C0C0C0" roughness={0.5} />
        </mesh>
      </group>

      {/* Flower bushes - scattered */}
      {[
        [-2.5, 0, -2], [-3, 0, 1], [-1.5, 0, 3], [2, 0, -3], [3, 0, 1.5],
        [1.5, 0, 3.5], [-3.5, 0, -0.5], [3.5, 0, -1.5], [0, 0, -4], [0.5, 0, 4],
      ].map((pos, i) => (
        <group key={`flower-${i}`} position={[pos[0], pos[1], pos[2]]}>
          {/* Bush base */}
          <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.4, 6, 6]} />
            <meshStandardMaterial color={isNight ? "#1B5E1B" : "#228B22"} roughness={0.9} />
          </mesh>
          {/* Flower on top */}
          <mesh position={[0, 0.6, 0]}>
            <sphereGeometry args={[0.18, 6, 6]} />
            <meshStandardMaterial
              color={flowerColors[i % flowerColors.length]}
              emissive={isNight ? flowerColors[i % flowerColors.length] : "#000000"}
              emissiveIntensity={isNight ? 0.15 : 0}
              roughness={0.7}
            />
          </mesh>
        </group>
      ))}

      {/* Benches */}
      {([[2, 0, 0], [-2, 0, 0]] satisfies [number, number, number][]).map((pos, i) => (
        <group key={`bench-${i}`} position={pos} rotation={[0, (Math.PI / 2) * i, 0]}>
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[1.4, 0.08, 0.5]} />
            <meshStandardMaterial color="#8B6914" roughness={0.85} />
          </mesh>
          {/* Legs */}
          {[[-0.55, 0.17, -0.18], [0.55, 0.17, -0.18], [-0.55, 0.17, 0.18], [0.55, 0.17, 0.18]].map((lp, li) => (
            <mesh key={li} position={[lp[0], lp[1], lp[2]]}>
              <boxGeometry args={[0.08, 0.35, 0.08]} />
              <meshStandardMaterial color="#6B4423" roughness={0.9} />
            </mesh>
          ))}
          {/* Back rest */}
          <mesh position={[0, 0.6, -0.22]}>
            <boxGeometry args={[1.4, 0.5, 0.06]} />
            <meshStandardMaterial color="#8B6914" roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ChallengeArena({ isNight }: { isNight: boolean }) {
  const markerColor = isNight ? "#CC6600" : "#FF8C00";
  return (
    <group position={[ZONE_POSITIONS.arena[0], ZONE_POSITIONS.arena[1], ZONE_POSITIONS.arena[2]]}>
      {/* Arena floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[7, 32]} />
        <meshStandardMaterial color={isNight ? "#8B7355" : "#C4A66A"} roughness={0.95} />
      </mesh>

      {/* Inner ring marking */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <torusGeometry args={[4.5, 0.12, 4, 32]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
      </mesh>

      {/* Boundary marker cones */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 6;
        const z = Math.sin(angle) * 6;
        return (
          <group key={`marker-${i}`} position={[x, 0, z]}>
            <mesh position={[0, 0.5, 0]}>
              <coneGeometry args={[0.3, 1.0, 6]} />
              <meshStandardMaterial color={markerColor} roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.35, 8]} />
              <meshStandardMaterial color="#444444" roughness={0.9} />
            </mesh>
          </group>
        );
      })}

      {/* Center podium */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[1.0, 1.2, 0.4, 12]} />
        <meshStandardMaterial color="#808080" roughness={0.7} />
      </mesh>
    </group>
  );
}

function JungleTrail({ isNight }: { isNight: boolean }) {
  const treePositions: [number, number, number][] = [
    [-6, 0, -2], [-4, 0, -4], [-2, 0, -1], [0, 0, -3.5],
    [2, 0, -1.5], [4, 0, -3], [6, 0, -2], [5, 0, -5],
    [-5, 0, -6], [-1, 0, -6], [3, 0, -6], [-3, 0, 0.5],
    [1, 0, 0], [-7, 0, -4.5], [7, 0, -5],
  ];

  const bushPositions: [number, number, number][] = [
    [-5, 0, -1], [-3, 0, -2.5], [1, 0, -2], [3.5, 0, -0.5],
    [5.5, 0, -3.5], [-2, 0, -5], [4, 0, -5], [-6.5, 0, -3],
    [0, 0, -0.5], [6.5, 0, -1],
  ];

  return (
    <group position={[ZONE_POSITIONS.jungle[0], ZONE_POSITIONS.jungle[1], ZONE_POSITIONS.jungle[2]]}>
      {/* Path - winding brown path */}
      {[
        [-6, 0.03, 1], [-3, 0.03, 0], [0, 0.03, 1.2],
        [3, 0.03, 0.5], [6, 0.03, 1],
      ].map((pos, i) => (
        <mesh key={`path-${i}`} position={[pos[0], pos[1], pos[2]]} rotation={[-Math.PI / 2, 0, 0.2 * Math.sin(i)]} scale={[2.0, 0.8, 1]}>
          <circleGeometry args={[1, 12]} />
          <meshStandardMaterial color={isNight ? "#6B5030" : "#9B7653"} roughness={1} />
        </mesh>
      ))}

      {/* Dense trees */}
      {treePositions.map((pos, i) => (
        <SimpleTree
          key={`jtree-${i}`}
          position={pos}
          color={isNight ? "#1A5C1A" : ["#228B22", "#2E8B22", "#1E7A1E"][i % 3]}
        />
      ))}

      {/* Bushes */}
      {bushPositions.map((pos, i) => (
        <mesh key={`bush-${i}`} position={[pos[0], 0.35, pos[2]]} scale={[1, 0.7, 1]}>
          <sphereGeometry args={[0.55, 7, 6]} />
          <meshStandardMaterial color={isNight ? "#1A4C1A" : "#2D7D2D"} roughness={0.9} />
        </mesh>
      ))}

      {/* A couple palm trees in the jungle */}
      <PalmTree position={[-4, 0, -5.5]} scale={1.2} />
      <PalmTree position={[5, 0, -4.5]} scale={1.0} />
    </group>
  );
}

function Dock({ isNight }: { isNight: boolean }) {
  const woodColor = isNight ? "#6B5030" : "#9B7653";
  return (
    <group position={[ZONE_POSITIONS.dock[0], ZONE_POSITIONS.dock[1], ZONE_POSITIONS.dock[2]]}>
      {/* Pier planks */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`plank-${i}`} position={[0, 0.4, i * 1.2]}>
          <boxGeometry args={[2.0, 0.12, 1.0]} />
          <meshStandardMaterial color={woodColor} roughness={0.9} />
        </mesh>
      ))}

      {/* Support pilings */}
      {Array.from({ length: 5 }).map((_, i) => (
        <group key={`piling-${i}`}>
          <mesh position={[-0.8, -0.2, i * 2.2]}>
            <cylinderGeometry args={[0.12, 0.12, 1.4, 6]} />
            <meshStandardMaterial color="#5C3A1E" roughness={0.95} />
          </mesh>
          <mesh position={[0.8, -0.2, i * 2.2]}>
            <cylinderGeometry args={[0.12, 0.12, 1.4, 6]} />
            <meshStandardMaterial color="#5C3A1E" roughness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Railing posts */}
      {Array.from({ length: 5 }).map((_, i) => (
        <group key={`rail-${i}`}>
          <mesh position={[-0.9, 0.9, i * 2.2]}>
            <cylinderGeometry args={[0.05, 0.05, 1.0, 4]} />
            <meshStandardMaterial color={woodColor} roughness={0.85} />
          </mesh>
          <mesh position={[0.9, 0.9, i * 2.2]}>
            <cylinderGeometry args={[0.05, 0.05, 1.0, 4]} />
            <meshStandardMaterial color={woodColor} roughness={0.85} />
          </mesh>
        </group>
      ))}

      {/* Top rails */}
      <mesh position={[-0.9, 1.35, 4.5]}>
        <boxGeometry args={[0.08, 0.08, 9.5]} />
        <meshStandardMaterial color={woodColor} roughness={0.85} />
      </mesh>
      <mesh position={[0.9, 1.35, 4.5]}>
        <boxGeometry args={[0.08, 0.08, 9.5]} />
        <meshStandardMaterial color={woodColor} roughness={0.85} />
      </mesh>

      {/* Mooring post at the end */}
      <mesh position={[0, 0.7, 9.2]}>
        <cylinderGeometry args={[0.15, 0.2, 0.8, 6]} />
        <meshStandardMaterial color="#5C3A1E" roughness={0.9} />
      </mesh>
    </group>
  );
}

function LookoutPoint({ isNight }: { isNight: boolean }) {
  return (
    <group position={[ZONE_POSITIONS.lookout[0], ZONE_POSITIONS.lookout[1], ZONE_POSITIONS.lookout[2]]}>
      {/* Elevated mound */}
      <mesh position={[0, -0.2, 0]} scale={[3, 1.5, 3]}>
        <sphereGeometry args={[1.2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={isNight ? "#3A6B2A" : "#4A8B3A"} roughness={0.95} />
      </mesh>

      {/* Flat top platform */}
      <mesh position={[0, 1.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.8, 12]} />
        <meshStandardMaterial color={isNight ? "#6B5030" : "#9B7653"} roughness={0.9} />
      </mesh>

      {/* Railing around the top */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 1.6;
        const z = Math.sin(angle) * 1.6;
        return (
          <mesh key={i} position={[x, 1.75, z]}>
            <cylinderGeometry args={[0.04, 0.04, 0.9, 4]} />
            <meshStandardMaterial color="#8B6914" roughness={0.8} />
          </mesh>
        );
      })}

      {/* Railing top ring */}
      <mesh position={[0, 2.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.6, 0.04, 4, 16]} />
        <meshStandardMaterial color="#8B6914" roughness={0.8} />
      </mesh>

      {/* Spyglass on a stand */}
      <group position={[0.5, 1.8, 0]} rotation={[0, -0.5, 0]}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.6, 4]} />
          <meshStandardMaterial color="#666666" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.55, 0.2]} rotation={[1.2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.08, 0.5, 6]} />
          <meshStandardMaterial color="#333333" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// String lights (instanced for performance)
// ---------------------------------------------------------------------------

function StringLights({ isNight }: { isNight: boolean }) {
  const lightPaths = useMemo(() => {
    const points: [number, number, number][] = [];
    // Path from villa to beach
    for (let i = 0; i < 12; i++) {
      const t = i / 11;
      points.push([
        THREE.MathUtils.lerp(0, 0, t) + Math.sin(t * 4) * 1.5,
        1.8 + Math.sin(t * Math.PI) * 0.3,
        THREE.MathUtils.lerp(3, 14, t),
      ]);
    }
    // Path from villa to garden
    for (let i = 0; i < 10; i++) {
      const t = i / 9;
      points.push([
        THREE.MathUtils.lerp(3, 14, t),
        1.8 + Math.sin(t * Math.PI) * 0.3,
        THREE.MathUtils.lerp(0, 2, t) + Math.sin(t * 3) * 1.0,
      ]);
    }
    // Path from villa to arena
    for (let i = 0; i < 10; i++) {
      const t = i / 9;
      points.push([
        THREE.MathUtils.lerp(-3, -14, t),
        1.8 + Math.sin(t * Math.PI) * 0.3,
        THREE.MathUtils.lerp(0, 2, t) + Math.sin(t * 3) * 1.0,
      ]);
    }
    return points;
  }, []);

  const emissiveIntensity = isNight ? 2.0 : 0;
  const lightColor = "#FFE4B0";

  if (!isNight) return null;

  return (
    <Instances limit={40}>
      <sphereGeometry args={[0.08, 6, 6]} />
      <meshStandardMaterial
        color={lightColor}
        emissive={lightColor}
        emissiveIntensity={emissiveIntensity}
        toneMapped={false}
      />
      {lightPaths.map((pos, i) => (
        <Instance key={i} position={pos} />
      ))}
    </Instances>
  );
}

// ---------------------------------------------------------------------------
// Scattered rocks (instanced)
// ---------------------------------------------------------------------------

function ScatteredRocks() {
  const rockData = useMemo(() => {
    const data: { pos: [number, number, number]; scale: number; rot: [number, number, number] }[] = [
      { pos: [8, 0.2, 10], scale: 0.6, rot: [0.2, 1.0, 0] },
      { pos: [-10, 0.15, 8], scale: 0.4, rot: [0, 2.1, 0.3] },
      { pos: [16, 0.25, -5], scale: 0.7, rot: [0.1, 0.5, 0] },
      { pos: [-8, 0.15, -10], scale: 0.5, rot: [0, 1.8, 0.2] },
      { pos: [5, 0.2, -8], scale: 0.45, rot: [0.3, 0.7, 0] },
      { pos: [-15, 0.2, 0], scale: 0.55, rot: [0, 3.0, 0.1] },
      { pos: [2, 0.15, 12], scale: 0.35, rot: [0.1, 1.4, 0] },
      { pos: [-4, 0.2, -16], scale: 0.5, rot: [0, 2.5, 0.2] },
      { pos: [15, 0.3, 8], scale: 0.8, rot: [0.2, 0.3, 0.1] },
      { pos: [-12, 0.2, -6], scale: 0.4, rot: [0, 1.1, 0] },
    ];
    return data;
  }, []);

  return (
    <Instances limit={15}>
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#808080" roughness={0.95} flatShading />
      {rockData.map((rock, i) => (
        <Instance
          key={i}
          position={rock.pos}
          scale={rock.scale}
          rotation={rock.rot}
        />
      ))}
    </Instances>
  );
}

// ---------------------------------------------------------------------------
// Water plane with gentle animation
// ---------------------------------------------------------------------------

function WaterPlane({ isNight }: { isNight: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = -0.15 + Math.sin(clock.getElapsedTime() * 0.5) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
      <planeGeometry args={[120, 120, 1, 1]} />
      <meshStandardMaterial
        color={isNight ? "#0A2A4A" : "#1E90FF"}
        transparent
        opacity={0.75}
        roughness={0.15}
        metalness={0.1}
      />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Island ground
// ---------------------------------------------------------------------------

function IslandGround({ isNight }: { isNight: boolean }) {
  const groundColor = isNight ? "#1E5C1E" : "#3CB043";

  return (
    <group>
      {/* Main island - slightly irregular via overlapping ellipses */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[20, 48]} />
        <meshStandardMaterial color={groundColor} roughness={0.95} />
      </mesh>
      {/* Slight extension north */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -6]} scale={[14, 10, 1]}>
        <circleGeometry args={[1, 32]} />
        <meshStandardMaterial color={groundColor} roughness={0.95} />
      </mesh>
      {/* Slight extension south-east for dock area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[8, 0, 10]} scale={[10, 8, 1]}>
        <circleGeometry args={[1, 24]} />
        <meshStandardMaterial color={groundColor} roughness={0.95} />
      </mesh>
      {/* Slight extension south for beach */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 10]} scale={[15, 9, 1]}>
        <circleGeometry args={[1, 28]} />
        <meshStandardMaterial color={groundColor} roughness={0.95} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface IslandEnvironmentProps {
  isNight: boolean;
}

export default function IslandEnvironment({ isNight }: IslandEnvironmentProps) {
  return (
    <group>
      {/* Water (large plane under everything) */}
      <WaterPlane isNight={isNight} />

      {/* Island ground */}
      <IslandGround isNight={isNight} />

      {/* Zones */}
      <Beach isNight={isNight} />
      <Villa isNight={isNight} />
      <Garden isNight={isNight} />
      <ChallengeArena isNight={isNight} />
      <JungleTrail isNight={isNight} />
      <Dock isNight={isNight} />
      <LookoutPoint isNight={isNight} />

      {/* Scattered environment details */}
      <ScatteredRocks />
      <StringLights isNight={isNight} />

      {/* Extra palm trees scattered around the island */}
      <PalmTree position={[-10, 0, 12]} scale={1.0} />
      <PalmTree position={[6, 0, -6]} scale={0.85} />
      <PalmTree position={[-14, 0, -4]} scale={1.1} />
      <PalmTree position={[10, 0, -10]} scale={0.95} />

      {/* Extra simple trees */}
      <SimpleTree position={[-8, 0, 4]} color="#2E8B2E" />
      <SimpleTree position={[8, 0, 5]} color="#228B22" />
      <SimpleTree position={[-5, 0, -4]} color="#1E7A1E" />
      <SimpleTree position={[4, 0, -10]} color="#2E8B2E" />

      {/* Extra scattered rocks near water's edge */}
      <Rock position={[-16, 0.1, 10]} scale={0.7} />
      <Rock position={[17, 0.1, 5]} scale={0.6} />
      <Rock position={[-12, 0.15, 14]} scale={0.5} />
    </group>
  );
}
