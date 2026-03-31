"use client";

import { useState, useRef, useCallback } from "react";
import { joystickInputRef } from "@/scene/PlayerController";

const OUTER_SIZE = 120;
const KNOB_SIZE = 48;
const MAX_DISPLACEMENT = 40;
const DEAD_ZONE = 5;

export default function VirtualJoystick() {
  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const centerRef = useRef({ x: 0, y: 0 });
  const activeRef = useRef(false);
  const outerRef = useRef<HTMLDivElement>(null);

  const getCenter = useCallback(() => {
    if (!outerRef.current) return { x: 0, y: 0 };
    const rect = outerRef.current.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }, []);

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

    // Clamp to max displacement
    if (dist > MAX_DISPLACEMENT) {
      dx = (dx / dist) * MAX_DISPLACEMENT;
      dy = (dy / dist) * MAX_DISPLACEMENT;
    }

    setKnobOffset({ x: dx, y: dy });

    // Normalize for direction vector (-1 to 1)
    const normalizedX = dx / MAX_DISPLACEMENT;
    const normalizedY = dy / MAX_DISPLACEMENT;
    joystickInputRef.current = { x: normalizedX, y: normalizedY, active: true };
  }, []);

  const handleEnd = useCallback(() => {
    activeRef.current = false;
    setActive(false);
    setKnobOffset({ x: 0, y: 0 });
    joystickInputRef.current = { x: 0, y: 0, active: false };
  }, []);

  // Mouse events — attach move/up to window so dragging outside the knob works
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      centerRef.current = getCenter();
      activeRef.current = true;
      setActive(true);
      updateKnob(e.clientX, e.clientY);

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
    [getCenter, updateKnob, handleEnd],
  );

  // Touch events
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      centerRef.current = getCenter();
      activeRef.current = true;
      setActive(true);
      const touch = e.touches[0];
      updateKnob(touch.clientX, touch.clientY);
    },
    [getCenter, updateKnob],
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (!activeRef.current) return;
      const touch = e.touches[0];
      updateKnob(touch.clientX, touch.clientY);
    },
    [updateKnob],
  );

  const onTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  return (
    <div
      className="pointer-events-auto fixed bottom-6 left-4 z-40"
      style={{ width: OUTER_SIZE, height: OUTER_SIZE }}
    >
      {/* Outer ring */}
      <div
        ref={outerRef}
        className="relative flex h-full w-full items-center justify-center rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ touchAction: "none" }}
      >
        {/* Inner knob */}
        <div
          className="rounded-full shadow-lg transition-colors duration-150"
          style={{
            width: KNOB_SIZE,
            height: KNOB_SIZE,
            backgroundColor: active
              ? "rgba(255,255,255,0.45)"
              : "rgba(255,255,255,0.25)",
            border: "2px solid rgba(255,255,255,0.4)",
            transform: `translate(${knobOffset.x}px, ${knobOffset.y}px)`,
          }}
        />
      </div>
    </div>
  );
}
