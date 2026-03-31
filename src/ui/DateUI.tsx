"use client";

import { useState, useCallback } from "react";
import DialogueBox from "./DialogueBox";

interface DateUIProps {
  npcId: string;
  npcName: string;
  onComplete: (chemistry: number) => void;
}

// Placeholder date dialogue lines. In a full implementation these come from
// an Ink script or the dialogue system; for now we have a short sample flow.
const DATE_LINES = [
  {
    speaker: "",
    text: "The two of you find a quiet spot overlooking the ocean as the sun begins to set...",
  },
  {
    speaker: "",
    text: "Hey, I'm really glad we got to do this. I feel like we haven't had a chance to properly talk.",
    choices: [
      { text: "I've been wanting to get to know you better.", index: 0, locked: false },
      { text: "Yeah, it's been hectic in the villa.", index: 1, locked: false },
      { text: "(Stay silent and gaze at the sunset)", index: 2, locked: false },
    ],
  },
  {
    speaker: "",
    text: "You know, there's something different about you. I can't quite put my finger on it...",
  },
  {
    speaker: "",
    text: "What matters most to you -- loyalty, or excitement?",
    choices: [
      { text: "Loyalty, always.", index: 0, locked: false },
      { text: "Life's too short not to chase excitement!", index: 1, locked: false },
      { text: "Can't I have both?", index: 2, locked: false },
    ],
  },
  {
    speaker: "",
    text: "The evening breeze carries the scent of tropical flowers as your date comes to a close...",
  },
];

export default function DateUI({ npcId, npcName, onComplete }: DateUIProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [chemistry, setChemistry] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Fill in the speaker name for lines that don't have one
  const currentLine = DATE_LINES[lineIndex]
    ? {
        ...DATE_LINES[lineIndex],
        speaker: DATE_LINES[lineIndex].speaker || npcName,
      }
    : null;

  const advance = useCallback(() => {
    if (lineIndex >= DATE_LINES.length - 1) {
      setShowResults(true);
    } else {
      setLineIndex((i) => i + 1);
    }
  }, [lineIndex]);

  const handleChoice = useCallback(
    (choiceIndex: number) => {
      // Simple chemistry scoring -- choice 0 is always best for this stub
      if (choiceIndex === 0) setChemistry((c) => c + 2);
      else if (choiceIndex === 2) setChemistry((c) => c + 1);
      advance();
    },
    [advance],
  );

  // Map chemistry score to 1-5 hearts
  const heartCount = Math.max(1, Math.min(5, Math.ceil(((chemistry + 3) / 7) * 5)));

  if (showResults) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-rose-900/90 to-purple-900/90 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-black/50 p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white">Date Complete!</h2>
          <p className="text-sm text-white/60">
            Your date with {npcName}
          </p>

          {/* Chemistry hearts */}
          <div className="flex gap-2 text-3xl">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`transition-all duration-300 ${
                  i < heartCount ? "scale-110" : "scale-90 opacity-30 grayscale"
                }`}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {i < heartCount ? "\u2764\u{FE0F}" : "\u{1F5A4}"}
              </span>
            ))}
          </div>

          <p className="text-lg font-semibold text-pink-300">
            {heartCount >= 4
              ? "Sparks are flying!"
              : heartCount >= 2
                ? "A nice connection."
                : "It was a bit awkward..."}
          </p>

          <button
            onClick={() => onComplete(chemistry)}
            className="mt-4 min-h-[48px] w-full rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-3 text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-rose-800/40 to-purple-900/40 backdrop-blur-[2px]">
      {/* Romantic header */}
      <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600/80 to-rose-600/80 py-3 shadow-md backdrop-blur-sm">
        <span className="text-lg">{"\u{1F496}"}</span>
        <span className="text-base font-bold text-white">
          Date with {npcName}
        </span>
        <span className="text-lg">{"\u{1F496}"}</span>
      </div>

      {/* Spacer pushes dialogue box to bottom */}
      <div className="flex-1" />

      {/* Dialogue */}
      {currentLine && (
        <DialogueBox
          line={currentLine}
          onChoice={handleChoice}
          onAdvance={advance}
          onCancel={() => {}}
          speakerColor="#f472b6"
        />
      )}
    </div>
  );
}
