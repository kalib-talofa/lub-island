"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { CAMERA } from "@/game/constants";
import { playerPositionRef } from "@/scene/PlayerController";

// ---------------------------------------------------------------------------
// Camera angle control (0-100, default 50)
//   0   = low angle, close to ground, zoomed in
//   50  = default isometric (20,20,20) at zoom 60
//   100 = high bird's-eye, zoomed out
// ---------------------------------------------------------------------------

/** Shared ref — writable from DevToolbar, pinch gestures, etc. */
export const cameraAngleRef = { current: 50 };

// Presets at the three key points of the slider
const LOW_OFFSET = new THREE.Vector3(15, 8, 15);   // slider = 0
const MID_OFFSET = new THREE.Vector3(20, 20, 20);  // slider = 50
const HIGH_OFFSET = new THREE.Vector3(25, 35, 25);  // slider = 100

const LOW_ZOOM = 85;
const MID_ZOOM = 60;
const HIGH_ZOOM = 38;

/** Compute offset & zoom from the 0-100 slider value */
function getOffsetAndZoom(slider: number) {
  const t = THREE.MathUtils.clamp(slider, 0, 100);
  if (t <= 50) {
    // Interpolate LOW → MID
    const f = t / 50;
    return {
      offset: _scratch1.copy(LOW_OFFSET).lerp(MID_OFFSET, f),
      zoom: THREE.MathUtils.lerp(LOW_ZOOM, MID_ZOOM, f),
    };
  } else {
    // Interpolate MID → HIGH
    const f = (t - 50) / 50;
    return {
      offset: _scratch1.copy(MID_OFFSET).lerp(HIGH_OFFSET, f),
      zoom: THREE.MathUtils.lerp(MID_ZOOM, HIGH_ZOOM, f),
    };
  }
}

/**
 * Portrait framing offset: shifts the look-target slightly *above* the
 * player in world space so the character sits in the lower-centre third of
 * the screen rather than dead-centre.
 */
const LOOK_AHEAD_OFFSET = new THREE.Vector3(0, 0, -2);

// ---------------------------------------------------------------------------
// IsometricCamera
// ---------------------------------------------------------------------------

export default function IsometricCamera() {
  const { camera } = useThree();
  const smoothTarget = useRef(new THREE.Vector3());
  const smoothPosition = useRef(new THREE.Vector3());
  const smoothZoom = useRef(MID_ZOOM);
  const initialised = useRef(false);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Scroll up (deltaY < 0) → zoom in (lower angle value)
      // Scroll down (deltaY > 0) → zoom out (higher angle value)
      cameraAngleRef.current = THREE.MathUtils.clamp(
        cameraAngleRef.current + (e.deltaY > 0 ? 5 : -5),
        0, 100
      );
    };

    const handleMiddleClick = (e: MouseEvent) => {
      if (e.button === 1) {
        e.preventDefault();
        cameraAngleRef.current = 50; // Reset to default isometric angle
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('mousedown', handleMiddleClick);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousedown', handleMiddleClick);
    };
  }, []);

  useFrame(() => {
    // Ensure we're working with an orthographic camera
    if (!(camera instanceof THREE.OrthographicCamera)) return;

    const playerPos = playerPositionRef.current;
    const { offset, zoom } = getOffsetAndZoom(cameraAngleRef.current);

    // First frame: snap to position instead of lerping from origin
    if (!initialised.current) {
      smoothTarget.current.copy(playerPos);
      smoothPosition.current.copy(playerPos).add(offset);
      smoothZoom.current = zoom;
      camera.position.copy(smoothPosition.current);
      camera.lookAt(
        playerPos.x + LOOK_AHEAD_OFFSET.x,
        playerPos.y + LOOK_AHEAD_OFFSET.y,
        playerPos.z + LOOK_AHEAD_OFFSET.z,
      );
      camera.zoom = zoom;
      camera.near = CAMERA.NEAR;
      camera.far = CAMERA.FAR;
      camera.updateProjectionMatrix();
      initialised.current = true;
      return;
    }

    // Desired positions
    const desiredTarget = playerPos;
    const desiredPosition = _v.copy(playerPos).add(offset);

    // Smooth lerp
    smoothTarget.current.lerp(desiredTarget, CAMERA.LERP_FACTOR);
    smoothPosition.current.lerp(desiredPosition, CAMERA.LERP_FACTOR);
    smoothZoom.current += (zoom - smoothZoom.current) * CAMERA.LERP_FACTOR;

    camera.position.copy(smoothPosition.current);
    camera.lookAt(
      smoothTarget.current.x + LOOK_AHEAD_OFFSET.x,
      smoothTarget.current.y + LOOK_AHEAD_OFFSET.y,
      smoothTarget.current.z + LOOK_AHEAD_OFFSET.z,
    );

    camera.zoom = smoothZoom.current;
    camera.updateProjectionMatrix();
  });

  return null;
}

// Scratch vectors to avoid per-frame allocations
const _v = new THREE.Vector3();
const _scratch1 = new THREE.Vector3();
