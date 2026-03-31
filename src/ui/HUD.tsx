"use client";

import { useGameStore } from "@/store/gameStore";
import { useBiometricStore } from "@/store/biometricStore";
import { usePlayerStore } from "@/store/playerStore";
import { EVENTS_PER_DAY, DAYS_PER_WEEK } from "@/game/constants";

interface HUDProps {
  onOpenInventory?: () => void;
}

export default function HUD({ onOpenInventory }: HUDProps) {
  const { day, isNight, eventsCompleted, phase } = useGameStore();
  const { energy, charm, performance } = useBiometricStore();
  const { inventory, performanceBoostToday } = usePlayerStore();

  const visible = phase === "DAYTIME_FREE" || phase === "NIGHTTIME_FREE";
  if (!visible) return null;

  const totalEvents = EVENTS_PER_DAY;
  const itemCount = inventory.length;
  const displayPerf = Math.round(performance + performanceBoostToday);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col gap-1.5 px-6 py-3">
      {/* Row 1: Day / Time + Stats */}
      <div className="pointer-events-auto flex items-center gap-2 rounded-xl bg-black/60 px-6 py-2 backdrop-blur-sm">
        {/* Day & time icon */}
        <div className="flex items-center gap-1.5 text-sm font-bold text-white">
          <span className="text-base">{isNight ? "\u{1F319}" : "\u{2600}\u{FE0F}"}</span>
          <span>
            Day {day}/{DAYS_PER_WEEK}
          </span>
        </div>

        <div className="mx-1 h-5 w-px bg-white/30" />

        {/* Energy */}
        <div className="flex flex-1 items-center gap-1">
          <span className="text-sm" title="Energy">
            {"\u26A1"}
          </span>
          <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-amber-900/50">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-yellow-400 to-amber-400 transition-all duration-300"
              style={{ width: `${Math.min(100, energy)}%` }}
            />
          </div>
          <span className="min-w-[28px] text-right text-xs font-semibold text-amber-300">
            {Math.round(energy)}
          </span>
        </div>

        {/* Charm */}
        <div className="flex items-center gap-1">
          <span className="text-sm" title="Charm">
            {"\u{1F4AC}"}
          </span>
          <span className="text-xs font-semibold text-pink-300">
            {Math.round(charm)}
          </span>
        </div>

        {/* Performance */}
        <div className="flex items-center gap-1">
          <span className="text-sm" title="Performance">
            {"\u{1F3C3}"}
          </span>
          <span className="text-xs font-semibold text-blue-300">
            {displayPerf}
            {performanceBoostToday > 0 && (
              <span className="text-emerald-400"> +{performanceBoostToday}</span>
            )}
          </span>
        </div>
      </div>

      {/* Row 2: Event dots + Bag button */}
      <div className="pointer-events-auto flex items-center gap-2 rounded-xl bg-black/50 px-6 py-1.5 backdrop-blur-sm">
        {/* Event dots */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">
            Events
          </span>
          {Array.from({ length: totalEvents }).map((_, i) => (
            <div
              key={i}
              className={`h-2.5 w-2.5 rounded-full border ${
                i < eventsCompleted
                  ? "border-emerald-400 bg-emerald-400"
                  : "border-white/40 bg-transparent"
              }`}
            />
          ))}
        </div>

        <div className="flex-1" />

        {/* Inventory button */}
        <button
          onClick={onOpenInventory}
          className="relative flex h-12 min-w-[180px] items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 transition hover:bg-white/20 active:scale-95"
        >
          <span className="text-xl">{"\u{1F392}"}</span>
          <span className="text-sm font-semibold text-white/80">Inventory</span>
          {itemCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-xs font-bold text-black">
              {itemCount}
            </span>
          )}
        </button>
      </div>

      {/* Nighttime hint */}
      {isNight && (
        <div className="pointer-events-none flex items-center justify-center gap-1.5 rounded-xl bg-indigo-950/70 px-4 py-1.5 backdrop-blur-sm">
          <span className="text-xs">{"\u2728"}</span>
          <span className="text-[11px] text-indigo-200/80">
            Items have appeared around the island! Explore or go to sleep.
          </span>
        </div>
      )}
    </div>
  );
}
