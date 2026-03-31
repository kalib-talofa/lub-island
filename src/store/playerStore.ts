import { create } from 'zustand';
import { ItemDef } from '@/characters/CharacterData';
import { MAX_INVENTORY } from '@/game/constants';

interface PlayerStore {
  inventory: ItemDef[];
  totalChallengesWon: number;
  totalDatesCompleted: number;
  playerSpecies: string;
  playerName: string;
  playerBio: string;

  addItem: (item: ItemDef) => boolean;
  removeItem: (itemId: string) => void;
  useItem: (itemId: string) => ItemDef | null;
  setPlayerName: (name: string) => void;
  setPlayerSpecies: (species: string) => void;
  setPlayerBio: (bio: string) => void;
  incrementChallengesWon: () => void;
  incrementDatesCompleted: () => void;
  resetPlayer: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  inventory: [],
  totalChallengesWon: 0,
  totalDatesCompleted: 0,
  playerSpecies: 'dog',
  playerName: 'Player',
  playerBio: '',

  addItem: (item) => {
    const { inventory } = get();
    if (inventory.length >= MAX_INVENTORY) return false;
    set({ inventory: [...inventory, item] });
    return true;
  },

  removeItem: (itemId) => set((s) => ({ inventory: s.inventory.filter(i => i.id !== itemId) })),

  useItem: (itemId) => {
    const { inventory } = get();
    const item = inventory.find(i => i.id === itemId);
    if (!item) return null;
    set({ inventory: inventory.filter(i => i.id !== itemId) });
    return item;
  },

  setPlayerName: (name) => set({ playerName: name }),
  setPlayerSpecies: (species) => set({ playerSpecies: species }),
  setPlayerBio: (bio) => set({ playerBio: bio }),
  incrementChallengesWon: () => set((s) => ({ totalChallengesWon: s.totalChallengesWon + 1 })),
  incrementDatesCompleted: () => set((s) => ({ totalDatesCompleted: s.totalDatesCompleted + 1 })),
  resetPlayer: () => set({ inventory: [], totalChallengesWon: 0, totalDatesCompleted: 0, playerBio: '' }),
}));
