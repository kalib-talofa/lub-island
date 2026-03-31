"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { ItemDef } from "@/characters/CharacterData";

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
  onCancel: () => void;
  speakerColor?: string;
  /** Items available for gifting (empty = no gift button) */
  giftableItems?: ItemDef[];
  /** Called when player gifts an item */
  onGift?: (item: ItemDef) => void;
}

// Emoji icon per item id
const ITEM_ICONS: Record<string, string> = {
  flowers: "\u{1F490}",
  chocolate: "\u{1F36B}",
  book: "\u{1F4D6}",
  sunglasses: "\u{1F576}\u{FE0F}",
};

function getItemIcon(item: ItemDef): string {
  return ITEM_ICONS[item.id] ?? "\u{1F4E6}";
}

export default function DialogueBox({
  line,
  onChoice,
  onAdvance,
  onCancel,
  speakerColor = "#f472b6",
  giftableItems = [],
  onGift,
}: DialogueBoxProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [showGiftPicker, setShowGiftPicker] = useState(false);
  const charIndex = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset typewriter when line changes
  useEffect(() => {
    charIndex.current = 0;
    setDisplayedText("");
    setIsComplete(false);
    setShowGiftPicker(false);

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
    if (showGiftPicker) return; // don't advance while gift picker is open
    if (!isComplete) {
      // Skip to full text
      if (timerRef.current) clearInterval(timerRef.current);
      setDisplayedText(line.text);
      setIsComplete(true);
    } else if (!line.choices || line.choices.length === 0) {
      onAdvance();
    }
  }, [isComplete, line.text, line.choices, onAdvance, showGiftPicker]);

  const handleGift = useCallback((item: ItemDef) => {
    setShowGiftPicker(false);
    onGift?.(item);
  }, [onGift]);

  const hasGiftableItems = giftableItems.length > 0 && onGift;

  return (
    <div className="pointer-events-auto fixed inset-x-0 bottom-0 z-50 flex flex-col px-3">
      {/* Gift button — floating above the dialogue box */}
      {hasGiftableItems && isComplete && displayedText === line.text && (
        <div className="mb-2 flex justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowGiftPicker(!showGiftPicker);
            }}
            className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-base font-bold shadow-lg transition active:scale-95 ${
              showGiftPicker
                ? "bg-pink-600 text-white"
                : "bg-black/80 text-white backdrop-blur-sm hover:bg-black/90"
            }`}
          >
            <span className="text-xl">{"\u{1F381}"}</span> Gift
          </button>
        </div>
      )}

      <div
        className="flex min-h-[35vh] flex-col rounded-t-2xl bg-gradient-to-b from-gray-900/95 to-black/95 shadow-2xl backdrop-blur-md"
        onClick={handleTap}
      >
        {/* Speaker header */}
        <div
          className="flex items-center justify-between rounded-t-2xl px-5 py-2.5"
          style={{ backgroundColor: speakerColor + "30" }}
        >
          <span
            className="text-sm font-bold tracking-wide"
            style={{ color: speakerColor }}
          >
            {line.speaker}
          </span>

          {/* Close / leave conversation button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-sm text-white/60 transition hover:bg-white/20 hover:text-white active:scale-95"
            title="Leave conversation"
          >
            {"\u2715"}
          </button>
        </div>

        {/* Gift picker dropdown */}
        {showGiftPicker && (
          <div
            className="border-b border-white/10 bg-black/40 px-5 py-3"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/40">
              Choose an item to gift
            </p>
            <div className="flex flex-wrap gap-2">
              {giftableItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleGift(item)}
                  className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs text-white transition hover:bg-white/15 active:scale-95"
                >
                  <span className="text-sm">{getItemIcon(item)}</span>
                  <span>{item.name}</span>
                  <span className="text-white/30">(+{item.giftValue})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Text body */}
        <div className="flex-1 px-5 py-3">
          <p className="text-base leading-relaxed text-white/90">
            {displayedText}
            {!isComplete && (
              <span className="animate-pulse text-white/50">{"\u2588"}</span>
            )}
          </p>
        </div>

        {/* Choices — only show after typewriter finishes for THIS line */}
        {isComplete && displayedText === line.text && !showGiftPicker && line.choices && line.choices.length > 0 && (
          <div className="flex flex-col gap-2 px-5 pb-4">
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
        {isComplete && displayedText === line.text && !showGiftPicker && (!line.choices || line.choices.length === 0) && (
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
