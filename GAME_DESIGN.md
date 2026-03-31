# Lub Island -- Game Design Reference

> **Status:** Prototype / Vertical Slice
> **Engine:** React + Three.js (react-three-fiber), Next.js
> **Target:** Mobile-first web app with biometric integration

---

## 1. Game Overview

**Premise:** Lub Island is a reality-TV dating sim where anthropomorphic animal characters compete for love on a tropical island. The player is a contestant who must build relationships, survive weekly recoupling ceremonies, and avoid elimination. The twist: the player's real-world biometric data (sleep, activity, steps) directly powers their in-game stats.

**Genre:** Social simulation / Dating sim / Reality TV game

**Target Experience:** A casual, narrative-driven game where one full in-game week can be played per real-world day. The biometric hook encourages healthy habits -- better sleep means more energy, more steps means better physical performance in challenges. Each in-game week culminates in a dramatic recoupling ceremony where unpopular characters are eliminated. The next real-world day, the player can play another week.

**Player Character:** A golden dog (species: `dog`, id: `player`) with balanced 50/50 personality traits across all axes. The player starts at the Villa zone.

---

## 2. Core Loop

The game follows a daily cycle that repeats within a 7-day week:

```
  +------------------+
  |   MAIN_MENU      |
  +--------+---------+
           |
           v
  +------------------+
  | MORNING_BRIEFING |  <-- Biometrics convert to stats; daily events revealed
  +--------+---------+
           |
           v
  +------------------+
  |  DAYTIME_FREE    |  <-- Walk the island, talk to NPCs, pick up items
  +--------+---------+
           |
           v  (up to 3 events per day)
  +------------------+
  |      EVENT       |  <-- Challenge / Date / Social / Drama / Arrival
  +--------+---------+
           |  (returns to DAYTIME_FREE until events exhausted)
           v
  +------------------+
  |  NIGHTTIME_FREE  |  <-- Free roam at night, NPC talks cost 0 energy
  +--------+---------+
           |
           v
  +------------------+
  | SLEEP_TRANSITION |  <-- Day ends
  +--------+---------+
           |
           +-------> If day == 7: CEREMONY --> CEREMONY_RESULT --> Next week
           |
           +-------> Otherwise: MORNING_BRIEFING (next day)
```

Each day generates up to **3 events** (`EVENTS_PER_DAY = 3`). Once all events are completed (or the player manually transitions), the game enters `NIGHTTIME_FREE`. Nighttime talk is free (0 energy). Sleeping advances to the next day.

---

## 3. Phase System

There are **8 game phases** defined in `GamePhase`:

| Phase | Description | Player Actions |
|---|---|---|
| `MAIN_MENU` | Title screen. | Start game |
| `MORNING_BRIEFING` | Shows today's events and biometric-derived stats. | Review events, continue |
| `DAYTIME_FREE` | Open world roaming on the island. | Walk, talk to NPCs (5 energy), pick up items (3 energy), trigger events |
| `EVENT` | An event is in progress (challenge, date, social, drama, arrival). | Participate in the event's mini-game or dialogue |
| `NIGHTTIME_FREE` | Nighttime roaming. Some NPCs are asleep, others at the beach bonfire. | Talk to NPCs (free), explore |
| `SLEEP_TRANSITION` | Screen transition to next day. | Continue |
| `CEREMONY` | Recoupling ceremony (day 7 only). Player picks a partner, NPCs make choices. | Choose a partner from available cast |
| `CEREMONY_RESULT` | Shows who paired with whom and who was eliminated. | Continue to next week |

**Transitions:**
- `MAIN_MENU` -> `MORNING_BRIEFING` (start game)
- `MORNING_BRIEFING` -> `DAYTIME_FREE` (continue)
- `DAYTIME_FREE` -> `EVENT` (trigger event) -> `DAYTIME_FREE` (event complete, events remaining > 0)
- `DAYTIME_FREE` -> `NIGHTTIME_FREE` (all events done, or manual transition)
- `NIGHTTIME_FREE` -> `SLEEP_TRANSITION` (go to sleep)
- `SLEEP_TRANSITION` -> `MORNING_BRIEFING` (next day, if day < 7)
- `SLEEP_TRANSITION` -> `CEREMONY` (if day == 7)
- `CEREMONY` -> `CEREMONY_RESULT` -> `MORNING_BRIEFING` (week rolls over, day resets to 1)

