"use client";

import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Instance, Instances, useTexture, useGLTF } from "@react-three/drei";
import { useGameStore } from "@/store/gameStore";
import { isZoneUnlocked, isStructureUnlocked } from "@/game/unlocks";

useGLTF.preload("/models/Environment/TropicalTree.glb");
useGLTF.preload("/models/Environment/EvergreenTree.glb");

// Wraps drei's useTexture and configures tiling/colorspace
function useConfiguredTexture(path: string, repeat: [number, number]): THREE.Texture {
  const texture = useTexture(path);
  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeat[0], repeat[1]);
    texture.needsUpdate = true;
  }, [texture]);
  return texture;
}

// ---------------------------------------------------------------------------
// Zone positions - exported so NPCs / other systems can reference them
// ---------------------------------------------------------------------------

export const ZONE_POSITIONS: Record<string, [number, number, number]> = {
  beach: [0, 0, 16],
  villa: [0, 0.1, 0],
  garden: [28, 0, 0],       // east land plot (unlocked by Rosie)
  arena: [-28, 0, 0],       // west land plot (unlocked by Blaze)
  jungle: [0, 0, -30],      // north land plot (unlocked by Lily)
  dock: [12, 0, 16],
  lookout: [14, 1.5, -22],  // northeast land plot (unlocked by Kiki)
  cave: [-17.5, 0, -2.1],   // west side base island
};

// ---------------------------------------------------------------------------
// Reusable sub-components
// ---------------------------------------------------------------------------

function PalmTree({ position, scale = 5 }: { position: [number, number, number]; scale?: number }) {
  const { scene } = useGLTF("/models/Environment/TropicalTree.glb");
  const clone = useMemo(() => {
    const c = scene.clone();
    c.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) { mesh.castShadow = true; mesh.receiveShadow = true; }
    });
    return c;
  }, [scene]);
  return <primitive object={clone} position={[position[0], position[1] + scale * 0.52, position[2]]} scale={scale} />;
}

function SimpleTree({ position, scale = 5 }: { position: [number, number, number]; scale?: number }) {
  const { scene } = useGLTF("/models/Environment/EvergreenTree.glb");
  const clone = useMemo(() => {
    const c = scene.clone();
    c.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) { mesh.castShadow = true; mesh.receiveShadow = true; }
    });
    return c;
  }, [scene]);
  return <primitive object={clone} position={[position[0], position[1] + scale * 0.5, position[2]]} scale={scale} />;
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
// Land plot ground — large grass ellipse beneath each NPC-unlocked zone
// ---------------------------------------------------------------------------

/**
 * Blob descriptor: [offsetX, offsetZ, scaleX, scaleZ]
 * Positioned relative to the parent group (the zone).
 */
type BlobDef = [number, number, number, number];

interface LandPlotProps {
  isNight: boolean;
  semiX: number;
  semiZ: number;
  /** Extra ground blobs that create organic coastline + bridges to main island */
  blobs?: BlobDef[];
}

