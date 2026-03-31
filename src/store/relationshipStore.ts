import { create } from 'zustand';
import { RELATIONSHIP } from '@/game/constants';
import { STARTING_CAST } from '@/characters/roster';

interface RelationshipStore {
  relationships: Record<string, number>;  // npcId -> value (-100 to 100)
  partners: Record<string, string | null>;  // npcId -> partnerId
  eliminated: string[];

  getRelationship: (npcId: string) => number;
  changeRelationship: (npcId: string, delta: number) => void;
  setPartner: (npcId: string, partnerId: string | null) => void;
  eliminate: (npcId: string) => void;
  isEliminated: (npcId: string) => boolean;
  resetRelationships: () => void;
}

const initialRelationships: Record<string, number> = {};
const initialPartners: Record<string, string | null> = {};
STARTING_CAST.forEach(c => {
  initialRelationships[c.id] = 0;
  initialPartners[c.id] = null;
});

export const useRelationshipStore = create<RelationshipStore>((set, get) => ({
  relationships: { ...initialRelationships },
  partners: { ...initialPartners },
  eliminated: [],

  getRelationship: (npcId) => get().relationships[npcId] ?? 0,

  changeRelationship: (npcId, delta) => set((s) => ({
    relationships: {
      ...s.relationships,
      [npcId]: Math.max(RELATIONSHIP.MIN, Math.min(RELATIONSHIP.MAX, (s.relationships[npcId] ?? 0) + delta)),
    },
  })),

  setPartner: (npcId, partnerId) => set((s) => ({
    partners: { ...s.partners, [npcId]: partnerId },
  })),

  eliminate: (npcId) => set((s) => ({
    eliminated: [...s.eliminated, npcId],
  })),

  isEliminated: (npcId) => get().eliminated.includes(npcId),

  resetRelationships: () => set({
    relationships: { ...initialRelationships },
    partners: { ...initialPartners },
    eliminated: [],
  }),
}));