---

## 4. Weekly Cycle

Each week is **7 days** (`DAYS_PER_WEEK = 7`). The `WEEKLY_SCHEDULE` determines what type of day it is:

| Day | Type | Headline Event | Available Event Types |
|---|---|---|---|
| 1 | `arrival` | New islander intro | `arrival`, `social` |
| 2 | `free` | Player's choice | `social`, `date`, `challenge` |
| 3 | `challenge` | Island challenge | `challenge`, `social` |
| 4 | `date` | Romantic date | `date`, `social` |
| 5 | `drama` | Drama/conflict | `drama`, `social` |
| 6 | `free` | Player's choice | `social`, `date`, `challenge` |
| 7 | `ceremony` | Recoupling ceremony | No events (ceremony only) |

On each non-ceremony day, 3 events are generated. The first event is always the "headline" type matching the day (e.g., a `challenge` event on challenge day). On `free` days, the headline is randomly chosen from available types. Remaining slots are filled randomly from available types.

Ceremony days produce no events -- the entire day is the recoupling ceremony.

---

## 5. Biometric System

Real-world biometric data converts to three in-game stats. All stats are clamped to 0-100 and subject to a **floor of 15** (`STAT_FLOOR = 15`) -- no stat can drop below 15.

### Conversion Formulas

| Biometric Input | Target Max | Derived Stat | Formula |
|---|---|---|---|
| `sleepHours` | 8 hours (`SLEEP_HOURS_MAX`) | **Energy** | `max(15, clamp(0, 100, (sleepHours / 8) * (sleepQuality / 100) * 100))` |
| `activeMinutes` | 60 min (`ACTIVE_MINUTES_MAX`) | **Charm** | `max(15, clamp(0, 100, (activeMinutes / 60) * 100))` |
| `stepCount` | 10,000 steps (`STEPS_MAX`) | **Performance** | `max(15, clamp(0, 100, (stepCount / 10000) * 100))` |

### Default Values (no biometric data)

| Input | Default | Resulting Stat |
|---|---|---|
| `sleepHours` | 7 | Energy ~61 (with 70% quality) |
| `sleepQuality` | 70 | (factors into Energy) |
| `activeMinutes` | 30 | Charm = 50 |
| `stepCount` | 5000 | Performance = 50 |

### God Mode

A debug toggle (`setGodMode(true)`) sets all three stats to 100 regardless of biometric input.

### What Each Stat Does

- **Energy:** Spent on all daytime actions. Determines how much the player can do each day.
- **Charm:** Gates dialogue choices. Higher charm unlocks smoother/flirtier responses. See Dialogue System.
- **Performance:** Affects challenge mini-games. Higher performance = easier Coconut Catch (slower fall speed, wider catch radius).

---

## 6. Energy Economy

### Energy Cost Table

| Action | Cost | Notes |
|---|---|---|
| Challenge Event | 25 | Coconut Catch or similar |
| Date Event | 20 | One-on-one date sequence |
| Social Event | 15 | Group dialogue |
| Talk to NPC (daytime) | 5 | Initiates dialogue |
| Pick Up Item | 3 | Adds item to inventory |
| Producer's Phone (item) | 20 | Call the producer for info |
| Talk to NPC (nighttime) | **0** | Free -- encourages nighttime socializing |
| Walk / Move | **0** | Always free |

### Low Energy Behavior

When the player tries to interact with an NPC or trigger an event but cannot afford the energy cost, a popup displays: "You're too tired for this right now. Better sleep boosts energy!" The action is blocked.

### Nighttime Energy

All NPC conversations at night cost 0 energy. This is a deliberate design choice to reward players who explore at night and to ensure players are never completely stuck.

---

## 7. Character Roster

Six starting NPCs (`STARTING_CAST`), all joining on Day 1:

### Rosie (rabbit)

