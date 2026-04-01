"use client";

import { useState } from "react";
import { Character } from "@/characters/CharacterData";
import { STARTING_CAST } from "@/characters/roster";

interface CeremonyUIProps {
  cast: Character[];
  relationships: Record<string, number>;
  onChoosePartner: (npcId: string) => void;
  phase: "choosing" | "results" | "departure" | "demo_end";
  results?: { npcId: string; partnerId: string | null }[];
  eliminated?: string[];
  onContinue: () => void;
}

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

function getRelationshipLabel(value: number): string {
  if (value >= 50) return "Smitten";
  if (value >= 25) return "Interested";
  if (value >= 0) return "Neutral";
  if (value >= -25) return "Distant";
  return "Cold";
}

export default function CeremonyUI({
  cast,
  relationships,
  onChoosePartner,
  phase,
  results,
  eliminated,
  onContinue,
}: CeremonyUIProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  // ---- CHOOSING PHASE ----
  if (phase === "choosing") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-amber-950">
        {/* Header */}
        <div className="flex flex-col items-center gap-1 pt-8">
          <span className="text-4xl">{"\u{1F525}"}</span>
          <h1 className="text-2xl font-extrabold tracking-wider text-amber-400">
            The Ceremony
          </h1>
          <p className="text-sm text-amber-200/60">
            Choose your partner for the next week
          </p>
        </div>

        {/* Character grid */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="grid grid-cols-2 gap-3">
            {cast
              .filter((c) => !c.isEliminated && c.id !== "player")
              .map((character) => {
                const isSelected = selectedId === character.id;
                const rel = relationships[character.id] ?? 0;
                return (
                  <button
                    key={character.id}
                    onClick={() => setSelectedId(character.id)}
                    disabled={confirmed}
                    className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${
                      isSelected
                        ? "border-amber-400 bg-amber-400/15 shadow-lg shadow-amber-500/20"
                        : "border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10"
                    } ${confirmed && !isSelected ? "opacity-40" : ""}`}
                  >
                    {/* Species icon in colored circle */}
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-full text-3xl shadow-md"
                      style={{
                        backgroundColor: character.colorPalette.primary + "30",
                        borderWidth: 2,
                        borderColor: character.colorPalette.primary,
                      }}
                    >
                      {SPECIES_EMOJI[character.species] ?? "\u{1F43E}"}
                    </div>

                    {/* Name */}
                    <span className="text-sm font-bold text-white">
                      {character.name}
                    </span>

                    {/* Relationship */}
                    <span
                      className={`text-xs ${
                        rel >= 25
                          ? "text-pink-400"
                          : rel >= 0
                            ? "text-white/50"
                            : "text-blue-400"
                      }`}
                    >
                      {getRelationshipLabel(rel)} ({rel > 0 ? "+" : ""}
                      {rel})
                    </span>

                    {/* Selected indicator */}
                    {isSelected && (
                      <div className="mt-1 rounded-full bg-amber-400 px-3 py-0.5 text-[10px] font-bold text-black">
                        SELECTED
                      </div>
                    )}
                  </button>
                );
              })}
          </div>
        </div>

        {/* Confirm button */}
        <div className="px-4 pb-6">
          {!confirmed ? (
            <button
              onClick={() => {
                if (selectedId) {
                  setConfirmed(true);
                  onChoosePartner(selectedId);
                }
              }}
              disabled={!selectedId}
              className={`min-h-[52px] w-full rounded-2xl py-3.5 text-lg font-bold shadow-lg transition-all ${
                selectedId
                  ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:scale-[1.02] active:scale-95"
                  : "cursor-not-allowed bg-gray-800 text-gray-600"
              }`}
            >
              {selectedId ? "Confirm Partner" : "Choose a Partner"}
            </button>
          ) : (
            <div className="py-3.5 text-center text-sm text-amber-300/60">
              Waiting for results...
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---- DEPARTURE PHASE ----
  if (phase === "departure") {
    const eliminatedNPCs = (eliminated ?? [])
      .map((id) => STARTING_CAST.find((c) => c.id === id))
      .filter(Boolean) as Character[];

    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-indigo-950">
        {/* Departure header */}
        <div className="flex flex-col items-center gap-2 pt-12">
          <span className="text-5xl">{"\u{1F6A2}"}</span>
          <h1 className="text-2xl font-extrabold tracking-wider text-red-400">
            Farewell
          </h1>
          <p className="px-8 text-center text-sm text-white/50">
            The island says goodbye...
          </p>
        </div>

        {/* Departing islanders */}
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
          {eliminatedNPCs.map((npc) => (
            <div key={npc.id} className="flex flex-col items-center gap-3">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full text-4xl shadow-lg"
                style={{
                  backgroundColor: npc.colorPalette.primary + "20",
                  borderWidth: 3,
                  borderColor: npc.colorPalette.primary + "60",
                }}
              >
                {SPECIES_EMOJI[npc.species] ?? "\u{1F43E}"}
              </div>
              <span className="text-lg font-bold text-white">{npc.name}</span>
              <p className="max-w-[240px] text-center text-sm italic text-white/40">
                &ldquo;{npc.catchphrase}&rdquo;
              </p>
              <span className="text-xs font-medium uppercase tracking-widest text-red-400/60">
                Has left the island
              </span>
            </div>
          ))}

          {/* Divider */}
          <div className="my-2 h-px w-48 bg-white/10" />

          {/* New arrival teaser */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400/70">
              But wait...
            </p>
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-amber-400/40 bg-black text-4xl shadow-lg shadow-amber-500/10">
              <span style={{ filter: "brightness(0)" }}>{"\u{1F43E}"}</span>
            </div>
            <p className="text-sm font-semibold text-amber-300">
              A new islander is arriving soon...
            </p>
            <p className="text-xs text-white/30">
              Who could it be?
            </p>
          </div>
        </div>

        {/* Continue button */}
        <div className="px-4 pb-6">
          <button
            onClick={onContinue}
            className="min-h-[52px] w-full rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 py-3.5 text-lg font-bold text-black shadow-lg transition-all hover:scale-[1.02] active:scale-95"
          >
            Continue to Next Week
          </button>
        </div>
      </div>
    );
  }

  // ---- DEMO END PHASE ----
  if (phase === "demo_end") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-amber-950 via-gray-900 to-gray-950">
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8">
          <span className="text-6xl">{"\u{1F334}"}</span>
          <h1 className="text-3xl font-extrabold tracking-wider text-amber-400">
            Thanks for Playing!
          </h1>
          <p className="max-w-[300px] text-center text-base leading-relaxed text-white/60">
            That&apos;s the end of the demo. More weeks, new islanders, and
            bigger drama are coming soon!
          </p>
          <div className="my-2 h-px w-48 bg-white/10" />
          <p className="text-sm text-white/40">
            Lub Island — Early Prototype
          </p>
        </div>

        <div className="px-4 pb-6">
          <button
            onClick={onContinue}
            className="min-h-[52px] w-full rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 py-3.5 text-lg font-bold text-black shadow-lg transition-all hover:scale-[1.02] active:scale-95"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  // ---- RESULTS PHASE ----
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-amber-950">
      {/* Header */}
      <div className="flex flex-col items-center gap-1 pt-8">
        <span className="text-4xl">{"\u{1F4AB}"}</span>
        <h1 className="text-2xl font-extrabold tracking-wider text-amber-400">
          Results
        </h1>
      </div>

      {/* Pairings */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-3">
          {results?.map((pairing) => {
            const npc = cast.find((c) => c.id === pairing.npcId);
            const partner = pairing.partnerId
              ? cast.find((c) => c.id === pairing.partnerId)
              : null;
            if (!npc) return null;

            return (
              <div
                key={pairing.npcId}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
              >
                {/* NPC */}
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
                    style={{
                      backgroundColor: npc.colorPalette.primary + "30",
                      borderWidth: 2,
                      borderColor: npc.colorPalette.primary,
                    }}
                  >
                    {SPECIES_EMOJI[npc.species] ?? "\u{1F43E}"}
                  </div>
                  <span className="text-xs font-semibold text-white">
                    {npc.name}
                  </span>
                </div>

                {/* Heart connector */}
                <div className="flex-1 text-center text-lg text-pink-400">
                  {partner ? "\u2764\u{FE0F}" : "\u{1F494}"}
                </div>

                {/* Partner */}
                {partner ? (
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
                      style={{
                        backgroundColor: partner.colorPalette.primary + "30",
                        borderWidth: 2,
                        borderColor: partner.colorPalette.primary,
                      }}
                    >
                      {SPECIES_EMOJI[partner.species] ?? "\u{1F43E}"}
                    </div>
                    <span className="text-xs font-semibold text-white">
                      {partner.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-white/20 text-xl text-white/30">
                      ?
                    </div>
                    <span className="text-xs text-white/40">No partner</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Eliminated */}
        {eliminated && eliminated.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 text-center text-sm font-bold uppercase tracking-widest text-red-400/80">
              Farewell
            </h3>
            <div className="space-y-2">
              {eliminated.map((id) => {
                const npc = STARTING_CAST.find((c) => c.id === id);
                if (!npc) return null;
                return (
                  <div
                    key={id}
                    className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-xl opacity-50 grayscale">
                      {SPECIES_EMOJI[npc.species] ?? "\u{1F43E}"}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white/50">
                        {npc.name}
                      </span>
                      <span className="text-xs italic text-white/30">
                        Eliminated from the island
                      </span>
                    </div>
                    <span className="ml-auto text-lg">{"\u{1F44B}"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Continue button */}
      <div className="px-4 pb-6">
        <button
          onClick={onContinue}
          className="min-h-[52px] w-full rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 py-3.5 text-lg font-bold text-black shadow-lg transition-all hover:scale-[1.02] active:scale-95"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