function LandPlot({ isNight, semiX, semiZ, blobs }: LandPlotProps) {
  const groundColor = isNight ? "#1E5C1E" : "#3CB043";
  const baseTex = useTexture("/textures/Grass.png");
  const texture = useMemo(() => {
    const t = baseTex.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(Math.round(semiX * 0.8), Math.round(semiZ * 0.8));
    t.needsUpdate = true;
    return t;
  }, [baseTex, semiX, semiZ]);

  return (
    <group>
      {/* Main plot ellipse */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} scale={[semiX, semiZ, 1]}>
        <circleGeometry args={[1, 32]} />
        <meshStandardMaterial color={groundColor} map={texture} roughness={0.95} />
      </mesh>
      {/* Organic edge & bridge blobs */}
      {blobs?.map((b, i) => (
        <mesh key={`blob-${i}`} receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[b[0], -0.004, b[1]]} scale={[b[2], b[3], 1]}>
          <circleGeometry args={[1, 20]} />
          <meshStandardMaterial color={groundColor} map={texture} roughness={0.95} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-1} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Zone components
// ---------------------------------------------------------------------------

function Beach({ isNight }: { isNight: boolean }) {
  const sandColor = isNight ? "#A89060" : "#F4D68C";
  const sandTexture = useConfiguredTexture("/textures/Sand.png", [6, 3]);
  return (
    <group position={[ZONE_POSITIONS.beach[0], ZONE_POSITIONS.beach[1], ZONE_POSITIONS.beach[2]]}>
      {/* Sand area — raised above grass extensions and stronger polygonOffset */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} scale={[18, 6, 1]}>
        <circleGeometry args={[1, 32]} />
        <meshStandardMaterial color={sandColor} map={sandTexture} roughness={1} polygonOffset polygonOffsetFactor={-6} polygonOffsetUnits={-6} />
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
          <mesh castShadow position={[0, 2.8, 0]}>
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
      <PalmTree position={[-8, 0, -2]} scale={5.5} />
      <PalmTree position={[10, 0, -1.5]} scale={4.5} />
      <PalmTree position={[-1, 0, -3]} scale={5.0} />
    </group>
  );
}

function Villa({ isNight }: { isNight: boolean }) {
  const wallColor = isNight ? "#9B7548" : "#C89660";
  const roofColor = isNight ? "#7A3020" : "#A0522D";
  const roofTexture = useConfiguredTexture("/textures/RoofColor.png", [2, 2]);
  const wallTexture = useConfiguredTexture("/textures/WoodPanel.png", [2, 2]);
  const porchTexture = useConfiguredTexture("/textures/WoodPanelLong.png", [4, 1]);

  // Per-face material array for building boxes: sides = wood, top (+Y face 2) = roof tile
  const wallBoxMats = useMemo(() => {
    const wall = new THREE.MeshStandardMaterial({ color: wallColor, map: wallTexture ?? undefined, roughness: 0.8 });
    const top  = new THREE.MeshStandardMaterial({ color: roofColor, map: roofTexture ?? undefined, roughness: 0.85 });
    // BoxGeometry face order: +X, -X, +Y (top), -Y (bottom), +Z, -Z
    return [wall, wall, top, wall, wall, wall];
  }, [wallColor, wallTexture, roofColor, roofTexture]);

  return (
    <group position={[ZONE_POSITIONS.villa[0], ZONE_POSITIONS.villa[1], ZONE_POSITIONS.villa[2]]}>
      {/* Main hall */}
      <mesh castShadow receiveShadow position={[0, 1.5, 0]} material={wallBoxMats}>
        <boxGeometry args={[6, 3, 5]} />
      </mesh>
      {/* Roof */}
      <mesh castShadow position={[0, 3.3, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[5, 1.6, 4]} />
        <meshStandardMaterial color={roofColor} map={roofTexture} roughness={0.85} />
      </mesh>

      {/* Left wing room */}
      <mesh castShadow receiveShadow position={[-4.5, 1.0, 0]} material={wallBoxMats}>
        <boxGeometry args={[3, 2, 3.5]} />
      </mesh>
      <mesh castShadow position={[-4.5, 2.25, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[2.8, 1.0, 4]} />
        <meshStandardMaterial color={roofColor} map={roofTexture} roughness={0.85} />
      </mesh>

      {/* Right wing room */}
      <mesh castShadow receiveShadow position={[4.5, 1.0, 0]} material={wallBoxMats}>
        <boxGeometry args={[3, 2, 3.5]} />
      </mesh>
      <mesh castShadow position={[4.5, 2.25, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[2.8, 1.0, 4]} />
        <meshStandardMaterial color={roofColor} map={roofTexture} roughness={0.85} />
      </mesh>

      {/* Porch / deck area (front) */}
      <mesh receiveShadow position={[0, 0.08, 3.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[8, 3, 0.15]} />
        <meshStandardMaterial color="#B8860B" map={porchTexture} roughness={0.9} />
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
        <meshStandardMaterial color={roofColor} map={roofTexture} roughness={0.85} />
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
  const grassTexture = useConfiguredTexture("/textures/Grass.png", [4, 4]);
  const gravelTexture = useConfiguredTexture("/textures/GravelRock.png", [2, 2]);
  const benchTexture = useConfiguredTexture("/textures/WoodPanelLong.png", [2, 1]);
  return (
    <group position={[ZONE_POSITIONS.garden[0], ZONE_POSITIONS.garden[1], ZONE_POSITIONS.garden[2]]}>
      {/* Land plot ground */}
      <LandPlot isNight={isNight} semiX={12} semiZ={10} blobs={[
        // Bridge blobs toward main island (west, negative X)
        [-14, -1, 5, 4],
        [-17, 0, 4, 3.5],
        [-20, 1, 4, 3],
        // Outer edge scatter (east / north / south)
        [10, -7, 4, 3],
        [8, 8, 3.5, 2.5],
        [11, 3, 3, 3],
        [-4, -9, 3, 2.5],
        [-2, 9, 3.5, 2],
        [5, -10, 2.5, 2],
      ]} />
      {/* Edge trees */}
      <SimpleTree position={[-9, 0, -6]} />
      <SimpleTree position={[9, 0, 5]} />
      <PalmTree position={[-7, 0, 7]} scale={4.5} />
      <PalmTree position={[8, 0, -7]} scale={5.0} />
      {/* Grassy patch — darker tint, garden area within the plot */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[6, 24]} />
        <meshStandardMaterial color={isNight ? "#1A4A1A" : "#236B23"} map={grassTexture} roughness={1} polygonOffset polygonOffsetFactor={-6} polygonOffsetUnits={-6} />
      </mesh>

      {/* Fountain - central */}
      <group position={[0, 0, 0]}>
        {/* Base pool */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[1.5, 1.6, 0.5, 16]} />
          <meshStandardMaterial color="#B0B0B0" map={gravelTexture} roughness={0.6} />
        </mesh>
        {/* Water in pool */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[1.35, 1.35, 0.15, 16]} />
          <meshStandardMaterial color="#4488CC" transparent opacity={0.6} roughness={0.2} />
        </mesh>
        {/* Pedestal */}
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.25, 0.35, 1.0, 8]} />
          <meshStandardMaterial color="#C0C0C0" map={gravelTexture} roughness={0.5} />
        </mesh>
        {/* Top bowl */}
        <mesh position={[0, 1.5, 0]}>
          <torusGeometry args={[0.5, 0.15, 8, 16]} />
          <meshStandardMaterial color="#C0C0C0" map={gravelTexture} roughness={0.5} />
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
            <meshStandardMaterial color="#8B6914" map={benchTexture} roughness={0.85} />
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
            <meshStandardMaterial color="#8B6914" map={benchTexture} roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ChallengeArena({ isNight }: { isNight: boolean }) {
  const markerColor = isNight ? "#CC6600" : "#FF8C00";
  const gravelTexture = useConfiguredTexture("/textures/GravelRock.png", [5, 5]);
  return (
    <group position={[ZONE_POSITIONS.arena[0], ZONE_POSITIONS.arena[1], ZONE_POSITIONS.arena[2]]}>
      {/* Land plot ground */}
      <LandPlot isNight={isNight} semiX={12} semiZ={10} blobs={[
        // Bridge blobs toward main island (east, positive X)
        [14, 1, 5, 4],
        [17, -1, 4, 3.5],
        [20, 0, 4, 3],
        // Outer edge scatter
        [-10, 6, 4, 3],
        [-8, -7, 3.5, 2.5],
        [-11, -2, 3, 3],
        [3, 9, 3, 2.5],
        [4, -9, 3.5, 2],
        [-5, 9, 2.5, 2],
      ]} />
      {/* Edge decorations */}
      <PalmTree position={[-9, 0, 6]} scale={4.0} />
      <PalmTree position={[8, 0, -5]} scale={4.5} />
      <Rock position={[-8, 0.2, -6]} scale={1.2} />
      <Rock position={[9, 0.15, 5]} scale={0.8} />
      {/* Arena floor — raised above base grass extensions */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[7, 32]} />
        <meshStandardMaterial color={isNight ? "#8B7355" : "#C4A66A"} map={gravelTexture} roughness={0.95} polygonOffset polygonOffsetFactor={-6} polygonOffsetUnits={-6} />
      </mesh>

      {/* Inner ring marking */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
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
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.35, 8]} />
              <meshStandardMaterial color="#444444" roughness={0.9} />
            </mesh>
          </group>
        );
      })}

      {/* Center podium */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[1.0, 1.2, 0.4, 12]} />
        <meshStandardMaterial color="#808080" map={gravelTexture} roughness={0.7} />
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
      {/* Land plot ground */}
      <LandPlot isNight={isNight} semiX={10} semiZ={14} blobs={[
        // Bridge blobs toward main island (south, positive Z)
        [1, 16, 4, 5],
        [-1, 19, 3.5, 4],
        [0, 22, 3, 3.5],
        // Outer edge scatter (north / east / west)
        [-8, -10, 3, 3.5],
        [7, -11, 3.5, 3],
        [-9, 3, 3, 2.5],
        [8, -4, 2.5, 3],
        [0, -13, 3, 2.5],
        [-6, 10, 2.5, 2],
        [6, 8, 2.5, 2.5],
      ]} />
      {/* Lily's pond */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5, 0.02, 5]}>
        <circleGeometry args={[2.5, 16]} />
        <meshStandardMaterial color={isNight ? "#2A4A6A" : "#4488CC"} transparent opacity={0.6} roughness={0.2} />
      </mesh>
      {/* Extra edge trees */}
      <PalmTree position={[-7, 0, 8]} scale={5.5} />
      <PalmTree position={[7, 0, 9]} scale={4.5} />
      <SimpleTree position={[-6, 0, -10]} />
      <SimpleTree position={[5, 0, -11]} />
      <SimpleTree position={[0, 0, 10]} />
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
        <SimpleTree key={`jtree-${i}`} position={pos} />
      ))}

      {/* Bushes */}
      {bushPositions.map((pos, i) => (
        <mesh key={`bush-${i}`} position={[pos[0], 0.35, pos[2]]} scale={[1, 0.7, 1]}>
          <sphereGeometry args={[0.55, 7, 6]} />
          <meshStandardMaterial color={isNight ? "#1A4C1A" : "#2D7D2D"} roughness={0.9} />
        </mesh>
      ))}

      {/* A couple palm trees in the jungle */}
      <PalmTree position={[-4, 0, -5.5]} scale={6.0} />
      <PalmTree position={[5, 0, -4.5]} scale={5.0} />
    </group>
  );
}

