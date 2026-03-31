export type AnimalSpecies = 'rabbit' | 'cat' | 'penguin' | 'bear' | 'frog' | 'deer' | 'duck' | 'fox' | 'owl' | 'dog';

export interface PersonalityProfile {
  extroversion: number;
  agreeableness: number;
  confidence: number;
  humor: number;
  loyalty: number;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
}

export interface Character {
  id: string;
  name: string;
  species: AnimalSpecies;
  personality: PersonalityProfile;
  colorPalette: ColorPalette;
  catchphrase: string;
  backstory: string;
  romanceInterest: 'romantic' | 'friendship' | 'either' | 'competitive';
  preferredTraits: string[];
  dislikedTraits: string[];
  activityPreference: 'early_bird' | 'night_owl' | 'balanced';
  preferredZone: string;
  relationshipToPlayer: number;
  currentPartner: string | null;
  isEliminated: boolean;
  dayJoined: number;
}

export type GamePhase =
  | 'MAIN_MENU'
  | 'MORNING_BRIEFING'
  | 'DAYTIME_FREE'
  | 'EVENT'
  | 'NIGHTTIME_FREE'
  | 'SLEEP_TRANSITION'
  | 'CEREMONY'
  | 'CEREMONY_RESULT';

export type EventType = 'challenge' | 'date' | 'social' | 'arrival' | 'drama';

export interface GameEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  energyCost: number;
  location: string;
  involvedNPCs: string[];
}

export type ItemEffect = 'gift_relationship' | 'energy_restore' | 'charm_boost' | 'reveal_info' | 'producer_phone' | 'cosmetic' | 'performance_boost';

export interface ItemDef {
  id: string;
  name: string;
  description: string;
  effect: ItemEffect;
  effectValue: number;
  spawnZones: string[];
  rarity: 'common' | 'uncommon' | 'rare';
  /** For character journals — which NPC this journal belongs to */
  ownerNpcId?: string;
  /** Gift value when given to an NPC (0 = cannot gift) */
  giftValue: number;
  /** Whether the item is consumed on use (false = reusable like journals) */
  consumeOnUse: boolean;
}

export interface BiometricData {
  sleepHours: number;
  sleepQuality: number;
  activeMinutes: number;
  stepCount: number;
  energy: number;
  charm: number;
  performance: number;
}