| Trait | Value |
|---|---|
| **Species** | Rabbit |
| **Personality** | Extroversion 65, Agreeableness 90, Confidence 55, Humor 85, Loyalty 70 |
| **Romance Interest** | `romantic` |
| **Activity Preference** | `early_bird` (sleeps at night) |
| **Preferred Zone** | Garden |
| **Preferred Traits** | humor, kindness, creativity |
| **Disliked Traits** | arrogance, cynicism, laziness |
| **Colors** | Pink / White / Red |
| **Catchphrase** | "Lettuce be honest, you're un-bunny-lievable!" |
| **Key Trait** | Pun-obsessed, wrote love letters she never sent, bakes carrot cake |

### Blaze (fox)

| Trait | Value |
|---|---|
| **Species** | Fox |
| **Personality** | Extroversion 80, Agreeableness 30, Confidence 95, Humor 60, Loyalty 40 |
| **Romance Interest** | `competitive` |
| **Activity Preference** | `balanced` (50/50 night visibility) |
| **Preferred Zone** | Challenge Arena |
| **Preferred Traits** | ambition, confidence, wit |
| **Disliked Traits** | weakness, indecisiveness, clinginess |
| **Colors** | Orange / Dark-red / Gold |
| **Catchphrase** | "Keep up or step aside -- I don't do second place." |
| **Key Trait** | Street-smart, self-made, sees the island as a competition |

### Pudge (bear)

| Trait | Value |
|---|---|
| **Species** | Bear |
| **Personality** | Extroversion 25, Agreeableness 92, Confidence 40, Humor 55, Loyalty 95 |
| **Romance Interest** | `either` (open to romance or friendship) |
| **Activity Preference** | `early_bird` (sleeps at night) |
| **Preferred Zone** | Villa |
| **Preferred Traits** | gentleness, patience, honesty |
| **Disliked Traits** | aggression, showboating, dishonesty |
| **Colors** | Brown / Cream / Honey |
| **Catchphrase** | "I, um... I made you something. I hope it's okay." |
| **Key Trait** | Shy, never been on a date, signed up by friends, excellent cook |

### Kiki (cat)

| Trait | Value |
|---|---|
| **Species** | Cat |
| **Personality** | Extroversion 50, Agreeableness 50, Confidence 85, Humor 50, Loyalty 55 |
| **Romance Interest** | `romantic` |
| **Activity Preference** | `night_owl` (moves to Beach at night) |
| **Preferred Zone** | Beach |
| **Preferred Traits** | mystery, intelligence, independence |
| **Disliked Traits** | predictability, neediness, loud-mouthing |
| **Colors** | Black / Purple / Silver |
| **Catchphrase** | "Curiosity never killed this cat -- it made her interesting." |
| **Key Trait** | Enigmatic street performer and tarot reader, hard to impress |

### Sprocket (penguin)

| Trait | Value |
|---|---|
| **Species** | Penguin |
| **Personality** | Extroversion 90, Agreeableness 70, Confidence 30, Humor 95, Loyalty 65 |
| **Romance Interest** | `friendship` |
| **Activity Preference** | `balanced` (50/50 night visibility) |
| **Preferred Zone** | Beach |
| **Preferred Traits** | humor, acceptance, warmth |
| **Disliked Traits** | judgmental, seriousness, cruelty |
| **Colors** | Black / White / Yellow |
| **Catchphrase** | "If you're not laughing, I'm not trying hard enough!" |
| **Key Trait** | Class clown masking insecurity, uses jokes as a defense mechanism |

### Lily (frog)

| Trait | Value |
|---|---|
| **Species** | Frog |
| **Personality** | Extroversion 30, Agreeableness 65, Confidence 35, Humor 55, Loyalty 90 |
| **Romance Interest** | `either` (open to romance or friendship) |
| **Activity Preference** | `early_bird` (sleeps at night) |
| **Preferred Zone** | Jungle |
| **Preferred Traits** | nature-loving, calmness, loyalty |
| **Disliked Traits** | recklessness, materialism, loudness |
| **Colors** | Green / Lime / Pink |
| **Catchphrase** | "The forest has all the answers... if you listen." |
| **Key Trait** | Nature mystic, keeps a wildflower journal, talks to plants |

### Romance Interest Types

- `romantic` -- Primarily seeking romance (Rosie, Kiki)
- `friendship` -- Primarily seeking friendship (Sprocket)
- `competitive` -- Treats the island as a competition (Blaze)
- `either` -- Open to both romance and friendship (Pudge, Lily)