function Dock({ isNight, locked = false }: { isNight: boolean; locked?: boolean }) {
  const woodColor = isNight ? "#6B5030" : "#9B7653";
  const boardColor = isNight ? "#5a4530" : "#8B6914";
  const plankTexture = useConfiguredTexture("/textures/WoodPanelLong.png", [1, 1]);
  const railTexture = useConfiguredTexture("/textures/WoodPanelSimple.png", [1, 1]);
  return (
    <group position={[ZONE_POSITIONS.dock[0], ZONE_POSITIONS.dock[1], ZONE_POSITIONS.dock[2]]}>
      {/* Pier planks */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`plank-${i}`} position={[0, 0.4, i * 1.2]}>
          <boxGeometry args={[2.0, 0.12, 1.0]} />
          <meshStandardMaterial color={woodColor} map={plankTexture} roughness={0.9} />
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
            <meshStandardMaterial color={woodColor} map={railTexture} roughness={0.85} />
          </mesh>
          <mesh position={[0.9, 0.9, i * 2.2]}>
            <cylinderGeometry args={[0.05, 0.05, 1.0, 4]} />
            <meshStandardMaterial color={woodColor} map={railTexture} roughness={0.85} />
          </mesh>
        </group>
      ))}

      {/* Top rails */}
      <mesh position={[-0.9, 1.35, 4.5]}>
        <boxGeometry args={[0.08, 0.08, 9.5]} />
        <meshStandardMaterial color={woodColor} map={railTexture} roughness={0.85} />
      </mesh>
      <mesh position={[0.9, 1.35, 4.5]}>
        <boxGeometry args={[0.08, 0.08, 9.5]} />
        <meshStandardMaterial color={woodColor} map={railTexture} roughness={0.85} />
      </mesh>

      {/* Mooring post at the end */}
      <mesh position={[0, 0.7, 9.2]}>
        <cylinderGeometry args={[0.15, 0.2, 0.8, 6]} />
        <meshStandardMaterial color="#5C3A1E" roughness={0.9} />
      </mesh>

      {/* Construction barrier when locked */}
      {locked && (
        <group position={[0, 0, -0.3]}>
          {/* Barrier beams */}
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[2.4, 0.15, 0.1]} />
            <meshStandardMaterial color="#FFD700" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[2.4, 0.15, 0.1]} />
            <meshStandardMaterial color="#FFD700" roughness={0.7} />
          </mesh>
          {/* Barrier posts */}
          <mesh position={[-1.1, 0.5, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 1.0, 4]} />
            <meshStandardMaterial color={boardColor} roughness={0.8} />
          </mesh>
          <mesh position={[1.1, 0.5, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 1.0, 4]} />
            <meshStandardMaterial color={boardColor} roughness={0.8} />
          </mesh>
          {/* "UNDER CONSTRUCTION" sign */}
          <mesh position={[0, 1.1, 0.06]}>
            <boxGeometry args={[1.4, 0.35, 0.04]} />
            <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} roughness={0.7} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function LookoutPoint({ isNight }: { isNight: boolean }) {
  const gravelTexture = useConfiguredTexture("/textures/GravelRock.png", [3, 3]);
  const platformTexture = useConfiguredTexture("/textures/WoodPanelSimple.png", [2, 2]);
  return (
    <group position={[ZONE_POSITIONS.lookout[0], ZONE_POSITIONS.lookout[1], ZONE_POSITIONS.lookout[2]]}>
      {/* Land plot ground (offset down by Y to compensate for elevated zone position) */}
      <group position={[0, -1.5, 0]}>
        <LandPlot isNight={isNight} semiX={10} semiZ={10} blobs={[
          // Bridge blobs toward main island (south-west)
          [-6, 10, 4, 4.5],
          [-9, 13, 3.5, 4],
          [-11, 16, 3, 3.5],
          // Outer edge scatter
          [8, -6, 3, 3],
          [-7, -7, 3.5, 2.5],
          [7, 5, 2.5, 3],
          [-8, 3, 2.5, 2.5],
          [4, -9, 2.5, 2],
          [9, -1, 2, 2.5],
        ]} />
      </group>
      {/* Edge decorations */}
      <SimpleTree position={[-7, -1.5, -5]} />
      <SimpleTree position={[6, -1.5, 5]} />
      <Rock position={[-5, -1.3, 6]} scale={0.9} />
      <Rock position={[7, -1.3, -6]} scale={0.7} />
      <PalmTree position={[8, -1.5, 3]} scale={4.0} />
      {/* Elevated mound */}
      <mesh position={[0, -0.2, 0]} scale={[3, 1.5, 3]}>
        <sphereGeometry args={[1.2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={isNight ? "#3A6B2A" : "#4A8B3A"} map={gravelTexture} roughness={0.95} />
      </mesh>

      {/* Flat top platform */}
      <mesh position={[0, 1.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.8, 12]} />
        <meshStandardMaterial color={isNight ? "#6B5030" : "#9B7653"} map={platformTexture} roughness={0.9} />
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
// Cave Exterior
// ---------------------------------------------------------------------------

function CaveExterior({ isNight, locked }: { isNight: boolean; locked: boolean }) {
  const rockColor = isNight ? '#4a4540' : '#706860';
  const boardColor = isNight ? '#5a4530' : '#8B6914';

  return (
    <group position={[ZONE_POSITIONS.cave[0], ZONE_POSITIONS.cave[1], ZONE_POSITIONS.cave[2]]}>
      {/* Rocky cliff face */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[4, 3, 3]} />
        <meshStandardMaterial color={rockColor} roughness={0.95} flatShading />
      </mesh>
      {/* Rock formation top */}
      <mesh position={[0, 3.2, 0]} castShadow>
        <dodecahedronGeometry args={[1.8, 0]} />
        <meshStandardMaterial color={rockColor} roughness={0.95} flatShading />
      </mesh>
      {/* Side rocks */}
      <mesh position={[-2.5, 0.8, 0.5]} castShadow>
        <dodecahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial color={rockColor} roughness={0.95} flatShading />
      </mesh>
      <mesh position={[2.5, 0.8, -0.5]} castShadow>
        <dodecahedronGeometry args={[1.0, 0]} />
        <meshStandardMaterial color={rockColor} roughness={0.95} flatShading />
      </mesh>

      {/* Cave entrance (dark hole) - visible when unlocked */}
      {!locked && (
        <mesh position={[0, 1.0, 1.51]}>
          <planeGeometry args={[1.6, 2.0]} />
          <meshStandardMaterial color="#1a1a1a" roughness={1} />
        </mesh>
      )}

      {/* Construction boards when locked */}
      {locked && (
        <group position={[0, 1.0, 1.52]}>
          {/* Horizontal boards */}
          {[0, 0.5, 1.0, -0.5].map((y, i) => (
            <mesh key={`board-${i}`} position={[0, y, 0]}>
              <boxGeometry args={[1.8, 0.2, 0.08]} />
              <meshStandardMaterial color={boardColor} roughness={0.9} />
            </mesh>
          ))}
          {/* "UNDER CONSTRUCTION" sign */}
          <mesh position={[0, 1.5, 0.05]}>
            <boxGeometry args={[1.4, 0.4, 0.04]} />
            <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} roughness={0.7} />
          </mesh>
        </group>
      )}
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

  // Sample a few evenly-spaced points per path for actual point lights.
  // We don't want 32 lights — just ~2-3 per string is enough to pool warm
  // light onto the ground beneath the strings.
  const poolLights = useMemo(() => {
    const lights: [number, number, number][] = [];
    // Villa-to-beach path: pick indices 3, 7, 11 (roughly 1/4, 2/3, end)
    [3, 7, 11].forEach(i => {
      const t = i / 11;
      lights.push([
        Math.sin(t * 4) * 1.5,
        1.4, // slightly below the bulbs so light hits the ground
        THREE.MathUtils.lerp(3, 14, t),
      ]);
    });
    // Villa-to-garden path: pick indices 2, 6, 9
    [2, 6, 9].forEach(i => {
      const t = i / 9;
      lights.push([
        THREE.MathUtils.lerp(3, 14, t),
        1.4,
        THREE.MathUtils.lerp(0, 2, t) + Math.sin(t * 3) * 1.0,
      ]);
    });
    // Villa-to-arena path: pick indices 2, 6, 9
    [2, 6, 9].forEach(i => {
      const t = i / 9;
      lights.push([
        THREE.MathUtils.lerp(-3, -14, t),
        1.4,
        THREE.MathUtils.lerp(0, 2, t) + Math.sin(t * 3) * 1.0,
      ]);
    });
    return lights;
  }, []);

  const emissiveIntensity = isNight ? 2.0 : 0;
  const lightColor = "#FFE4B0";

  if (!isNight) return null;

  return (
    <>
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

      {/* Point lights that project warm pools onto the ground beneath each string */}
      {poolLights.map((pos, i) => (
        <pointLight
          key={`sl-${i}`}
          position={pos}
          color="#FFD08A"
          intensity={1.2}
          distance={8}
          decay={1.8}
        />
      ))}
    </>
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
  const waterTexture = useConfiguredTexture("/textures/Water.png", [8, 8]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.y = -0.15 + Math.sin(t * 0.5) * 0.05;
    }
    // Scroll UVs diagonally for a gentle ocean current effect
    waterTexture.offset.x = t * 0.035;
    waterTexture.offset.y = t * 0.018;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
      <planeGeometry args={[120, 120, 1, 1]} />
      <meshStandardMaterial
        color={isNight ? "#2A4A6A" : "#ffffff"}
        map={waterTexture}
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
  const grassTexture = useConfiguredTexture("/textures/Grass.png", [8, 8]);

  return (
    <group>
      {/* Main island - slightly irregular via overlapping ellipses.
          Each layer gets a tiny Y bump + stronger polygonOffset so they
          stack cleanly without z-fighting even where extensions overlap. */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[20, 48]} />
        <meshStandardMaterial color={groundColor} map={grassTexture} roughness={0.95} />
      </mesh>
      {/* Slight extension north */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -6]} scale={[14, 10, 1]}>
        <circleGeometry args={[1, 32]} />
        <meshStandardMaterial color={groundColor} map={grassTexture} roughness={0.95} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-2} />
      </mesh>
      {/* Slight extension south-east for dock area */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[8, 0.006, 10]} scale={[10, 8, 1]}>
        <circleGeometry args={[1, 24]} />
        <meshStandardMaterial color={groundColor} map={grassTexture} roughness={0.95} polygonOffset polygonOffsetFactor={-3} polygonOffsetUnits={-3} />
      </mesh>
      {/* Slight extension south for beach */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.007, 10]} scale={[15, 9, 1]}>
        <circleGeometry args={[1, 28]} />
        <meshStandardMaterial color={groundColor} map={grassTexture} roughness={0.95} polygonOffset polygonOffsetFactor={-4} polygonOffsetUnits={-4} />
      </mesh>
      {/* Organic edge bumps around main island perimeter */}
      {([
        [17, 6, 4, 3],
        [-16, 8, 3.5, 3],
        [14, -12, 3.5, 3],
        [-15, -10, 3, 3.5],
        [-18, 3, 3, 2.5],
        [5, -18, 3.5, 2.5],
        [-6, -17, 3, 3],
        [18, -3, 2.5, 3],
      ] as [number, number, number, number][]).map((b, i) => (
        <mesh key={`edge-${i}`} receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[b[0], 0.003, b[1]]} scale={[b[2], b[3], 1]}>
          <circleGeometry args={[1, 18]} />
          <meshStandardMaterial color={groundColor} map={grassTexture} roughness={0.95} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-1} />
        </mesh>
      ))}
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
  const arrivedNPCIds = useGameStore(s => s.arrivedNPCIds);
  const week = useGameStore(s => s.week);
  const day = useGameStore(s => s.day);

  const gardenUnlocked = isZoneUnlocked('garden', arrivedNPCIds);
  const arenaUnlocked = isZoneUnlocked('arena', arrivedNPCIds);
  const jungleUnlocked = isZoneUnlocked('jungle', arrivedNPCIds);
  const lookoutUnlocked = isZoneUnlocked('lookout', arrivedNPCIds);
  const dockLocked = !isStructureUnlocked('dock', week, day);
  const caveLocked = !isStructureUnlocked('cave', week, day);

  return (
    <group>
      {/* Water (large plane under everything) */}
      <Suspense fallback={null}>
        <WaterPlane isNight={isNight} />
      </Suspense>

      {/* Textured zones — Suspense handles texture loading; scene appears once all are ready */}
      <Suspense fallback={null}>
        <IslandGround isNight={isNight} />
        {/* Base zones — always visible */}
        <Beach isNight={isNight} />
        <Villa isNight={isNight} />
        {/* NPC-arrival zones — conditionally rendered */}
        {gardenUnlocked && <Garden isNight={isNight} />}
        {arenaUnlocked && <ChallengeArena isNight={isNight} />}
        {lookoutUnlocked && <LookoutPoint isNight={isNight} />}
        {jungleUnlocked && <JungleTrail isNight={isNight} />}
        {/* Lockable structures — always rendered, visual state changes */}
        <Dock isNight={isNight} locked={dockLocked} />
        <CaveExterior isNight={isNight} locked={caveLocked} />

        {/* Extra palm trees scattered around the island */}
        <PalmTree position={[-10, 0, 12]} scale={5.0} />
        <PalmTree position={[6, 0, -6]} scale={4.0} />
        <PalmTree position={[-14, 0, -4]} scale={5.5} />
        <PalmTree position={[10, 0, -10]} scale={4.5} />

        {/* Extra evergreen trees */}
        <SimpleTree position={[-8, 0, 4]} />
        <SimpleTree position={[8, 0, 5]} />
        <SimpleTree position={[-5, 0, -4]} />
        <SimpleTree position={[4, 0, -10]} />
      </Suspense>

      {/* Scattered environment details */}
      <ScatteredRocks />
      <StringLights isNight={isNight} />

      {/* Extra scattered rocks near water's edge */}
      <Rock position={[-16, 0.1, 10]} scale={0.7} />
      <Rock position={[17, 0.1, 5]} scale={0.6} />
      <Rock position={[-12, 0.15, 14]} scale={0.5} />
    </group>
  );
}
