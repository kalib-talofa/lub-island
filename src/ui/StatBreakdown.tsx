"use client";

interface StatBreakdownProps {
  sleepHours: number;
  sleepQuality: number;
  activeMinutes: number;
  stepCount: number;
  energy: number;
  charm: number;
  performance: number;
  onClose: () => void;
}

export default function StatBreakdown({
  sleepHours,
  sleepQuality,
  activeMinutes,
  stepCount,
  energy,
  charm,
  performance,
  onClose,
}: StatBreakdownProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mx-6 w-full max-w-sm rounded-2xl bg-white shadow-2xl"
        style={{ padding: "20px 5%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-center text-lg font-bold text-gray-800">
          {"\u{1F4CA}"} Stat Breakdown
        </h2>

        {/* Yesterday's data */}
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
          Yesterday's Biometrics
        </p>
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between rounded-lg bg-indigo-50 px-3 py-2">
            <span className="text-sm text-gray-600">{"\u{1F634}"} Sleep Hours</span>
            <span className="text-sm font-bold text-indigo-600">{sleepHours.toFixed(1)}h</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-purple-50 px-3 py-2">
            <span className="text-sm text-gray-600">{"\u{1F4A4}"} Sleep Quality</span>
            <span className="text-sm font-bold text-purple-600">{Math.round(sleepQuality)}%</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-pink-50 px-3 py-2">
            <span className="text-sm text-gray-600">{"\u{1F3C3}"} Active Minutes</span>
            <span className="text-sm font-bold text-pink-600">{Math.round(activeMinutes)} min</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2">
            <span className="text-sm text-gray-600">{"\u{1F463}"} Step Count</span>
            <span className="text-sm font-bold text-blue-600">{stepCount.toLocaleString()}</span>
          </div>
        </div>

        {/* How they map to stats */}
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
          How Stats Are Calculated
        </p>
        <div className="space-y-2.5">
          <div className="rounded-lg bg-emerald-50 px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-emerald-700">{"\u26A1"} Energy</span>
              <span className="text-sm font-bold text-emerald-600">{Math.round(energy)}</span>
            </div>
            <p className="mt-0.5 text-[11px] text-emerald-600/70">
              Sleep hours ({sleepHours.toFixed(1)}/8) × Sleep quality ({Math.round(sleepQuality)}%)
            </p>
          </div>
          <div className="rounded-lg bg-pink-50 px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-pink-700">{"\u{1F4AC}"} Charm</span>
              <span className="text-sm font-bold text-pink-600">{Math.round(charm)}</span>
            </div>
            <p className="mt-0.5 text-[11px] text-pink-600/70">
              Active minutes ({Math.round(activeMinutes)}/60)
            </p>
          </div>
          <div className="rounded-lg bg-blue-50 px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-blue-700">{"\u{1F3C3}"} Performance</span>
              <span className="text-sm font-bold text-blue-600">{Math.round(performance)}</span>
            </div>
            <p className="mt-0.5 text-[11px] text-blue-600/70">
              Steps ({stepCount.toLocaleString()}/10,000)
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full min-h-[44px] rounded-xl bg-gray-800 py-2.5 text-sm font-bold text-white shadow transition-all active:scale-95"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