---

## 8. Relationship System

### Scale

Relationships range from **-100 to +100** (`RELATIONSHIP.MIN` / `RELATIONSHIP.MAX`), starting at 0.

### Relationship Tiers

| Range | Tier | Label |
|---|---|---|
| -100 to -50 | `hostile` | Hostile |
| -49 to -20 | `cold` | Cold |
| -19 to 20 | `neutral` | Neutral |
| 21 to 50 | `warm` | Warm |
| 51 to 80 | `close` | Close |
| 81 to 100 | `romantic` | Romantic |

The CeremonyUI uses a simplified label set: "Cold" (< -25), "Distant" (-25 to -1), "Neutral" (0 to 24), "Interested" (25 to 49), "Smitten" (50+).

### How Relationships Change

| Source | Change | Notes |
|---|---|---|
| Gift: Flowers | +15 | `GIFT_FLOWERS` |
| Gift: Chocolate | +10 | `GIFT_CHOCOLATE` |
| Date: Great chemistry (score >= 4) | +20 | `DATE_GREAT` |
| Date: Good chemistry (score 2-3) | +10 | `DATE_GOOD` |
| Date: Bad chemistry (score < 2) | -5 | `DATE_BAD` |
| Challenge: Gold tier | +15 | `CHALLENGE_GOLD` (applied at 50% to all watching NPCs) |
| Challenge: Silver tier | +10 | `CHALLENGE_SILVER` (applied at 50% to all watching NPCs) |
| Challenge: Bronze tier | +5 | `CHALLENGE_BRONZE` (applied at 50% to all watching NPCs) |
| Night Chat Bonus | +3 | `NIGHT_CHAT_BONUS` |
| Dialogue Choices | varies | Each dialogue choice has an `effects.relationship` value (typically +2 to +10) |

### Dialogue Tier Boundaries

Dialogue scripts are selected based on relationship level:
- **Low** (relationship < 20): Initial/introductory dialogues
- **Mid** (20 <= relationship < 60): Warmer, more personal dialogues
- **High** (relationship >= 60): Deep/romantic dialogues

Each NPC has 3 dialogue scripts (low, mid, high) stored in `NPC_DIALOGUES`.

---

## 9. Dialogue System

### Structure

Dialogues use a custom ink-like runner (`DialogueRunner`) with a node-based script format (`DialogueScript`). Each script has:
- `id`: Unique script identifier
- `startNode`: The first node to display
- `nodes`: A map of `DialogueNode` objects, each with:
  - `speaker`: Who is talking
  - `text`: Static string or dynamic function `(variables) => string`
  - `choices`: Optional array of player responses
  - `next`: Next node ID (for linear flow)

### Charm-Gating

Dialogue choices can be **charm-gated** using a `condition` function. The standard tiers are:

| Charm Level | Dialogue Tone | Threshold Examples |
|---|---|---|
| < 40 | Awkward / blunt | Charm-gated choices are locked; only basic options available |
| 40-69 | Normal / friendly | Mid-tier flirty or clever options unlock |
| 70+ | Smooth / charming | Top-tier responses unlock (highest relationship gains) |

When a choice is locked, a `lockMessage` is displayed (e.g., "Needs 40 charm to land a counter-pun.").

### Relationship Effects on Choices

Each dialogue choice has an `effects` object. The most common effect is `relationship`, which immediately modifies the relationship value with the speaking NPC. Typical values:
- Awkward/plain response: +2 to +3
- Friendly/warm response: +5 to +7
- Smooth/charming response (charm-gated): +8 to +10

### Variables Available to Dialogue Scripts

The `DialogueRunner` is initialized with:
- `player_charm` -- current Charm stat
- `player_energy` -- current Energy stat
- `player_performance` -- current Performance stat
- `relationship_level` -- current relationship value with this NPC

### Date Dialogues

Separate date-specific dialogue scripts exist in `DATE_DIALOGUES` (currently implemented for Rosie and Kiki). These are used during date events and contribute to a chemistry score.

### Dialogue Cancellation

Players can exit any conversation via:
- **Close button (X):** A close button in the top-right of the dialogue header dismisses the conversation immediately.
- **Walk away:** If the player moves beyond 2x the interaction radius (5 units) from the NPC during dialogue, the conversation auto-cancels. A proximity check runs every 200ms.

