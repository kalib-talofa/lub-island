"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { COCONUT_CATCH } from "@/game/constants";
import { getCoconutFallSpeed, getCatchRadius, getScoreTier } from "@/systems/challenge";

interface ChallengeUIProps {
  performance: number;
  onComplete: (score: number, tier: string) => void;
}

interface Coconut {
  id: number;
  x: number;
  y: number;
  speed: number;
  caught: boolean;
}

export default function ChallengeUI({ performance, onComplete }: ChallengeUIProps) {
  const [gameState, setGameState] = useState<"playing" | "results">("playing");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(COCONUT_CATCH.DURATION_SECONDS);
  const [basketX, setBasketX] = useState(50); // percentage
  const [coconuts, setCoconuts] = useState<Coconut[]>([]);
  const [flashEffect, setFlashEffect] = useState(false);

  const coconutIdRef = useRef(0);
  const scoreRef = useRef(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const coconutsRef = useRef<Coconut[]>([]);

  const fallSpeed = getCoconutFallSpeed(performance);
  const catchRadius = getCatchRadius(performance);
  const basketWidthPx = catchRadius * 2;

  // Handle pointer movement for basket
  const handlePointerMove = useCallback(
    (clientX: number) => {
      if (!gameAreaRef.current || gameState !== "playing") return;
      const rect = gameAreaRef.current.getBoundingClientRect();
      const relativeX = ((clientX - rect.left) / rect.width) * 100;
      setBasketX(Math.max(5, Math.min(95, relativeX)));
    },
    [gameState],
  );

  // Timer countdown
  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setGameState("results");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    lastTimeRef.current = globalThis.performance?.now() ?? Date.now();
    spawnTimerRef.current = 0;

    const loop = (now: number) => {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      spawnTimerRef.current += delta * 1000;

      // Spawn coconuts
      if (spawnTimerRef.current >= COCONUT_CATCH.SPAWN_INTERVAL_MS) {
        spawnTimerRef.current -= COCONUT_CATCH.SPAWN_INTERVAL_MS;
        const newCoconut: Coconut = {
          id: coconutIdRef.current++,
          x: 10 + Math.random() * 80, // percentage
          y: 0,
          speed: fallSpeed + (Math.random() - 0.5) * 0.5,
          caught: false,
        };
        coconutsRef.current = [...coconutsRef.current, newCoconut];
      }

      // Update coconut positions
      coconutsRef.current = coconutsRef.current
        .map((c) => ({ ...c, y: c.y + c.speed * delta * 60 }))
        .filter((c) => c.y < 105 && !c.caught);

      setCoconuts([...coconutsRef.current]);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [gameState, fallSpeed]);

  // Catch detection
  useEffect(() => {
    if (gameState !== "playing") return;

    const caught: number[] = [];
    coconutsRef.current.forEach((c) => {
      if (c.caught) return;
      // Check if coconut is in basket zone (bottom 12% of screen, within basket X range)
      if (c.y >= 82 && c.y <= 95) {
        const basketLeftPct = basketX - (basketWidthPx / 3.5);
        const basketRightPct = basketX + (basketWidthPx / 3.5);
        if (c.x >= basketLeftPct && c.x <= basketRightPct) {
          caught.push(c.id);
        }
      }
    });

    if (caught.length > 0) {
      coconutsRef.current = coconutsRef.current.map((c) =>
        caught.includes(c.id) ? { ...c, caught: true } : c,
      );
      scoreRef.current += caught.length;
      setScore(scoreRef.current);
      setFlashEffect(true);
      setTimeout(() => setFlashEffect(false), 150);
    }
  }, [coconuts, basketX, basketWidthPx, gameState]);

  const tier = getScoreTier(score);

  const tierInfo = {
    bronze: { label: "Bronze", emoji: "\u{1F949}", color: "text-orange-400" },
    silver: { label: "Silver", emoji: "\u{1F948}", color: "text-gray-300" },
    gold: { label: "Gold", emoji: "\u{1F947}", color: "text-yellow-400" },
  };

  if (gameState === "results") {
    const info = tierInfo[tier];
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-amber-900 to-stone-900">
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-black/50 p-8 shadow-2xl backdrop-blur-sm">
          <div className="text-6xl">{info.emoji}</div>
          <h2 className="text-3xl font-bold text-white">Challenge Complete!</h2>
          <div className="flex items-center gap-2">
            <span className="text-5xl font-extrabold text-white">{score}</span>
            <span className="text-lg text-white/60">coconuts</span>
          </div>
          <div className={`text-xl font-bold ${info.color}`}>
            {info.label} Tier
          </div>
          <div className="mt-2 text-sm text-white/40">
            {score >= COCONUT_CATCH.GOLD_THRESHOLD
              ? "Amazing catch!"
              : score >= COCONUT_CATCH.SILVER_THRESHOLD
                ? "Great job!"
                : "Not bad, keep practicing!"}
          </div>
          <button
            onClick={() => onComplete(score, tier)}
            className="mt-4 min-h-[48px] w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3 text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 select-none overflow-hidden bg-gradient-to-b from-sky-400 via-sky-300 to-amber-200">
      {/* HUD bar */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-black/40 px-4 py-2 backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">{"\u{1F965}"}</span>
          <span className="text-xl font-bold text-white">{score}</span>
        </div>
        <div className="text-center text-sm font-bold uppercase tracking-wider text-white/80">
          Coconut Catch
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{"\u23F1\u{FE0F}"}</span>
          <span
            className={`text-xl font-bold ${
              timeLeft <= 5 ? "animate-pulse text-red-400" : "text-white"
            }`}
          >
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Game area */}
      <div
        ref={gameAreaRef}
        className="absolute inset-0"
        onMouseMove={(e) => handlePointerMove(e.clientX)}
        onTouchMove={(e) => {
          e.preventDefault();
          handlePointerMove(e.touches[0].clientX);
        }}
        style={{ touchAction: "none" }}
      >
        {/* Catch flash effect */}
        {flashEffect && (
          <div className="pointer-events-none absolute inset-0 z-20 bg-yellow-300/20" />
        )}

        {/* Coconuts */}
        {coconuts.map((c) => (
          <div
            key={c.id}
            className="absolute flex h-8 w-8 -translate-x-1/2 items-center justify-center text-2xl"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
            }}
          >
            {"\u{1F965}"}
          </div>
        ))}

        {/* Basket */}
        <div
          className="absolute bottom-[8%] -translate-x-1/2 flex items-center justify-center rounded-xl border-2 border-amber-800 bg-gradient-to-b from-amber-600 to-amber-800 shadow-lg"
          style={{
            left: `${basketX}%`,
            width: `${basketWidthPx}px`,
            height: "36px",
          }}
        >
          <span className="text-lg">{"\u{1F9FA}"}</span>
        </div>

        {/* Palm tree decorations */}
        <div className="pointer-events-none absolute bottom-0 left-2 text-4xl opacity-30">
          {"\u{1F334}"}
        </div>
        <div className="pointer-events-none absolute bottom-0 right-2 text-4xl opacity-30">
          {"\u{1F334}"}
        </div>
      </div>
    </div>
  );
}
