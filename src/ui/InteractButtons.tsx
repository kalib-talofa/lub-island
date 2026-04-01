"use client";

import { useState, useEffect } from "react";
import { nearbyNPCsRef } from "@/scene/NPCController";

interface InteractButtonsProps {
  onInteract: (npcId: string) => void;
}

export default function InteractButtons({ onInteract }: InteractButtonsProps) {
  const [nearbyNPCs, setNearbyNPCs] = useState<
    Array<{ id: string; name: string }>
  >([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const current = nearbyNPCsRef.current;
      setNearbyNPCs((prev) => {
        // Only update state when the list actually changed
        if (
          prev.length !== current.length ||
          prev.some((p, i) => p.id !== current[i]?.id)
        ) {
          return [...current];
        }
        return prev;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  if (nearbyNPCs.length === 0) return null;

  return (
    <div
      className="pointer-events-auto fixed z-[41] flex flex-col gap-2"
      style={{ bottom: "27%", left: "5%" }}
    >
      {nearbyNPCs.map((npc) => (
        <button
          key={npc.id}
          onClick={() => onInteract(npc.id)}
          className="flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2.5 text-sm font-bold text-gray-800 shadow-lg backdrop-blur-sm transition-all active:scale-95"
          style={{
            border: "2px solid rgba(255, 200, 50, 0.8)",
            minHeight: "44px",
          }}
        >
          <span className="text-lg">{"\u{1F4AC}"}</span>
          Talk to {npc.name}
        </button>
      ))}
    </div>
  );
}
