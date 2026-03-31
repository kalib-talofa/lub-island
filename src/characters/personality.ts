import { Character, PersonalityProfile } from './CharacterData';

// Get dialogue style modifiers based on personality
export function getDialogueStyle(personality: PersonalityProfile): {
  usesJokes: boolean;
  isFlirty: boolean;
  isFormal: boolean;
  isNervous: boolean;
  isBold: boolean;
} {
  return {
    usesJokes: personality.humor > 60,
    isFlirty: personality.confidence > 60 && personality.extroversion > 50,
    isFormal: personality.agreeableness > 70 && personality.confidence < 50,
    isNervous: personality.confidence < 40,
    isBold: personality.confidence > 70 && personality.extroversion > 60,
  };
}

// Calculate compatibility between two characters
export function getCompatibility(a: PersonalityProfile, b: PersonalityProfile): number {
  // Opposites attract for some traits, similarity for others
  const extroversionDiff = Math.abs(a.extroversion - b.extroversion);
  const agreeablenessMatch = 100 - Math.abs(a.agreeableness - b.agreeableness);
  const humorMatch = 100 - Math.abs(a.humor - b.humor);
  const loyaltyMatch = 100 - Math.abs(a.loyalty - b.loyalty);

  // Extroversion: moderate difference is best (complementary)
  const extroversionScore = extroversionDiff > 20 && extroversionDiff < 60 ? 80 : 50;

  return Math.round((extroversionScore + agreeablenessMatch + humorMatch + loyaltyMatch) / 4);
}

// Get greeting style based on relationship and personality
export function getGreetingVariant(relationship: number, personality: PersonalityProfile): 'cold' | 'neutral' | 'warm' | 'excited' {
  if (relationship < -20) return 'cold';
  if (relationship < 20) return personality.extroversion > 60 ? 'warm' : 'neutral';
  if (relationship < 60) return 'warm';
  return 'excited';
}
