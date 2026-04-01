"use client";

import { useState, useRef, useCallback } from "react";
import { joystickInputRef } from "@/scene/PlayerController";

const OUTER_SIZE = 120;
const KNOB_SIZE = 48;
const MAX_DISPLACEMENT = 40;
const DEAD_ZONE = 5;

// Default resting position (bottom-left, comfy for left thumb)
const DEFAULT_BOTTOM = 24;
const DEFAULT_LEFT = 16;

function JoystickRing({
  knobOffset,
  dimmed,
}: {
  knobOffset: { x: number; y: number };
  dimmed?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-center rounded-full border-2 backdrop-blur-sm"
      style={{
        width: OUTER_SIZE,
        height: OUTER_SIZE,
        borderColor: dimmed ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.2)",
        backgroundColor: dimmed
          ? "rgba(255,255,255,0.06)"
          : "rgba(255,255,255,0.1)",
      }}
    >
      <div
        className="rounded-full shadow-lg"
        style={{
          width: KNOB_SIZE,
          height: KNOB_SIZE,
          backgroundColor: dimmed
            ? "rgba(255,255,255,0.18)"
            : "rgba(255,255,255,0.45)",
          border: dimmed
            ? "2px solid rgba(255,255,255,0.25)"
            : "2px solid rgba(255,255,255,0.4)",
          transform: `translate(${knobOffset.x}px, ${knobOffset.y}px)`,
        }}
      />
    </div>
  );
}

export default function VirtualJoystick() {
  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const centerRef = useRef({ x: 0, y: 0 });
  const activeRef = useRef(false);
  const touchIdRef = useRef<number | null>(null);
  const zoneRef = useRef<HTMLDivElement>(null);

  const updateKnob = useCallback((clientX: number, clientY: number) => {
    const center = centerRef.current;
    let dx = clientX - center.x;
    let dy = clientY - center.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < DEAD_ZONE) {
      setKnobOffset({ x: 0, y: 0 });
      joystickInputRef.current = { x: 0, y: 0, active: true };
      return;
    }

    if (dist > MAX_DISPLACEMENT) {
      dx = (dx / dist) * MAX_DISPLACEMENT;
      dy = (dy / dist) * MAX_DISPLACEMENT;
    }

    setKnobOffset({ x: dx, y: dy });
    const normalizedX = dx / MAX_DISPLACEMENT;
    const normalizedY = dy / MAX_DISPLACEMENT;
    joystickInputRef.current = { x: normalizedX, y: normalizedY, active: true };
  }, []);

  const handleEnd = useCallback(() => {
    activeRef.current = false;
    touchIdRef.current = null;
    setActive(false);
    setKnobOffset({ x: 0, y: 0 });
    joystickInputRef.current = { x: 0, y: 0, active: false };
  }, []);

  const startJoystick = useCallback(
    (clientX: number, clientY: number) => {
      // Use the zone's bounding rect to get accurate positioning
      const zone = zoneRef.current;
      const offsetX = zone ? zone.getBoundingClientRect().left : 0;
      const offsetY = zone ? zone.getBoundingClientRect().top : 0;

      centerRef.current = { x: clientX, y: clientY };
      // Position relative to the zone so the ring centers on the tap
      setJoystickPos({
        x: clientX - offsetX - OUTER_SIZE / 2,
        y: clientY - offsetY - OUTER_SIZE / 2,
      });
      activeRef.current = true;
      setActive(true);
      setKnobOffset({ x: 0, y: 0 });
      joystickInputRef.current = { x: 0, y: 0, active: true };
    },
    [],
  );

  // Touch events
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (activeRef.current) return;
      const touch = e.changedTouches[0];
      touchIdRef.current = touch.identifier;
      startJoystick(touch.clientX, touch.clientY);
    },
    [startJoystick],
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (!activeRef.current) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          updateKnob(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
          return;
        }
      }
    },
    [updateKnob],
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          handleEnd();
          return;
        }
      }
    },
    [handleEnd],
  );

  // Mouse events — attach move/up to window so dragging outside zone works
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      startJoystick(e.clientX, e.clientY);

      const onMouseMove = (me: MouseEvent) => {
        if (!activeRef.current) return;
        updateKnob(me.clientX, me.clientY);
      };
      const onMouseUp = () => {
        handleEnd();
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [startJoystick, updateKnob, handleEnd],
  );

  return (
    <div
      ref={zoneRef}
      className="pointer-events-auto fixed bottom-0 left-0 right-0 z-40"
      style={{ height: "25%", touchAction: "none" }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      {/* Default resting joystick — shown when idle */}
      {!active && (
        <div
          style={{
            position: "absolute",
            left: DEFAULT_LEFT,
            bottom: DEFAULT_BOTTOM,
            pointerEvents: "none",
          }}
        >
          <JoystickRing knobOffset={{ x: 0, y: 0 }} dimmed />
        </div>
      )}

      {/* Active joystick — appears centered on tap location */}
      {active && (
        <div
          style={{
            position: "absolute",
            left: joystickPos.x,
            top: joystickPos.y,
            pointerEvents: "none",
          }}
        >
          <JoystickRing knobOffset={knobOffset} />
        </div>
      )}
    </div>
  );
}
