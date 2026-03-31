"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { CAMERA } from "@/game/constants";
import { playerPositionRef } from "@/scene/PlayerController";

// ---------------------------------------------------------------------------
// Isometric offset – 45° Y rotation, ~33° X tilt
// The length of this vector controls how far the camera sits from the player.
// ---------------------------------------------------------------------------

const ISO_OFFSET = new THREE.Vector3(20, 20, 20);

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
  const initialised = useRef(false);

  useFrame(() => {
    // Ensure we're working with an orthographic camera
    if (!(camera instanceof THREE.OrthographicCamera)) return;

    const playerPos = playerPositionRef.current;

    // First frame: snap to position instead of lerping from origin
    if (!initialised.current) {
      smoothTarget.current.copy(playerPos);
      smoothPosition.current.copy(playerPos).add(ISO_OFFSET);
      camera.position.copy(smoothPosition.current);
      camera.lookAt(
        playerPos.x + LOOK_AHEAD_OFFSET.x,
        playerPos.y + LOOK_AHEAD_OFFSET.y,
        playerPos.z + LOOK_AHEAD_OFFSET.z,
      );
      camera.zoom = CAMERA.ZOOM;
      camera.near = CAMERA.NEAR;
      camera.far = CAMERA.FAR;
      camera.updateProjectionMatrix();
      initialised.current = true;
      return;
    }

    // Desired positions
    const desiredTarget = playerPos;
    const desiredPosition = _v.copy(playerPos).add(ISO_OFFSET);

    // Smooth lerp
    smoothTarget.current.lerp(desiredTarget, CAMERA.LERP_FACTOR);
    smoothPosition.current.lerp(desiredPosition, CAMERA.LERP_FACTOR);

    camera.position.copy(smoothPosition.current);
    camera.lookAt(
      smoothTarget.current.x + LOOK_AHEAD_OFFSET.x,
      smoothTarget.current.y + LOOK_AHEAD_OFFSET.y,
      smoothTarget.current.z + LOOK_AHEAD_OFFSET.z,
    );

    camera.zoom = CAMERA.ZOOM;
    camera.updateProjectionMatrix();
  });

  return null;
}

// Scratch vector to avoid per-frame allocations
const _v = new THREE.Vector3();