Cancelling a dialogue does not apply any pending relationship changes from the current dialogue runner.

### Journal-Unlocked Dialogue

When the player has read an NPC's character journal, a `journal_unlocked` variable is set to 1 in the DialogueRunner for that NPC. Dialogue scripts can use this to gate special choices or branches, revealing deeper character insights.

---

## 10. Events

### 10a. Coconut Catch Challenge

The primary challenge mini-game. A 2D catch game where coconuts fall from the top of the screen and the player moves a basket to catch them.

**Parameters (from `COCONUT_CATCH`):**

| Parameter | Value | Description |
|---|---|---|
| Duration | 30 seconds | `DURATION_SECONDS` |
| Base fall speed | 3 | `BASE_FALL_SPEED` (units per frame) |
| Performance speed modifier | 0.02 | `PERFORMANCE_SPEED_MODIFIER` -- per point of Performance, fall speed decreases |
| Base catch radius | 40px | `BASE_CATCH_RADIUS` |
| Performance radius modifier | 0.3 | `PERFORMANCE_RADIUS_MODIFIER` -- per point of Performance, radius grows |
| Spawn interval | 800ms | `SPAWN_INTERVAL_MS` |
| Minimum fall speed | 0.5 | Hard floor to prevent negative/zero speed |

**Effective values with Performance stat:**
- Fall speed = `max(0.5, 3 - performance * 0.02)` -- At 100 performance: `max(0.5, 1.0)` = 1.0
- Catch radius = `40 + performance * 0.3` -- At 100 performance: 70px

**Scoring Tiers:**

| Tier | Coconuts Caught | Relationship Reward (to all watching NPCs, at 50%) |
|---|---|---|
| Bronze | 5+ (`BRONZE_THRESHOLD`) | +5 * 0.5 = +2-3 per NPC |
| Silver | 10+ (`SILVER_THRESHOLD`) | +10 * 0.5 = +5 per NPC |
| Gold | 15+ (`GOLD_THRESHOLD`) | +15 * 0.5 = +7-8 per NPC |

Gold tier also increments the player's `challengesWon` counter.

### 10b. Date Events

One-on-one dates with a randomly selected NPC. Costs 20 energy (`DATE_EVENT`).

**Flow:**
1. A date NPC is selected from the event's involved NPCs
2. The `DateUI` presents charm-gated dialogue and interaction choices
3. Player choices build a `chemistry` score
4. On completion, relationship changes apply:

| Chemistry Score | Relationship Change | Tier |
|---|---|---|
| >= 4 | +20 | Great |
| 2-3 | +10 | Good |
| < 2 | -5 | Bad |

Dates increment the player's `datesCompleted` counter.

**Date Locations:** Garden, Beach, Lookout

### 10c. Social Events

Group social events with 2 randomly selected NPCs. Costs 15 energy (`SOCIAL_EVENT`).

**Flow:**
1. One NPC from the involved list is selected for dialogue
2. Standard NPC dialogue plays (relationship-tier selected)
3. Small relationship changes based on dialogue choices (typically +2 to +7)
4. Event auto-completes after dialogue ends

**Social Locations:** Villa, Beach, Garden

### 10d. Drama Events (Day 5)

Conflict/revelation events. Same energy cost as social (15). Currently use the same dialogue system as social events but with drama-themed titles and descriptions.

**Drama Locations:** Villa, Jungle

### 10e. Arrival Events (Day 1)

New islander introduction events. Same energy cost as social (15). Currently use social-style dialogue.

**Arrival Locations:** Villa

### 10f. Ceremony (Day 7)

The recoupling ceremony is a special phase, not a standard event.

**Ceremony Flow:**

1. **Choosing Phase:** Player sees all active (non-eliminated) NPCs with their relationship values. Player selects one NPC as their partner.

