"use client";

import { useState, useEffect } from "react";

interface SleepTransitionProps {
  day: number;
  onContinue: () => void;
}

type Phase = "night" | "sleeping" | "morning";

export default function SleepTransition({
  day,
  onContinue,
}: SleepTransitionProps) {
  const [phase, setPhase] = useState<Phase>("night");
  const [opacity, setOpacity] = useState(0);

  // Animate through phases
  useEffect(() => {
    // Fade in
    requestAnimationFrame(() => setOpacity(1));

    const t1 = setTimeout(() => setPhase("sleeping"), 2000);
    const t2 = setTimeout(() => setPhase("morning"), 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-700"
      style={{ opacity }}
    >
      {/* Background */}
      <div
        className={`absolute inset-0 transition-colors duration-1000 ${
          phase === "morning"
            ? "bg-gradient-to-b from-amber-300 via-orange-200 to-sky-300"
            : "bg-gradient-to-b from-indigo-950 via-slate-900 to-gray-950"
        }`}
      />

      {/* Stars (night only) */}
      {phase !== "morning" && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 animate-pulse rounded-full bg-white"
              style={{
                left: `${8 + ((i * 47) % 84)}%`,
                top: `${5 + ((i * 31) % 60)}%`,
                animationDelay: `${(i * 200) % 2000}ms`,
                opacity: 0.3 + (i % 5) * 0.15,
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-8 text-center">
        {/* Icon */}
        <div className="text-6xl transition-all duration-700">
          {phase === "morning" ? "\u{2600}\u{FE0F}" : "\u{1F319}"}
        </div>

        {/* Text */}
        {phase === "night" && (
          <div className="flex flex-col gap-2 animate-in fade-in">
            <h2 className="text-2xl font-bold text-white">
              Day {day} complete...
            </h2>
            <p className="text-sm text-white/50">
              Time to rest and recharge
            </p>
          </div>
        )}

        {phase === "sleeping" && (
          <div className="flex flex-col items-center gap-3 animate-in fade-in">
            <h2 className="text-2xl font-bold text-indigo-200">
              Good night...
            </h2>
            <div className="flex gap-2 text-2xl">
              <span className="animate-bounce" style={{ animationDelay: "0ms" }}>
                {"\u{1F4A4}"}
              </span>
              <span className="animate-bounce" style={{ animationDelay: "300ms" }}>
                {"\u{1F4A4}"}
              </span>
              <span className="animate-bounce" style={{ animationDelay: "600ms" }}>
                {"\u{1F4A4}"}
              </span>
            </div>
          </div>
        )}

        {phase === "morning" && (
          <div className="flex flex-col items-center gap-4 animate-in fade-in">
            <h2 className="text-3xl font-extrabold text-amber-800">
              Good morning!
            </h2>
            <p className="text-sm text-amber-700/70">
              A new day awaits on Lub Island
            </p>

            {/* Decorative birds */}
            <div className="flex gap-3 text-xl text-amber-600/40">
              <span>{"\u{1F426}"}</span>
              <span>{"\u{1F426}"}</span>
            </div>

            <button
              onClick={onContinue}
              className="mt-4 min-h-[48px] rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-10 py-3 text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95"
            >
              Rise and shine! {"\u{1F31E}"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
