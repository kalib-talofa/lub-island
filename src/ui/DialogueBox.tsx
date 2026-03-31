"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface DialogueChoice {
  text: string;
  index: number;
  locked: boolean;
  lockReason?: string;
}

interface DialogueLine {
  text: string;
  speaker: string;
  choices?: DialogueChoice[];
}

interface DialogueBoxProps {
  line: DialogueLine;
  onChoice: (index: number) => void;
  onAdvance: () => void;
  speakerColor?: string;
}

export default function DialogueBox({
  line,
  onChoice,
  onAdvance,
  speakerColor = "#f472b6",
}: DialogueBoxProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const charIndex = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset typewriter when line changes
  useEffect(() => {
    charIndex.current = 0;
    setDisplayedText("");
    setIsComplete(false);

    timerRef.current = setInterval(() => {
      charIndex.current += 1;
      if (charIndex.current >= line.text.length) {
        setDisplayedText(line.text);
        setIsComplete(true);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setDisplayedText(line.text.slice(0, charIndex.current));
      }
    }, 30);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [line.text]);

  const handleTap = useCallback(() => {
    if (!isComplete) {
      // Skip to full text
      if (timerRef.current) clearInterval(timerRef.current);
      setDisplayedText(line.text);
      setIsComplete(true);
    } else if (!line.choices || line.choices.length === 0) {
      onAdvance();
    }
  }, [isComplete, line.text, line.choices, onAdvance]);

  return (
    <div className="pointer-events-auto fixed inset-x-0 bottom-0 z-50 flex flex-col">
      <div
        className="flex min-h-[35vh] flex-col rounded-t-2xl bg-gradient-to-b from-gray-900/95 to-black/95 shadow-2xl backdrop-blur-md"
        onClick={handleTap}
      >
        {/* Speaker header */}
        <div
          className="rounded-t-2xl px-4 py-2"
          style={{ backgroundColor: speakerColor + "30" }}
        >
          <span
            className="text-sm font-bold tracking-wide"
            style={{ color: speakerColor }}
          >
            {line.speaker}
          </span>
        </div>

        {/* Text body */}
        <div className="flex-1 px-4 py-3">
          <p className="text-base leading-relaxed text-white/90">
            {displayedText}
            {!isComplete && (
              <span className="animate-pulse text-white/50">{"\u2588"}</span>
            )}
          </p>
        </div>

        {/* Choices */}
        {isComplete && line.choices && line.choices.length > 0 && (
          <div className="flex flex-col gap-2 px-4 pb-4">
            {line.choices.map((choice) => (
              <button
                key={choice.index}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!choice.locked) onChoice(choice.index);
                }}
                disabled={choice.locked}
                className={`min-h-[44px] rounded-xl px-4 py-3 text-left text-sm font-medium transition-all ${
                  choice.locked
                    ? "cursor-not-allowed border border-white/10 bg-white/5 text-white/30"
                    : "border border-white/20 bg-white/10 text-white hover:border-white/40 hover:bg-white/20 active:scale-[0.98]"
                }`}
              >
                <div className="flex items-center gap-2">
                  {choice.locked && <span className="text-xs">{"\u{1F512}"}</span>}
                  <span>{choice.text}</span>
                </div>
                {choice.locked && choice.lockReason && (
                  <p className="mt-0.5 text-xs italic text-white/20">
                    {choice.lockReason}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Tap to continue hint */}
        {isComplete && (!line.choices || line.choices.length === 0) && (
          <div className="pb-4 text-center">
            <span className="animate-pulse text-xs text-white/40">
              Tap to continue
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