2. **NPC Decision Algorithm:**
   - NPCs choose in order of **confidence** (highest confidence picks first)
   - The NPC the player chose is automatically paired with the player
   - Each remaining NPC evaluates available (unpicked) candidates using a score:
     ```
     score = relationship_value + personality_compatibility + random_factor
     ```
   - **Personality compatibility** (0-20): Based on average similarity across 5 personality axes. Formula: `(1 - avgDifference/100) * 20`
   - **Random factor**: `(RANDOM_FACTOR_MIN + random * (RANDOM_FACTOR_MAX - RANDOM_FACTOR_MIN)) * 200`
     - `RANDOM_FACTOR_MIN` = 0.05, `RANDOM_FACTOR_MAX` = 0.15
     - Effective random range: 10 to 30 points

3. **Elimination:** Any NPC that was not chosen by anyone (neither as a partner nor a chooser with a valid partner) is eliminated. Eliminated NPCs are removed from the active cast permanently.

4. **Results Phase:** Shows all pairings and eliminations. Advancing continues to Week N+1, Day 1.

---

## 11. Item System

**Inventory: Unlimited bag** (no slot cap). Items are stored in the player store and displayed in a scrollable grid UI.
**Pickup: Free** -- walking near a dropped item auto-collects it (proximity radius 1.8 units).

### All Items

| Item | Use Actions | Gift Value | Spawn Zones | Rarity | Consumable |
|---|---|---|---|---|---|
| **Flowers** | Gift only | +15 | Garden | Common | Yes |
| **Chocolate** | Eat (+25 energy) or Gift | +10 | Beach, Villa | Common | Yes |
| **Book** | Read (+15 performance today) or Gift | +10 | Lookout | Uncommon | Yes |
| **Sunglasses** | Wear (+10 performance today) or Gift | +5 | Beach | Uncommon | Yes |
| **Character Journal** | Read (unlock special dialogue with owner NPC) | 0 | Owner's preferred zone | Uncommon | No (persists until end of day) |
| **Producer's Phone** | Call producer (choose next day's headline event) | 0 | Jungle | Rare | Yes |

### Gifting

A **Gift** button appears above the dialogue box when speaking with any NPC, visible only when the player has giftable items (items with giftValue > 0). Clicking it opens a gift picker showing available items with their gift values. Gifting an item removes it from inventory and boosts the relationship with that NPC by the item's `giftValue`.

### Nightly Item Drops

When the player transitions from daytime to nighttime (via "Rest" button), 2-4 items spawn around the island as glowing 3D pickups. Items appear as colored dodecahedrons with emissive glow, point lights, floating emoji labels, and ground ring indicators. Walking within 1.8 units auto-collects them.

