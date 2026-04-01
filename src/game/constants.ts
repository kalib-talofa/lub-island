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

// Days per week
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

// Weekly schedule - what kind of day each day is
export const WEEKLY_SCHEDULE = [
  'arrival',    // Day 1
  'free',       // Day 2
  'challenge',  // Day 3
  'date',       // Day 4
  'drama',      // Day 5
  'free',       // Day 6
  'ceremony',   // Day 7
] as const;

export type DayType = typeof WEEKLY_SCHEDULE[number];
