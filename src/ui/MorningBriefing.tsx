"use client";

import { useState, useEffect, useRef } from "react";
import { audioManager } from "@/utils/audio";
import StatBreakdown from "@/ui/StatBreakdown";

interface MorningBriefingProps {
  day: number;
  week: number;
  energy: number;
  charm: number;
  performance: number;
  events: string[];
  onContinue: () => void;
  sleepHours: number;
  sleepQuality: number;
  activeMinutes: number;
  stepCount: number;
}

const NARRATION_TEXT_PREFIX = "Good morning, Islander! Welcome to Day ";

function getEnergyLabel(energy: number): { text: string; color: string } {
  if (energy >= 70) return { text: "HIGH", color: "text-emerald-400" };
  if (energy >= 40) return { text: "MEDIUM", color: "text-amber-400" };
  return { text: "LOW", color: "text-red-400" };
}

export default function MorningBriefing({
  day,
  week,
  energy,
  charm,
  performance,
  events,
  onContinue,
  sleepHours,
  sleepQuality,
  activeMinutes,
  stepCount,
}: MorningBriefingProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const narration = `${NARRATION_TEXT_PREFIX}${day} of Week ${week}! The sun is shining, the ocean is calling, and drama is in the air...`;
  const [displayedText, setDisplayedText] = useState("");
  const [textComplete, setTextComplete] = useState(false);
  const charIndex = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    charIndex.current = 0;
    setDisplayedText("");
    setTextComplete(false);

    timerRef.current = setInterval(() => {
      charIndex.current += 1;
      if (charIndex.current >= narration.length) {
        setDisplayedText(narration);
        setTextComplete(true);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setDisplayedText(narration.slice(0, charIndex.current));
        if (charIndex.current % 2 === 0 && narration[charIndex.current - 1] !== ' ') {
          audioManager.typewriterTick();
        }
      }
    }, 35);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [narration]);

  const skipText = () => {
    if (!textComplete) {
      if (timerRef.current) clearInterval(timerRef.current);
      setDisplayedText(narration);
      setTextComplete(true);
    }
  };

  const energyLabel = getEnergyLabel(energy);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-orange-300 via-amber-200 to-sky-300"
      onClick={skipText}
    >
      {/* Sun decoration */}
      <div className="pointer-events-none absolute -top-8 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-yellow-300/50 blur-2xl" />

      {/* Producer avatar area */}
      <div className="mt-12 flex flex-col items-center gap-1">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/20 text-3xl shadow-lg">
          {"\u{1F4E3}"}
        </div>
        <span className="text-sm font-bold tracking-wider text-amber-900/80">
          THE PRODUCER
        </span>
      </div>

      {/* Narration text */}
      <div className="mx-[5%] mt-6 rounded-2xl bg-white/70 shadow-md backdrop-blur-sm"
        style={{ padding: "16px 5%" }}
      >
        <p className="text-base leading-relaxed text-gray-800">
          {displayedText}
          {!textComplete && (
            <span className="animate-pulse text-gray-400">{"\u2588"}</span>
          )}
        </p>
      </div>

      {/* Stats summary */}
      {textComplete && (
        <div className="mx-[5%] flex flex-col gap-5 animate-in fade-in" style={{ marginTop: "28px" }}>
          {/* Energy callout */}
          <div className="rounded-xl bg-white/60 shadow-sm backdrop-blur-sm"
            style={{ padding: "12px 5%" }}
          >
            <p className="text-sm text-gray-700">
              {"\u26A1"} Your energy is{" "}
              <span className={`font-bold ${energyLabel.color}`}>
                {energyLabel.text}
              </span>{" "}
              today!
            </p>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-sm">{"\u{1F4AC}"}</span>
                <span className="text-xs text-gray-600">Charm</span>
                <span className="text-sm font-bold text-pink-500">
                  {Math.round(charm)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm">{"\u{1F3C3}"}</span>
                <span className="text-xs text-gray-600">Performance</span>
                <span className="text-sm font-bold text-blue-500">
                  {Math.round(performance)}
                </span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBreakdown(true);
              }}
              className="mt-2 text-xs font-semibold text-amber-600/80 underline decoration-amber-400/40 underline-offset-2 transition-colors hover:text-amber-700"
            >
              {"\u{2139}\u{FE0F}"} How are my stats calculated?
            </button>
          </div>

          {/* Events list */}
          <div className="rounded-xl bg-white/60 shadow-sm backdrop-blur-sm"
            style={{ padding: "12px 5%" }}
          >
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
              Today's Events
            </p>
            {events.length > 0 ? (
              <ul className="space-y-1.5">
                {events.map((event, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400/80 text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                    {event}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm italic text-gray-400">
                Free day -- explore the island!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Continue button — pinned at 15% from bottom */}
      {textComplete && (
        <div className="animate-in fade-in" style={{ position: "absolute", bottom: "15%", left: "5%", right: "5%" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onContinue();
            }}
            className="w-full min-h-[48px] rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95"
          >
            Let's go! {"\u{1F31E}"}
          </button>
        </div>
      )}

      {/* Stat Breakdown Popup */}
      {showBreakdown && (
        <StatBreakdown
          sleepHours={sleepHours}
          sleepQuality={sleepQuality}
          activeMinutes={activeMinutes}
          stepCount={stepCount}
          energy={energy}
          charm={charm}
          performance={performance}
          onClose={() => setShowBreakdown(false)}
        />
      )}
    </div>
  );
}
