import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ItemDef } from '@/characters/CharacterData';

interface PlayerStore {
  inventory: ItemDef[];
  totalChallengesWon: number;
  totalDatesCompleted: number;
  playerSpecies: string;
  playerName: string;
  playerBio: string;

  /** Performance buff from book — additive, resets each morning */
  performanceBoostToday: number;
  /** Charm buff from sunglasses — additive, resets each morning */
  charmBoostToday: number;
  /** NPC IDs whose journals have been read — unlocks special dialogue */
  unlockedJournals: string[];

  addItem: (item: ItemDef) => void;
  removeItem: (itemId: string) => void;
  /** Remove and return the first item matching the id */
  useItem: (itemId: string) => ItemDef | null;
  /** Check if player has at least one item with the given id */
  hasItem: (itemId: string) => boolean;
  /** Get all items that can be gifted (giftValue > 0) */
  getGiftableItems: () => ItemDef[];
  /** Add a performance boost for the day */
  addPerformanceBoost: (amount: number) => void;
  /** Add a charm boost for the day */
  addCharmBoost: (amount: number) => void;
  /** Mark an NPC journal as read/unlocked */
  unlockJournal: (npcId: string) => void;
  /** Check if an NPC journal has been unlocked */
  isJournalUnlocked: (npcId: string) => boolean;
  /** Clear daily buffs and remove journal items (called on new day) */
  clearDayBuffs: () => void;

  setPlayerName: (name: string) => void;
  setPlayerSpecies: (species: string) => void;
  setPlayerBio: (bio: string) => void;
  incrementChallengesWon: () => void;
  incrementDatesCompleted: () => void;
  resetPlayer: () => void;
}

export const usePlayerStore = create<PlayerStore>()(persist((set, get) => ({
  inventory: [],
  totalChallengesWon: 0,
  totalDatesCompleted: 0,
  playerSpecies: 'dog',
  playerName: 'Player',
  playerBio: '',
  performanceBoostToday: 0,
  charmBoostToday: 0,
  unlockedJournals: [],

  addItem: (item) => set((s) => ({ inventory: [...s.inventory, item] })),

  removeItem: (itemId) => {
    const { inventory } = get();
    const idx = inventory.findIndex(i => i.id === itemId);
    if (idx === -1) return;
    const next = [...inventory];
    next.splice(idx, 1);
    set({ inventory: next });
  },

  useItem: (itemId) => {
    const { inventory } = get();
    const idx = inventory.findIndex(i => i.id === itemId);
    if (idx === -1) return null;
    const item = inventory[idx];
    const next = [...inventory];
    next.splice(idx, 1);
    set({ inventory: next });
    return item;
  },

  hasItem: (itemId) => get().inventory.some(i => i.id === itemId),

  getGiftableItems: () => {
    const seen = new Set<string>();
    return get().inventory.filter(i => {
      if (i.giftValue <= 0 || seen.has(i.id)) return false;
      seen.add(i.id);
      return true;
    });
  },

  addPerformanceBoost: (amount) =>
    set((s) => ({ performanceBoostToday: s.performanceBoostToday + amount })),

  addCharmBoost: (amount) =>
    set((s) => ({ charmBoostToday: s.charmBoostToday + amount })),

  unlockJournal: (npcId) =>
    set((s) => ({
      unlockedJournals: s.unlockedJournals.includes(npcId)
        ? s.unlockedJournals
        : [...s.unlockedJournals, npcId],
    })),

  isJournalUnlocked: (npcId) => get().unlockedJournals.includes(npcId),

  clearDayBuffs: () =>
    set((s) => ({
      performanceBoostToday: 0,
      charmBoostToday: 0,
      // Remove journal items from inventory (they expire daily)
      inventory: s.inventory.filter(i => !i.id.startsWith('journal_')),
    })),

  setPlayerName: (name) => set({ playerName: name }),
  setPlayerSpecies: (species) => set({ playerSpecies: species }),
  setPlayerBio: (bio) => set({ playerBio: bio }),
  incrementChallengesWon: () => set((s) => ({ totalChallengesWon: s.totalChallengesWon + 1 })),
  incrementDatesCompleted: () => set((s) => ({ totalDatesCompleted: s.totalDatesCompleted + 1 })),
  resetPlayer: () => set({
    inventory: [],
    totalChallengesWon: 0,
    totalDatesCompleted: 0,
    playerBio: '',
    performanceBoostToday: 0,
    charmBoostToday: 0,
    unlockedJournals: [],
  }),
}), {
  name: 'lub-player',
  partialize: (s) => ({
    inventory: s.inventory, totalChallengesWon: s.totalChallengesWon,
    totalDatesCompleted: s.totalDatesCompleted, playerSpecies: s.playerSpecies,
    playerName: s.playerName, playerBio: s.playerBio,
    performanceBoostToday: s.performanceBoostToday, charmBoostToday: s.charmBoostToday,
    unlockedJournals: s.unlockedJournals,
  }),
}));
