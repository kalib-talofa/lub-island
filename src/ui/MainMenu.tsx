"use client";

import { useState } from "react";
import { audioManager } from "@/utils/audio";

interface MainMenuProps {
  onStart: () => void;
}

export default function MainMenu({ onStart }: MainMenuProps) {
  const [pressed, setPressed] = useState(false);
  const [muted, setMuted] = useState(audioManager.isMuted());

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-cyan-400 via-teal-400 to-rose-400">
      {/* Animated wave decoration - bottom */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0">
        <div className="animate-pulse text-center text-4xl leading-loose tracking-widest text-white/20">
          {"\u{1F30A}"} {"\u{1F30A}"} {"\u{1F30A}"} {"\u{1F30A}"} {"\u{1F30A}"}
        </div>
      </div>

      {/* Palm trees */}
      <div className="pointer-events-none absolute left-4 top-16 text-5xl opacity-30 animate-bounce" style={{ animationDuration: "3s" }}>
        {"\u{1F334}"}
      </div>
      <div className="pointer-events-none absolute right-4 top-24 text-5xl opacity-30 animate-bounce" style={{ animationDuration: "3.5s" }}>
        {"\u{1F334}"}
      </div>
      <div className="pointer-events-none absolute bottom-20 left-8 text-4xl opacity-20 animate-bounce" style={{ animationDuration: "4s" }}>
        {"\u{1F965}"}
      </div>
      <div className="pointer-events-none absolute bottom-28 right-6 text-3xl opacity-20 animate-bounce" style={{ animationDuration: "2.5s" }}>
        {"\u{1F33A}"}
      </div>

      {/* Audio toggle */}
      <button
        onClick={() => setMuted(audioManager.toggleMute())}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-lg backdrop-blur-sm transition hover:bg-white/30 active:scale-90"
        title={muted ? "Unmute" : "Mute"}
      >
        {muted ? "\u{1F507}" : "\u{1F50A}"}
      </button>

      {/* Sun / glow */}
      <div className="pointer-events-none absolute -top-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-yellow-200/30 blur-3xl" />

      {/* Title area */}
      <div className="flex flex-col items-center gap-2 px-6 text-center">
        {/* Island emoji */}
        <div className="mb-2 text-6xl drop-shadow-lg">{"\u{1F3DD}\u{FE0F}"}</div>

        {/* Title */}
        <h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
          Lub Island
        </h1>

        {/* Subtitle */}
        <p className="text-lg font-medium text-white/80 drop-shadow-sm">
          A Love Island Dating Sim
        </p>

        {/* Hearts decoration */}
        <div className="mt-1 flex gap-1 text-2xl">
          <span className="animate-pulse" style={{ animationDelay: "0s" }}>{"\u{1F497}"}</span>
          <span className="animate-pulse" style={{ animationDelay: "0.3s" }}>{"\u{1F496}"}</span>
          <span className="animate-pulse" style={{ animationDelay: "0.6s" }}>{"\u{1F497}"}</span>
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={onStart}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        className={`mt-12 min-h-[56px] rounded-2xl border-2 border-white/30 bg-white/20 px-12 py-4 text-xl font-bold text-white shadow-xl backdrop-blur-sm transition-all duration-150 ${
          pressed
            ? "scale-95 bg-white/30"
            : "hover:scale-105 hover:bg-white/30 active:scale-95"
        }`}
      >
        Start Game
      </button>

      {/* Footer */}
      <p className="absolute bottom-8 text-xs text-white/40">
        {"\u{1F43E}"} Arctic Bootcamp Prototype {"\u{1F43E}"}
      </p>
    </div>
  );
}
