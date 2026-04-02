"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { STARTING_CAST } from "@/characters/roster";
import { NPC_ZONE_UNLOCKS, UNLOCKABLE_STRUCTURES } from "@/game/constants";
import { ZONE_POSITIONS } from "@/scene/IslandEnvironment";
import { cameraPanTargetRef } from "@/scene/IsometricCamera";
import { npcPositionsRef } from "@/scene/NPCController";

interface PanStep {
  label: string;
  /** For NPC steps, resolve live position at pan time */
  npcId?: string;
  /** Fallback / structure position */
  position: THREE.Vector3;
}

interface ArrivalsPannerProps {
  npcIds: string[];
  structures: string[];
  onComplete: () => void;
}

const INITIAL_DELAY_MS = 400; // brief pause before first pan so 3D scene is visible
const DWELL_MS = 3000;        // time to linger on each target

export default function ArrivalsPanner({ npcIds, structures, onComplete }: ArrivalsPannerProps) {
  const [currentLabel, setCurrentLabel] = useState("");
  const stepsRef = useRef<PanStep[]>([]);

  useEffect(() => {
    // Build ordered pan targets
    const steps: PanStep[] = [];

    for (const npcId of npcIds) {
      const npc = STARTING_CAST.find(c => c.id === npcId);
      const zoneKey = NPC_ZONE_UNLOCKS[npcId];
      const zonePos = zoneKey ? ZONE_POSITIONS[zoneKey] : null;
      if (npc && zonePos) {
        steps.push({
          label: `${npc.name} has arrived!`,
          npcId,
          position: new THREE.Vector3(zonePos[0], zonePos[1], zonePos[2]),
        });
      }
      // NPCs without a zone (pudge, sprocket) — skip camera pan
    }

    for (const key of structures) {
      const struct = UNLOCKABLE_STRUCTURES[key];
      const pos = ZONE_POSITIONS[key];
      if (struct && pos) {
        steps.push({
          label: `${struct.label} is now open!`,
          position: new THREE.Vector3(pos[0], pos[1], pos[2]),
        });
      }
    }

    // If nothing to pan to, complete immediately
    if (steps.length === 0) {
      onComplete();
      return;
    }

    stepsRef.current = steps;
    const timers: ReturnType<typeof setTimeout>[] = [];

    /** Resolve the best position for a step: live NPC position if available, else fallback */
    function resolvePosition(step: PanStep): THREE.Vector3 {
      if (step.npcId) {
        const live = npcPositionsRef.current[step.npcId];
        if (live) return new THREE.Vector3(live[0], live[1], live[2]);
      }
      return step.position;
    }

    // Start first pan after a brief delay so the scene is visible
    timers.push(setTimeout(() => {
      setCurrentLabel(steps[0].label);
      cameraPanTargetRef.current = resolvePosition(steps[0]);
    }, INITIAL_DELAY_MS));

    // Chain subsequent steps
    for (let i = 1; i < steps.length; i++) {
      timers.push(setTimeout(() => {
        setCurrentLabel(steps[i].label);
        cameraPanTargetRef.current = resolvePosition(steps[i]);
      }, INITIAL_DELAY_MS + i * DWELL_MS));
    }

    // After all steps, release camera back to player
    timers.push(setTimeout(() => {
      setCurrentLabel("");
      cameraPanTargetRef.current = null;
    }, INITIAL_DELAY_MS + steps.length * DWELL_MS));

    // Complete after camera returns to player
    timers.push(setTimeout(() => {
      onComplete();
    }, INITIAL_DELAY_MS + steps.length * DWELL_MS + 1500));

    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!currentLabel) return null;

  return (
    <div className="fixed inset-x-0 bottom-24 z-50 flex justify-center pointer-events-none">
      <div
        className="rounded-2xl px-6 py-3 text-center"
        style={{
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(8px)",
          maxWidth: 340,
        }}
      >
        <span className="text-base font-bold text-white" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
          {currentLabel}
        </span>
      </div>
    </div>
  );
}
