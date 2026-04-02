"use client";

import { STARTING_CAST } from "@/characters/roster";
import { UNLOCKABLE_STRUCTURES, NPC_ZONE_UNLOCKS } from "@/game/constants";

const SPECIES_EMOJI: Record<string, string> = {
  rabbit: "\u{1F430}",
  cat: "\u{1F431}",
  penguin: "\u{1F427}",
  bear: "\u{1F43B}",
  frog: "\u{1F438}",
  deer: "\u{1F98C}",
  duck: "\u{1F986}",
  fox: "\u{1F98A}",
  owl: "\u{1F989}",
  dog: "\u{1F436}",
};

const STRUCTURE_EMOJI: Record<string, string> = {
  dock: "\u{1F6A2}",
  cave: "\u{1FAA8}",
};

interface ArrivalsPopupProps {
  npcIds: string[];
  structures: string[];
  onDismiss: () => void;
}

export default function ArrivalsPopup({ npcIds, structures, onDismiss }: ArrivalsPopupProps) {
  const npcs = npcIds.map(id => STARTING_CAST.find(c => c.id === id)).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-emerald-300 to-teal-400" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center" style={{ maxWidth: 380 }}>
        {/* Title */}
        <div className="text-5xl">{"\u{1F3DD}\u{FE0F}"}</div>
        <h2 className="text-2xl font-extrabold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
          New on the Island!
        </h2>

        {/* NPC arrivals */}
        {npcs.length > 0 && (
          <div className="flex flex-col gap-3 w-full">
            {npcs.map(npc => {
              if (!npc) return null;
              const emoji = SPECIES_EMOJI[npc.species] ?? "\u{1F43E}";
              const zone = NPC_ZONE_UNLOCKS[npc.id];
              return (
                <div
                  key={npc.id}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3"
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {/* Avatar circle */}
                  <div
                    className="flex items-center justify-center rounded-full text-2xl"
                    style={{
                      width: 48,
                      height: 48,
                      backgroundColor: npc.colorPalette.primary + "40",
                      border: `3px solid ${npc.colorPalette.primary}`,
                      flexShrink: 0,
                    }}
                  >
                    {emoji}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-base font-bold text-gray-800">{npc.name}</span>
                    <span className="text-xs text-gray-500">
                      {zone ? `Bringing a new area!` : `Joined the island!`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Structure unlocks */}
        {structures.length > 0 && (
          <div className="flex flex-col gap-3 w-full">
            {structures.map(key => {
              const struct = UNLOCKABLE_STRUCTURES[key];
              if (!struct) return null;
              const emoji = STRUCTURE_EMOJI[key] ?? "\u{1F3D7}\u{FE0F}";
              return (
                <div
                  key={key}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3"
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-full text-2xl"
                    style={{
                      width: 48,
                      height: 48,
                      backgroundColor: "#FFD70040",
                      border: "3px solid #FFD700",
                      flexShrink: 0,
                    }}
                  >
                    {emoji}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-base font-bold text-gray-800">{struct.label}</span>
                    <span className="text-xs text-gray-500">Now open to explore!</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          className="mt-3 min-h-[48px] w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-10 py-3 text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95"
        >
          Let&apos;s see! {"\u{1F440}"}
        </button>
      </div>
    </div>
  );
}
