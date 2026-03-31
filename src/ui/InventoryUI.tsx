"use client";

import { usePlayerStore } from "@/store/playerStore";
import type { ItemDef } from "@/characters/CharacterData";

// Emoji icon per item id
const ITEM_ICONS: Record<string, string> = {
  flowers: "\u{1F490}",
  chocolate: "\u{1F36B}",
  book: "\u{1F4D6}",
  sunglasses: "\u{1F576}\u{FE0F}",
  producer_phone: "\u{1F4F1}",
};

function getItemIcon(item: ItemDef): string {
  if (item.id.startsWith("journal_")) return "\u{1F4D3}";
  return ITEM_ICONS[item.id] ?? "\u{1F4E6}";
}

/** Action label for the primary use button */
function getUseLabel(item: ItemDef): string | null {
  switch (item.id) {
    case "flowers":
      return null; // gift-only, handled in dialogue
    case "chocolate":
      return "Eat (+25 energy)";
    case "book":
      return "Read (+15 perf)";
    case "sunglasses":
      return "Wear (+10 perf)";
    case "producer_phone":
      return "Call Producer";
    default:
      if (item.id.startsWith("journal_")) return "Read Journal";
      return null;
  }
}

interface InventoryUIProps {
  onClose: () => void;
  onUseItem: (item: ItemDef) => void;
}

export default function InventoryUI({ onClose, onUseItem }: InventoryUIProps) {
  const { inventory } = usePlayerStore();

  // Deduplicate for display — show count per unique item
  const itemCounts = new Map<string, { item: ItemDef; count: number }>();
  for (const item of inventory) {
    const existing = itemCounts.get(item.id);
    if (existing) {
      existing.count++;
    } else {
      itemCounts.set(item.id, { item, count: 1 });
    }
  }
  const entries = Array.from(itemCounts.values());

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="mx-3 flex w-full max-w-sm flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-gray-900/98 to-gray-950/98 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-2xl border-b border-white/10 px-4 py-3">
          <h2 className="text-base font-bold text-white">
            {"\u{1F392}"} Inventory
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 transition hover:bg-white/20"
          >
            {"\u2715"}
          </button>
        </div>

        {/* Item grid */}
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {entries.length === 0 ? (
            <div className="py-12 text-center text-sm text-white/30">
              Your bag is empty. Explore the island to find items!
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {entries.map(({ item, count }) => {
                const useLabel = getUseLabel(item);
                return (
                  <div
                    key={item.id}
                    className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                  >
                    {/* Icon */}
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 text-2xl">
                      {getItemIcon(item)}
                    </div>

                    {/* Info */}
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          {item.name}
                        </span>
                        {count > 1 && (
                          <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] font-bold text-white/70">
                            x{count}
                          </span>
                        )}
                      </div>
                      <p className="text-xs leading-snug text-white/50">
                        {item.description}
                      </p>

                      {/* Action buttons */}
                      <div className="mt-1 flex gap-2">
                        {useLabel && (
                          <button
                            onClick={() => onUseItem(item)}
                            className="rounded-lg bg-indigo-600/80 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-500 active:scale-95"
                          >
                            {useLabel}
                          </button>
                        )}
                        {item.giftValue > 0 && (
                          <span className="flex items-center rounded-lg border border-white/10 px-2 py-1 text-[10px] text-white/30">
                            {"\u{1F381}"} Gift during dialogue
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-4 py-3">
          <p className="text-center text-[10px] text-white/25">
            {inventory.length} item{inventory.length !== 1 ? "s" : ""} in bag
          </p>
        </div>
      </div>
    </div>
  );
}
