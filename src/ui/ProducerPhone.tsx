"use client";

interface ProducerPhoneProps {
  onChooseEvent: (eventType: string) => void;
  onClose: () => void;
}

const EVENT_OPTIONS = [
  {
    type: "challenge",
    icon: "\u{1F3C6}",
    label: "Challenge",
    description: "Compete in a mini-game for glory and prizes!",
    color: "from-blue-500 to-indigo-600",
    borderColor: "border-blue-400/40",
  },
  {
    type: "date",
    icon: "\u{1F496}",
    label: "Date",
    description: "Spend quality one-on-one time with someone special.",
    color: "from-pink-500 to-rose-600",
    borderColor: "border-pink-400/40",
  },
  {
    type: "social",
    icon: "\u{1F389}",
    label: "Social",
    description: "A group activity to bond with the whole cast.",
    color: "from-emerald-500 to-teal-600",
    borderColor: "border-emerald-400/40",
  },
  {
    type: "drama",
    icon: "\u{1F525}",
    label: "Drama",
    description: "Stir the pot and shake up the island dynamics!",
    color: "from-orange-500 to-red-600",
    borderColor: "border-orange-400/40",
  },
];

export default function ProducerPhone({
  onChooseEvent,
  onClose,
}: ProducerPhoneProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      {/* Phone frame */}
      <div className="mx-4 flex w-full max-w-xs flex-col rounded-[2rem] border-2 border-gray-600 bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl">
        {/* Phone notch */}
        <div className="flex justify-center pt-3">
          <div className="h-1.5 w-16 rounded-full bg-gray-600" />
        </div>

        {/* Header */}
        <div className="flex flex-col items-center gap-1 px-4 pt-4 pb-2">
          <span className="text-2xl">{"\u{1F4F1}"}</span>
          <h2 className="text-base font-bold text-white">Producer's Phone</h2>
          <p className="text-center text-xs text-white/50">
            Choose tomorrow's headline event
          </p>
        </div>

        {/* Event options */}
        <div className="flex flex-col gap-2.5 px-4 py-3">
          {EVENT_OPTIONS.map((option) => (
            <button
              key={option.type}
              onClick={() => onChooseEvent(option.type)}
              className={`flex items-center gap-3 rounded-xl border bg-white/5 p-3 transition-all hover:bg-white/10 active:scale-[0.98] ${option.borderColor}`}
            >
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${option.color} text-xl shadow-md`}
              >
                {option.icon}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-white">
                  {option.label}
                </span>
                <span className="text-xs text-white/40">
                  {option.description}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Close button */}
        <div className="px-4 pb-6 pt-2">
          <button
            onClick={onClose}
            className="min-h-[44px] w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white/40 transition-all hover:bg-white/10 active:scale-95"
          >
            Put phone away
          </button>
        </div>

        {/* Phone home indicator */}
        <div className="flex justify-center pb-2">
          <div className="h-1 w-24 rounded-full bg-gray-600" />
        </div>
      </div>
    </div>
  );
}
