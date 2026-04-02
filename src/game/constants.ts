// ---------------------------------------------------------------------------
// Tester / demo mode
// ---------------------------------------------------------------------------
// Set to true before sending to testers: hides dev tools, disables energy
// costs so players are never blocked by low energy stats.
export const PROD_ENERGY = false;

// Energy costs
export const ENERGY_COSTS = {
  CHALLENGE_EVENT: 25,
  DATE_EVENT: 20,
  SOCIAL_EVENT: 15,
  TALK_NPC_DAY: 5,
  PICK_UP_ITEM: 3,
  PRODUCER_PHONE: 20,
  TALK_NPC_NIGHT: 0,
  WALK: 0,
} as const;

// Stat floors - no stat below 15
export const STAT_FLOOR = 15;

// Biometric conversion targets
export const BIO_TARGETS = {
  SLEEP_HOURS_MAX: 8,
  ACTIVE_MINUTES_MAX: 60,
  STEPS_MAX: 10000,
} as const;

// Week lengths
/** Week 1 (FTUE): 3 play days + ceremony = 4. Week 2+: 5 play days + ceremony = 6. */
export function getDaysInWeek(week: number): number {
  return week === 1 ? 4 : 6;
}
/** @deprecated – use getDaysInWeek(week) for week-aware logic */
export const DAYS_PER_WEEK = 7;
export const EVENTS_PER_DAY = 3;
export const MAX_INVENTORY = 3;

// Challenge: Coconut Catch
export const COCONUT_CATCH = {
  DURATION_SECONDS: 10,
  BRONZE_THRESHOLD: 5,
  SILVER_THRESHOLD: 10,
  GOLD_THRESHOLD: 15,
  BASE_FALL_SPEED: 3,
  PERFORMANCE_SPEED_MODIFIER: 0.02, // lower speed per performance point
  BASE_CATCH_RADIUS: 40,
  PERFORMANCE_RADIUS_MODIFIER: 0.3, // extra radius per performance point
  SPAWN_INTERVAL_MS: 800,
} as const;

// Relationship
export const RELATIONSHIP = {
  MIN: -100,
  MAX: 100,
  GIFT_FLOWERS: 15,
  GIFT_CHOCOLATE: 10,
  DATE_GREAT: 20,
  DATE_GOOD: 10,
  DATE_BAD: -5,
  CHALLENGE_GOLD: 15,
  CHALLENGE_SILVER: 8,
  CHALLENGE_BRONZE: -10,
  NIGHT_CHAT_BONUS: 3,
} as const;

// Camera
export const CAMERA = {
  ROTATION_Y: Math.PI / 4,    // 45 degrees
  TILT_X: Math.PI / 5.5,      // ~33 degrees
  ZOOM: 60,
  LERP_FACTOR: 0.1,
  NEAR: 0.1,
  FAR: 1000,
} as const;

// Player
export const PLAYER = {
  MOVE_SPEED: 4,
  INTERACTION_RADIUS: 2.5,
  COLLISION_RADIUS: 0.4,
} as const;

// Ceremony
export const CEREMONY = {
  RANDOM_FACTOR_MIN: 0.05,
  RANDOM_FACTOR_MAX: 0.15,
} as const;

// Weekly schedules per week
// Week 1 (FTUE - 4 days): arrival, arrival, mixed, ceremony
export const WEEK1_SCHEDULE = [
  'arrival',    // Day 1: 3 NPCs present, welcome events
  'arrival',    // Day 2: 4th+5th NPC arrive
  'free',       // Day 3: 6th NPC arrives, date + drama
  'ceremony',   // Day 4: FTUE ceremony (no elimination)
] as const;

// Week 2+ (6 days): social, challenge, date, drama, free, ceremony
export const WEEK2_SCHEDULE = [
  'free',       // Day 1: social events only
  'challenge',  // Day 2: guaranteed challenge + randoms
  'date',       // Day 3: guaranteed date + randoms
  'drama',      // Day 4: guaranteed drama + randoms
  'free',       // Day 5: free day (0 events, roam)
  'ceremony',   // Day 6: real ceremony (elimination)
] as const;

/** @deprecated – use getWeekSchedule(week) instead */
export const WEEKLY_SCHEDULE = WEEK2_SCHEDULE;

export type DayType = 'arrival' | 'free' | 'challenge' | 'date' | 'drama' | 'ceremony';

/** Get the schedule array for a given week. */
export function getWeekSchedule(week: number): readonly DayType[] {
  return week === 1 ? WEEK1_SCHEDULE : WEEK2_SCHEDULE;
}

// ---------------------------------------------------------------------------
// FTUE NPC arrival schedule (Week 1)
// ---------------------------------------------------------------------------
export const FTUE_ARRIVALS: Record<number, string[]> = {
  1: ['pudge', 'kiki', 'sprocket'], // Day 1: first 3 NPCs
  2: ['lily', 'rosie'],             // Day 2: 4th + 5th
  3: ['blaze'],                     // Day 3: 6th
};

// ---------------------------------------------------------------------------
// NPC zone unlocks: maps NPC id -> zone key that appears when they arrive
// Base zones (villa, beach) are always present. Other zones unlock when the
// associated NPC arrives during the FTUE.
// ---------------------------------------------------------------------------
export const NPC_ZONE_UNLOCKS: Record<string, string> = {
  rosie: 'garden',
  blaze: 'arena',
  // pudge: villa is always present (base zone)
  kiki: 'lookout',
  // sprocket: beach is always present (base zone)
  lily: 'jungle',
};

// ---------------------------------------------------------------------------
// Unlockable structures: week + day when each structure becomes available.
// Before unlock, a barrier blocks entry and a popup explains when it opens.
// ---------------------------------------------------------------------------
export const UNLOCKABLE_STRUCTURES: Record<string, { week: number; day: number; label: string }> = {
  dock: { week: 1, day: 3, label: 'Wooden Dock' },
  cave: { week: 2, day: 3, label: 'Mysterious Cave' },
};

// Cave zone position (for colliders and door triggers)
export const CAVE_POSITION: [number, number, number] = [-17.5, 0, -2.1];

// ---------------------------------------------------------------------------
// Rainy days: list of { week, day } pairs that have rain.
// ---------------------------------------------------------------------------
export const RAINY_DAYS: readonly { week: number; day: number }[] = [
  { week: 1, day: 2 },
  { week: 2, day: 2 },
];

export function isRainyDay(week: number, day: number): boolean {
  return RAINY_DAYS.some(r => r.week === week && r.day === day);
}

// ---------------------------------------------------------------------------
// Land plots: each NPC arrival adds a new land mass around the base island.
// center = world position of the plot, semiX/semiZ = ellipse half-axes.
// The zone key must match the value in NPC_ZONE_UNLOCKS.
// ---------------------------------------------------------------------------
export const LAND_PLOTS: Record<string, { center: [number, number, number]; semiX: number; semiZ: number }> = {
  garden:  { center: [28, 0, 0],    semiX: 12, semiZ: 10 },
  arena:   { center: [-28, 0, 0],   semiX: 12, semiZ: 10 },
  jungle:  { center: [0, 0, -30],   semiX: 10, semiZ: 14 },
  lookout: { center: [14, 0, -22],  semiX: 10, semiZ: 10 },
};