- 70% chance: random regular item (weighted by rarity)
- 30% chance: a random character journal (spawns near the owner NPC's preferred zone)

A nighttime HUD tooltip informs the player: "Items have appeared around the island! Explore or go to sleep."

Uncollected items are cleared when the next day begins.

### Item Effects

- **gift_relationship:** Boosts NPC relationship by `giftValue` when gifted during dialogue
- **energy_restore:** Restores energy when used from inventory (chocolate: +25)
- **performance_boost:** Adds a temporary performance bonus for the current day (book: +15, sunglasses: +10)
- **reveal_info:** Character journals unlock a special dialogue choice when speaking with the journal's owner NPC
- **producer_phone:** Opens the Producer's Phone UI to choose tomorrow's headline event

---

## 12. Island Zones

Seven zones define the island geography. Zone positions are in world-space coordinates:

| Zone | Position (x, y, z) | Description | NPC Residents | Spawnable Items |
|---|---|---|---|---|
| **Beach** | (0, 0, 16) | Sandy shore area, bonfire at night | Kiki, Sprocket | Chocolate, Sunglasses |
| **Villa** | (0, 0.1, 0) | Central living quarters | Pudge | Chocolate, Character Journal |
| **Garden** | (14, 0, 2) | Flower garden with fountain | Rosie | Flowers |
| **Challenge Arena** | (-14, 0, 2) | Competition area | Blaze | (none) |
| **Jungle** | (0, 0, -14) | Dense tropical forest | Lily | Producer's Phone |
| **Dock** | (12, 0, 16) | Arrival/departure pier | (none) | (none) |
| **Lookout** | (12, 1.5, -12) | Elevated viewpoint | (none) | Book |

### Zone Key Mapping

Character `preferredZone` values map to internal zone keys:
- "Beach" -> `beach`
- "Villa" -> `villa`
- "Garden" -> `garden`
- "Challenge Arena" -> `arena`
- "Jungle" -> `jungle`
- "Dock" -> `dock`
- "Lookout" -> `lookout`

### Event Locations by Type

| Event Type | Possible Locations |
|---|---|
| Challenge | Challenge Arena, Beach |
| Date | Garden, Beach, Lookout |
| Social | Villa, Beach, Garden |
| Arrival | Villa |
| Drama | Villa, Jungle |

---

## 13. Day/Night Behavior

When the game transitions to `NIGHTTIME_FREE`, NPC visibility and position changes based on their `activityPreference`:

| Preference | Night Behavior | Characters |
|---|---|---|
| `early_bird` | **Hidden** -- NPC is asleep and not interactable | Rosie, Pudge, Lily |
| `night_owl` | **Moves to Beach** -- NPC relocates to the bonfire area with a deterministic offset | Kiki |
| `balanced` | **50/50 split** -- Deterministic hash of NPC id decides if they appear at the beach or are hidden | Blaze, Sprocket |

The deterministic hash (`simpleHash`) ensures consistent behavior per NPC -- the same NPC will always make the same night choice. Balanced NPCs that appear move to the Beach bonfire area with position offsets based on their id hash.

**Night NPC Talk:** All nighttime conversations cost 0 energy (`TALK_NPC_NIGHT`), making nighttime the ideal time to build relationships without resource pressure. The `NIGHT_CHAT_BONUS` of +3 relationship is available for night chats.

---

## 14. Camera System

The game uses an isometric-style camera:

| Parameter | Value | Description |
|---|---|---|
| Rotation Y | 45 degrees (`PI/4`) | Horizontal rotation |
| Tilt X | Variable (see slider) | Downward tilt, interpolated between LOW/MID/HIGH presets |
| Zoom | 45-70 (interpolated) | Orthographic zoom, varies with camera angle |
| Lerp Factor | 0.1 | Camera follow smoothing |
| Near Plane | 0.1 | |
| Far Plane | 1000 | |

The camera angle is controlled by a 0-100 slider (`cameraAngleRef`), defaulting to 50. The slider interpolates between three offset presets (LOW, MID, HIGH) affecting both the camera position offset and zoom level. Pinch-to-zoom on touch devices maps to this same slider. The dev toolbar exposes the slider for testing.

---

## 15. Player Movement

| Parameter | Value |
|---|---|
| Move Speed | 4 (`PLAYER.MOVE_SPEED`) |
| Interaction Radius | 2.5 (`PLAYER.INTERACTION_RADIUS`) |
| Collision Radius | 0.4 (`PLAYER.COLLISION_RADIUS`) |

---

## 16. Future Features (Not Yet Implemented)

The following features are referenced in the design or partially stubbed but not fully implemented:

1. **New Arrivals (AI-Generated):** Day 1 "arrival" events exist in the weekly schedule, but new characters are not yet dynamically generated. The system supports an AI character generation route (`/api/ai/character`), but it does not produce new cast members during gameplay.

2. **Producer Drama Events:** The Producer's Phone item and `handleProducerPhone` callback exist and the phone can be found in-world, but full producer-driven drama (rigging events, forcing dates, creating twists) is only partially working. Currently the phone shows a confirmation popup but does not fully alter the next day's schedule.

3. **Player Bio Generation:** The player character has a basic backstory but there is no system for the player to customize their bio, personality, or appearance.

4. **Real Audio:** No sound effects or music are implemented. The game is silent.

5. **Full 4-Week Season:** The weekly cycle repeats indefinitely. There is no concept of a season finale, winner declaration, or game-ending condition after a set number of weeks.

6. **Complete NPC Dialogue Coverage:** Date dialogues only exist for Rosie and Kiki (`DATE_DIALOGUES`). Blaze, Pudge, Sprocket, and Lily need date scripts.

7. **NPC-to-NPC Relationships:** NPCs only have relationships with the player. There is no NPC-NPC relationship tracking, though the ceremony algorithm simulates NPC preferences via personality compatibility.

8. **Biometric Device Integration:** The biometric store accepts manual input. Actual device/health API integration (Apple Health, Google Fit, wearables) is not connected.

9. **Save/Load System:** No persistence layer. Game state resets on page refresh.
