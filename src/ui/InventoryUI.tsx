"use client";

import { usePlayerStore } from "@/store/playerStore";
import { useRelationshipStore } from "@/store/relationshipStore";
import { STARTING_CAST } from "@/characters/roster";
import { getRelationshipTier } from "@/systems/relationships";
import type { ItemDef } from "@/characters/CharacterData";

// ── Item helpers ─────────────────────────────────────────────────────────────

const ITEM_ICONS: Record<string, string> = {
  flowers:       "\u{1F490}",
  chocolate:     "\u{1F36B}",
  book:          "\u{1F4D6}",
  sunglasses:    "\u{1F576}\u{FE0F}",
  producer_phone:"\u{1F4F1}",
};

const NPC_EMOJI: Record<string, string> = {
  rosie:    "\u{1F430}",
  blaze:    "\u{1F98A}",
  pudge:    "\u{1F43B}",
  kiki:     "\u{1F431}",
  sprocket: "\u{1F427}",
  lily:     "\u{1F438}",
};

function getItemIcon(item: ItemDef): string {
  if (item.id.startsWith("journal_")) return "\u{1F4D3}";
  return ITEM_ICONS[item.id] ?? "\u{1F4E6}";
}

function getUseLabel(item: ItemDef): string | null {
  switch (item.id) {
    case "flowers":       return null;
    case "chocolate":     return "Eat (+25 energy)";
    case "book":          return "Read (+15 perf)";
    case "sunglasses":    return "Wear (+10 charm)";
    case "producer_phone":return "Call Producer";
    default:
      if (item.id.startsWith("journal_")) return "Read Journal";
      return null;
  }
}

// ── Tier styling ─────────────────────────────────────────────────────────────

type RelTier = ReturnType<typeof getRelationshipTier>;

const TIER_META: Record<RelTier, { label: string; color: string; barColor: string }> = {
  hostile:  { label: "Hostile",  color: "#f87171", barColor: "#ef4444" },
  cold:     { label: "Cold",     color: "#fb923c", barColor: "#f97316" },
  neutral:  { label: "Neutral",  color: "rgba(255,255,255,0.35)", barColor: "rgba(255,255,255,0.25)" },
  warm:     { label: "Warm",     color: "#fbbf24", barColor: "#f59e0b" },
  close:    { label: "Close",    color: "#34d399", barColor: "#10b981" },
  romantic: { label: "Romantic", color: "#f472b6", barColor: "#ec4899" },
};

// ── Component ─────────────────────────────────────────────────────────────────

interface InventoryUIProps {
  onClose: () => void;
  onUseItem: (item: ItemDef) => void;
}

export default function InventoryUI({ onClose, onUseItem }: InventoryUIProps) {
  const { inventory } = usePlayerStore();
  const { relationships, eliminated } = useRelationshipStore();

  // Deduplicate items
  const itemCounts = new Map<string, { item: ItemDef; count: number }>();
  for (const item of inventory) {
    const existing = itemCounts.get(item.id);
    if (existing) existing.count++;
    else itemCounts.set(item.id, { item, count: 1 });
  }
  const entries = Array.from(itemCounts.values());
  const activeCast = STARTING_CAST.filter(c => !eliminated.includes(c.id));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="mx-3 flex w-full max-w-sm flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-gray-900/98 to-gray-950/98 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between rounded-t-2xl border-b border-white/10 px-4 py-3">
          <h2 className="text-base font-bold text-white">{"\u{1F392}"} Backpack</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 transition hover:bg-white/20"
          >
            {"\u2715"}
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto">

          {/* ── VIBES SECTION ── */}
          <div className="px-3 pt-3 pb-1">
            <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
              {"\u{1F496}"} Vibes
            </p>
            <div className="flex flex-col gap-1.5">
              {activeCast.map(npc => {
                const val = relationships[npc.id] ?? 0;
                const tier = getRelationshipTier(val);
                const meta = TIER_META[tier];
                const isPositive = val > 0;
                const isNegative = val < 0;
                const pct = Math.abs(val); // 0–100, each side covers 50% of the bar

                return (
                  <div key={npc.id} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    {/* Avatar */}
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-lg">
                      {NPC_EMOJI[npc.id] ?? "\u{1F464}"}
                    </div>

                    {/* Name + bar */}
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white/90">{npc.name}</span>
                        <span className="text-[10px] font-semibold" style={{ color: meta.color }}>
                          {meta.label}
                        </span>
                      </div>

                      {/* Center-anchored bar */}
                      <div className="relative flex h-1.5 w-full rounded-full bg-white/10">
                        {/* Negative: fills leftward from center */}
                        {isNegative && (
                          <div
                            className="absolute right-1/2 h-full rounded-full"
                            style={{ width: `${pct / 2}%`, backgroundColor: meta.barColor }}
                          />
                        )}
                        {/* Positive: fills rightward from center */}
                        {isPositive && (
                          <div
                            className="absolute left-1/2 h-full rounded-full"
                            style={{ width: `${pct / 2}%`, backgroundColor: meta.barColor }}
                          />
                        )}
                        {/* Center tick */}
                        <div className="absolute left-1/2 h-full w-px -translate-x-px bg-white/30" />
                      </div>
                    </div>

                    {/* Numeric value */}
                    <span
                      className="w-8 flex-shrink-0 text-right text-xs font-bold tabular-nums"
                      style={{ color: val > 0 ? "#34d399" : val < 0 ? "#f87171" : "rgba(255,255,255,0.25)" }}
                    >
                      {val > 0 ? `+${val}` : val}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── ITEMS SECTION ── */}
          <div className="px-3 pt-3 pb-3">
            <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
              {"\u{1F4E6}"} Items
            </p>
            {entries.length === 0 ? (
              <div className="py-6 text-center text-sm text-white/30">
                Your bag is empty. Explore the island to find items!
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {entries.map(({ item, count }) => {
                  const useLabel = getUseLabel(item);
                  return (
                    <div key={item.id} className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 text-2xl">
                        {getItemIcon(item)}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{item.name}</span>
                          {count > 1 && (
                            <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] font-bold text-white/70">
                              x{count}
                            </span>
                          )}
                        </div>
                        <p className="text-xs leading-snug text-white/50">{item.description}</p>
                        <div className="mt-1 flex gap-2">
                          {useLabel && (
                            <button
                              onClick={() => onUseItem(item)}
                              className="rounded-lg bg-indigo-600/80 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 active:scale-95"
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

        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-4 py-2.5">
          <p className="text-center text-[10px] text-white/25">
            {inventory.length} item{inventory.length !== 1 ? "s" : ""} · {activeCast.length} islander{activeCast.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
