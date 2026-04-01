"use client";

interface EventScreenProps {
  eventType: string;
  eventTitle: string;
  eventDescription: string;
  energyCost: number;
  onStart: () => void;
  onClose: () => void;
  canAfford: boolean;
}

const EVENT_ICONS: Record<string, string> = {
  challenge: "\u{1F3C6}",
  date: "\u{1F496}",
  social: "\u{1F389}",
  drama: "\u{1F525}",
  arrival: "\u{1F6F3}\u{FE0F}",
};

const EVENT_COLORS: Record<string, { from: string; to: string; border: string }> = {
  challenge: { from: "from-blue-500", to: "to-indigo-600", border: "border-blue-400" },
  date: { from: "from-pink-500", to: "to-rose-600", border: "border-pink-400" },
  social: { from: "from-emerald-500", to: "to-teal-600", border: "border-emerald-400" },
  drama: { from: "from-orange-500", to: "to-red-600", border: "border-orange-400" },
  arrival: { from: "from-purple-500", to: "to-violet-600", border: "border-purple-400" },
};

export default function EventScreen({
  eventType,
  eventTitle,
  eventDescription,
  energyCost,
  onStart,
  onClose,
  canAfford,
}: EventScreenProps) {
  const icon = EVENT_ICONS[eventType] ?? "\u{1F3AF}";
  const colors = EVENT_COLORS[eventType] ?? EVENT_COLORS.social;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="mx-4 flex w-full max-w-sm flex-col items-center gap-6 rounded-3xl bg-gray-900/90 p-6 shadow-2xl">
        {/* Event type badge */}
        <div
          className={`rounded-full bg-gradient-to-r ${colors.from} ${colors.to} px-4 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-md`}
        >
          {eventType}
        </div>

        {/* Icon */}
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-5xl shadow-inner">
          {icon}
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-bold text-white">
          {eventTitle}
        </h2>

        {/* Description */}
        <p className="text-center text-sm leading-relaxed text-white/60">
          {eventDescription}
        </p>

        {/* Challenge partner notice */}
        {eventType === "challenge" && (
          <div className="flex w-full items-center gap-3 rounded-xl border border-indigo-400/30 bg-indigo-500/10 px-4 py-3">
            <span className="text-2xl">{"\u{1F91D}"}</span>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Partner Challenge</span>
              <span className="text-xs text-white/50">You'll be paired with a random islander. Do well to boost your relationship — do badly and lose it.</span>
            </div>
          </div>
        )}

        {/* Energy cost */}
        <div
          className={`flex items-center gap-2 rounded-xl border px-4 py-2 ${
            canAfford
              ? "border-amber-500/40 bg-amber-500/10"
              : "border-red-500/40 bg-red-500/10"
          }`}
        >
          <span className="text-lg">{"\u26A1"}</span>
          <span
            className={`text-sm font-semibold ${
              canAfford ? "text-amber-300" : "text-red-400"
            }`}
          >
            {energyCost} Energy
          </span>
        </div>

        {/* Buttons */}
        <div className="flex w-full flex-col gap-3">
          <button
            onClick={onStart}
            disabled={!canAfford}
            className={`min-h-[48px] w-full rounded-2xl py-3 text-lg font-bold shadow-lg transition-all ${
              canAfford
                ? `bg-gradient-to-r ${colors.from} ${colors.to} text-white hover:scale-[1.02] active:scale-95`
                : "cursor-not-allowed bg-gray-700 text-gray-500"
            }`}
          >
            {canAfford ? "Start Event" : "Not Enough Energy"}
          </button>

          <button
            onClick={onClose}
            className="min-h-[44px] w-full rounded-2xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white/50 transition-all hover:bg-white/10 active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
