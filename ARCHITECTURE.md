# Lub Island -- Technical Architecture Reference

> **Purpose**: Self-contained reference for Claude Code sessions after context compression.
> Read this before modifying any file.

---

## 1. Tech Stack

| Package | Version | Role |
|---|---|---|
| `next` | ^16.2.1 | App framework (App Router, API routes). Dev server uses `--turbopack`. |
| `react` / `react-dom` | ^19.2.4 | UI layer. |
| `three` | ^0.183.2 | 3D rendering engine. |
| `@react-three/fiber` (R3F) | ^9.5.0 | React reconciler for Three.js -- declarative scene graph. |
| `@react-three/drei` | ^10.7.7 | R3F helpers: `Text`, `Stars`, `Instance`/`Instances`. |
| `zustand` | ^5.0.12 | State management -- 4 stores (see section 4). |
| `inkjs` | ^2.4.0 | Ink runtime *imported but not directly used* -- dialogue uses a custom `DialogueRunner` class that mimics Ink's API (see section 8). |
| `howler` | ^2.2.4 | Audio playback (imported in `src/utils/audio.ts`). |
| `lil-gui` | ^0.21.0 | Debug GUI (used in `src/dev/DevToolbar.tsx`). |
| `tailwindcss` | ^4.2.2 | Utility CSS via `@tailwindcss/postcss`. |
| `typescript` | ^6.0.2 | Type-checking. |

Build commands: `npm run dev` (Turbopack), `npm run build`, `npm run start`.

---

## 2. Project Structure

```
src/
  app/
    layout.tsx                  -- Root HTML layout (metadata, font, global CSS import)
    page.tsx                    -- Entry point: renders <Game /> + <DevToolbar /> via dynamic() with ssr:false
    globals.css                 -- Tailwind base + custom game styles
    api/
      ai/
        bio/route.ts            -- POST: mock player bio generation (returns canned string by week)
        character/route.ts      -- POST: mock new-arrival character generation
        dialogue/route.ts       -- POST: mock AI dialogue lines + choices
      health/
        mock/route.ts           -- GET: returns randomised mock biometric data (sleep, steps, etc.)

  game/
    Game.tsx                    -- Top-level component: R3F <Canvas> + UI overlay div
    GameLoop.tsx                -- useGameLoop() hook: all phase/event/dialogue state machine logic
    constants.ts                -- All tuning constants (energy costs, camera params, coconut catch, etc.)

  scene/
    Island.tsx                  -- Root R3F scene: assembles camera, lighting, environment, player, NPCs
    IsometricCamera.tsx         -- Orthographic camera that lerps to follow player position
    DayNightCycle.tsx           -- Ambient/directional/hemisphere/point lights + Stars; lerps between day/night
    IslandEnvironment.tsx       -- All static geometry (ground, water, zones, buildings, trees, props). Exports ZONE_POSITIONS.
    PlayerController.tsx        -- Player movement, collision, rendering. Exports module-level refs.
    NPCController.tsx           -- Renders all active NPCs with idle animation, facing, interaction proximity
    ItemPickups.tsx               -- 3D item pickup objects (dodecahedron + glow + auto-collect)
    InteractionZone.tsx         -- (Unused / minimal -- interaction handled inside NPCController)

  store/
    gameStore.ts                -- Phase, day/week, events remaining, night flag
    biometricStore.ts           -- Biometric inputs -> computed energy/charm/performance stats
    playerStore.ts              -- Inventory, counters, player identity
    relationshipStore.ts        -- Per-NPC relationship values, partners, eliminated list

  characters/
    CharacterData.ts            -- All TypeScript types/interfaces (Character, GamePhase, EventType, etc.)
    roster.ts                   -- STARTING_CAST array (6 NPCs) + PLAYER_CHARACTER constant
    dialogueScripts.ts          -- Hand-authored DialogueScript trees per NPC (keyed by relationship tier)
    personality.ts              -- Personality-related helpers

  systems/
    energy.ts                   -- canAfford(), spendEnergy(), getEnergyCostForAction(), getEnergyWarning()
    calendar.ts                 -- getDayType(), isCeremonyDay(), getAvailableEventTypes(), getDayLabel()
    events.ts                   -- generateDailyEvents(): builds EVENTS_PER_DAY GameEvent objects per day
    challenge.ts                -- Coconut Catch helpers: getCoconutFallSpeed(), getCatchRadius(), getScoreTier(), getRelationshipReward()
    relationships.ts            -- getRelationshipTier(), getRelationshipLabel(), calculateNPCChoice()
    biometrics.ts               -- Biometric computation helpers
    items.ts                    -- Item system helpers

  ui/
    HUD.tsx                     -- Energy/charm/performance bars, day/week label
    DialogueBox.tsx             -- Typewriter text + choice buttons; receives speakerColor
    VirtualJoystick.tsx         -- Touch/mouse joystick; writes to joystickInputRef
    MainMenu.tsx                -- Start screen
    MorningBriefing.tsx         -- Day-start summary overlay
    EventScreen.tsx             -- Event preview (title, description, energy cost, start/close)
    ChallengeUI.tsx             -- Coconut Catch mini-game
    DateUI.tsx                  -- Date sequence UI
    CeremonyUI.tsx              -- Partner choosing + elimination results
    SleepTransition.tsx         -- Night-to-morning fade
    ItemPopup.tsx               -- Generic popup (also used for "too tired" warning)
    InventoryUI.tsx               -- Bag/inventory grid overlay (unlimited items, use/gift actions)
    ProducerPhone.tsx           -- Producer phone event picker

  utils/
    ink.ts                      -- DialogueRunner class, DialogueScript/DialogueLine/DialogueChoice types
    audio.ts                    -- Audio helpers (Howler wrapper)
    math.ts                     -- Math utilities

  dev/
    DevToolbar.tsx              -- lil-gui debug panel (god mode, stat sliders, phase overrides)
```

---

## 3. Rendering Architecture

### Canvas + UI overlay

`Game.tsx` renders two sibling layers inside a `position: relative` div:

1. **R3F `<Canvas>`** -- `position: absolute; inset: 0` -- fills the viewport.
   - `orthographic` camera with `zoom={60}`, initial position `[20, 20, 20]`.
   - `gl={{ antialias: true, alpha: false }}`.
   - Contains `<Island />` wrapped in `<Suspense fallback={null}>`.

2. **UI overlay `<div>`** -- `position: absolute; inset: 0; pointer-events: none`.
   - Each visible UI component is wrapped in a `<div style={{ pointerEvents: 'auto' }}>` so only active UI captures clicks; the rest fall through to the canvas.

### Viewport

The page (`page.tsx`) sets `<main>` to `100vw x 100vh`, `overflow: hidden`, `background: #1a1a2e`. Both `<Game />` and `<DevToolbar />` are loaded via `next/dynamic` with `ssr: false` to avoid Three.js SSR issues.

---

## 4. State Management (Zustand)

All 4 stores are created with `create<T>()` from Zustand v5. They are accessed in components via the hook (`useGameStore()`, etc.) and occasionally via direct `setState` calls on the store reference (e.g., `useBiometricStore.setState({ energy: ... })`).

### 4.1 gameStore (`src/store/gameStore.ts`)

```ts
interface GameStore {
  phase: GamePhase;          // 'MAIN_MENU' | 'MORNING_BRIEFING' | 'DAYTIME_FREE' | 'EVENT' | 'NIGHTTIME_FREE' | 'SLEEP_TRANSITION' | 'CEREMONY' | 'CEREMONY_RESULT'
  day: number;               // 1-7
  week: number;              // starts at 1
  eventsRemaining: number;   // 0 to EVENTS_PER_DAY (3)
  eventsCompleted: number;
  isNight: boolean;
  currentEventType: EventType | null;

  setPhase(phase: GamePhase): void;
  startEvent(type: EventType): void;      // sets phase='EVENT', stores type
  completeEvent(): void;                  // decrements eventsRemaining; auto-transitions to NIGHTTIME_FREE when 0
  transitionToNight(): void;              // phase='NIGHTTIME_FREE', isNight=true, eventsRemaining=0
  advanceDay(): void;                     // increments day (wraps at 7 -> week+1), resets events, phase='MORNING_BRIEFING'
  advanceToNight(): void;
  advanceToCeremony(): void;
  resetWeek(): void;
  resetGame(): void;
}
```

### 4.2 biometricStore (`src/store/biometricStore.ts`)

Holds raw biometric inputs and derived stats. Stats are recomputed on every setter call.

```ts
interface BiometricStore {
  // Raw inputs
  sleepHours: number;      // default 7
  sleepQuality: number;    // default 70 (0-100)
  activeMinutes: number;   // default 30
  stepCount: number;       // default 5000

  // Computed stats (0-100, floor = STAT_FLOOR = 15)
  energy: number;          // (sleepHours / 8) * (sleepQuality / 100) * 100
  charm: number;           // (activeMinutes / 60) * 100
  performance: number;     // (stepCount / 10000) * 100

  // Setters (each recomputes all 3 stats)
  setSleepHours(v: number): void;
  setSleepQuality(v: number): void;
  setActiveMinutes(v: number): void;
  setStepCount(v: number): void;

  godMode: boolean;
  setGodMode(on: boolean): void;   // true -> sets all stats to 100
}
```

### 4.3 playerStore (`src/store/playerStore.ts`)

```ts
interface PlayerStore {
  inventory: ItemDef[];            // unlimited (no cap)
  totalChallengesWon: number;
  totalDatesCompleted: number;
  playerSpecies: string;           // default 'dog'
  playerName: string;              // default 'Player'
  playerBio: string;

  addItem(item: ItemDef): boolean;        // returns false if inventory full
  removeItem(itemId: string): void;
  useItem(itemId: string): ItemDef | null; // removes and returns the item
  setPlayerName(name: string): void;
  setPlayerSpecies(species: string): void;
  setPlayerBio(bio: string): void;
  incrementChallengesWon(): void;
  incrementDatesCompleted(): void;
  resetPlayer(): void;
}
```

### 4.4 relationshipStore (`src/store/relationshipStore.ts`)

Initialised from `STARTING_CAST` -- every NPC starts at relationship 0.

```ts
interface RelationshipStore {
  relationships: Record<string, number>;      // npcId -> value, clamped to [-100, 100]
  partners: Record<string, string | null>;    // npcId -> partnerId
  eliminated: string[];

  getRelationship(npcId: string): number;
  changeRelationship(npcId: string, delta: number): void;  // clamped to RELATIONSHIP.MIN..MAX
  setPartner(npcId: string, partnerId: string | null): void;
  eliminate(npcId: string): void;
  isEliminated(npcId: string): boolean;
  resetRelationships(): void;
}
```

---

## 5. Scene Graph

`Island.tsx` is the root scene component, rendered inside the R3F `<Canvas>`. It receives `onNPCInteract` from `Game.tsx`.

```
<Island onNPCInteract={handleNPCInteract}>
  <IsometricCamera />               -- Follows player via lerp; orthographic
  <DayNightCycle isNight={isNight} />  -- All lighting + stars
  <IslandEnvironment isNight={isNight} />  -- Static world geometry
  <PlayerController position={[0,0,5]} isMovementLocked={movementLocked} />
  <NPCController isNight={isNight} onNPCInteract={onNPCInteract} />
```

### Camera (`IsometricCamera.tsx`)

- Orthographic camera, zoom = 60.
- Offset from player: `ISO_OFFSET = Vector3(20, 20, 20)`.
- Look-ahead offset: `LOOK_AHEAD_OFFSET = Vector3(0, 0, -2)` (shifts look target above player for portrait framing).
- Lerp factor: `CAMERA.LERP_FACTOR = 0.1`.
- First frame snaps to position; subsequent frames lerp.
- Reads `playerPositionRef.current` every frame (no React re-renders).

### Lighting (`DayNightCycle.tsx`)

Lerps between day and night presets using a `nightAmount` ref (0.0 = day, 1.0 = night). Lerp factor: 0.02 (~2-3s transition).

Lights in scene:
- `ambientLight` -- day: 0.6, night: 0.12
- `directionalLight` -- day: intensity 1.2, color `#FFF5E0`, pos `[-10, 20, 5]`; night: 0.35, `#B0C4DE`, `[8, 18, -6]`. Has shadow map (1024x1024).
- `hemisphereLight` -- day: sky `#87CEEB`, ground `#4A8C3F`, intensity 0.5; night: `#0A0A2A`, `#1A1A1A`, 0.15.
- Two `pointLight` refs (warm orange `#FF9944`): villa area `[0, 2, 0]` and dock area `[12, 2, 16]`. Zero intensity during day, 1.2 at night.
- drei `<Stars>` group -- fades in when nightAmount > 0.4. 1500 stars, radius 80, depth 60.

### Environment (`IslandEnvironment.tsx`)

Procedural geometry (no loaded models). Exports `ZONE_POSITIONS`:

```ts
ZONE_POSITIONS: Record<string, [number, number, number]> = {
  beach:   [0, 0, 16],
  villa:   [0, 0.1, 0],
  garden:  [14, 0, 2],
  arena:   [-14, 0, 2],
  jungle:  [0, 0, -14],
  dock:    [12, 0, 16],
  lookout: [12, 1.5, -12],
};
```

Contains sub-components for PalmTree, SimpleTree, Rock, and all zone structures (Villa, Arena podium, Garden fountain + benches, Lookout mound, Beach umbrellas, Dock, etc.). Ground is a large flat cylinder. Water plane surrounds the island.

---

## 6. Player Controller (`src/scene/PlayerController.tsx`)

### Module-level refs (cross-component communication)

```ts
export const playerPositionRef  = { current: new THREE.Vector3(0, 0, 0) };
export const playerTargetRef    = { current: new THREE.Vector3(0, 0, 0) };
export const joystickInputRef   = { current: { x: 0, y: 0, active: false } };
```

These are plain objects (not React refs) so they can be imported and read/written by any module without re-renders. The camera, NPC proximity checks, and VirtualJoystick all use these.

### Input

Two input sources, merged each frame with joystick taking priority:

1. **Virtual Joystick** (`VirtualJoystick.tsx`): writes to `joystickInputRef.current` on touch/mouse drag. Outer ring: 120px. Knob: 48px. Max displacement: 40px. Dead zone: 5px. Normalised output: x,y in [-1, 1].

2. **WASD keyboard**: module-level `keysDown` Set, updated by global `keydown`/`keyup` listeners. `getKeyboardInput()` returns normalised {x, y, active}.

### Isometric rotation conversion

Joystick/keyboard input is in screen space. To convert to world space for the isometric camera:

```ts
const ISO_ANGLE = Math.PI / 4;  // 45 degrees
const cos = Math.cos(-ISO_ANGLE);
const sin = Math.sin(-ISO_ANGLE);
const worldX = inputX * cos - inputY * sin;
const worldZ = inputX * sin + inputY * cos;
```

### Movement

- Speed: `PLAYER.MOVE_SPEED = 4` units/sec, scaled by `delta`.
- Movement locked when `phase` is not `DAYTIME_FREE` or `NIGHTTIME_FREE`.
- Character faces movement direction via `lerpAngle()` (shortest-path angle lerp, t=0.15).
- Walk bob: `BOB_SPEED = 10`, `BOB_AMPLITUDE = 0.06`.

### Collision system

Two layers:

1. **Island bounds**: circular boundary `ISLAND_RADIUS = 20` centered at origin. Uses `distSq < ISLAND_RADIUS^2`.

2. **Structure colliders**: array of `CircleCollider { cx, cz, radius }`. Player collision radius: `PLAYER.COLLISION_RADIUS = 0.4`. Test: `dx*dx + dz*dz < (collider.radius + playerRadius)^2`.

   **Slide resolution**: if direct move collides, tries X-only slide, then Z-only slide.

#### All structure colliders:

| Structure | Centre | Radius |
|---|---|---|
| Villa main hall | villa zone | 3.5 |
| Villa left wing | villa + (-4.5, 0) | 2.0 |
| Villa right wing | villa + (4.5, 0) | 2.0 |
| Garden fountain | garden zone | 1.8 |
| Garden bench east | garden + (2, 0) | 0.6 |
| Garden bench west | garden + (-2, 0) | 0.6 |
| Arena podium | arena zone | 1.0 |
| Lookout mound | lookout zone | 2.8 |
| Beach palms (x3) | beach + offsets | 0.5 |
| Beach umbrellas (x3) | beach + offsets | 0.4 |
| Jungle palms (x2) | jungle + offsets | 0.5 |
| Jungle trees (x8) | jungle + offsets | 0.5 |
| Standalone palms (x4) | world coords | 0.5 |
| Standalone trees (x4) | world coords | 0.5 |
| Rocks (x3) | world coords | 0.35-0.5 |

### Player mesh (DogCharacter)

Primitive geometry: cylinder body (#D4A05A), sphere head, cone ears (#B8863A), sphere eyes (#1A1A1A), sphere nose (#3A2518).

---

## 7. NPC System (`src/scene/NPCController.tsx`)

### Placement

Each NPC's position is determined by:
1. `character.preferredZone` (e.g., "Garden") mapped via `ZONE_KEY_MAP` to a `ZONE_POSITIONS` key.
2. Per-NPC offsets in `NPC_ZONE_OFFSETS` to avoid spawning inside structures:

```ts
NPC_ZONE_OFFSETS: Record<string, [number, number]> = {
  rosie:    [ 3.0,  0.0],  // Garden - beside east bench
  blaze:    [-1.5,  2.0],  // Arena - edge of ring
  pudge:    [ 2.5,  1.5],  // Villa - porch area
  kiki:     [-2.0,  1.0],  // Beach - near beach chair
  sprocket: [ 2.0, -1.0],  // Beach - other side
  lily:     [ 1.5,  2.0],  // Jungle - on trail
};
```

### Species rendering (`NPCCharacter`)

Species-specific geometry configs in `SPECIES_CONFIGS`:
- `rabbit` -- pink, long cone ears
- `fox` -- orange, pointed triangle ears
- `bear` -- brown, round sphere ears
- `cat` -- black (#2A2A2A), pointed small ears
- `penguin` -- black with white belly cylinder, flattened box wings
- `frog` -- green, large white sphere eyes with black pupils

All NPCs share the same body structure: cylinder body, sphere head, species-specific features.

### Night behavior

Based on `character.activityPreference`:
- `early_bird` -- hidden at night (visible = false)
- `night_owl` -- moves to beach zone (bonfire area) with deterministic hash offset
- `balanced` -- 50/50 based on `simpleHash(character.id) % 2`: visible at bonfire or hidden

Eliminated NPCs are filtered out entirely.

### Interaction proximity

- Interaction radius: `PLAYER.INTERACTION_RADIUS = 2.5` units.
- `SingleNPC` checks distance to `playerPositionRef` every frame.
- When nearby: NPC faces player (lerp rotation toward player, t=0.1).
- Interaction bubble ("!" in white sphere) shown when nearby, hidden otherwise (set via `bubbleRef.current.visible`).
- Click handler on the NPC group checks distance before calling `onInteract(npcId)`.
- NPC positions are exported via `npcPositionsRef` (module-level Record<string, [number,number,number]>) for cross-component distance checks (e.g., dialogue auto-cancel).

### Idle animation

- Phase staggered by `simpleHash(npcId) % 1000`.
- Y rotation oscillation: `sin(phase * 0.8) * 0.3`.
- Hover bob: `sin(phase * 1.5) * 0.04`.

### Name tag

drei `<Text>` at `[0, 1.55, 0]`, fontSize 0.18, white with black outline.

---

## 8. Dialogue System

### DialogueScript format (`src/utils/ink.ts`)

```ts
interface DialogueNode {
  id: string;
  speaker: string;
  text: string | ((vars: Record<string, number>) => string);  // static or dynamic
  choices?: {
    text: string;
    condition?: (vars: Record<string, number>) => boolean;   // charm-gating etc.
    lockMessage?: string;
    next: string;          // node id to jump to
    effects?: Record<string, number>;   // variable deltas (e.g., { relationship: 8 })
  }[];
  next?: string;   // auto-advance node id (no choices)
}

interface DialogueScript {
  id: string;
  startNode: string;
  nodes: Record<string, DialogueNode>;
}
```

### DialogueRunner class

```ts
class DialogueRunner {
  constructor(script: DialogueScript, initialVars: Record<string, number>);
  getCurrentLine(): DialogueLine | null;    // builds text + evaluates choices (locked/unlocked)
  selectChoice(index: number): boolean;     // checks condition, applies effects, advances
  advance(): boolean;                       // follows node.next for auto-advance lines
  isComplete(): boolean;                    // true when current node id has no entry in nodes
  getVariable(key: string): number;
  getVariables(): Record<string, number>;
}
```

### Charm-gating

Choice conditions check `vars.charm >= N` (or other stats). If the condition fails, the choice is rendered with `locked: true` and `lockReason` text. The UI (DialogueBox) shows locked choices greyed out with the lock reason. When a stat-gated choice is **unlocked**, it displays a golden amber badge (e.g., "40 CHARM") and amber-tinted styling to highlight it as a special option.

### Relationship change flow

1. `handleNPCInteract` creates a `DialogueRunner` with initial vars including `relationship_level` = current relationship.
2. Player selects choices; `selectChoice()` applies `effects` (e.g., `{ relationship: 8 }` adds 8 to the `relationship` variable *inside the runner*).
3. On dialogue end (`handleDialogueChoice` or `handleDialogueAdvance`), the game loop reads the runner's `relationship_level` variable, computes the delta from the store's current value, and calls `relStore.changeRelationship(npcId, delta)`.

Note: the effects key in dialogue scripts uses `relationship` (not `relationship_level`). The game loop reads `relationship_level` from the runner. This means dialogue effects must modify the `relationship_level` variable for changes to propagate. Currently the scripts use `{ relationship: N }` in effects -- this is a known inconsistency in the prototype where the effect key doesn't match the variable read by the game loop. In practice the relationship still changes because the `effects` add to `this.variables[key]`, and the existing scripts' key naming varies.

### Dialogue scripts (`src/characters/dialogueScripts.ts`)

Hand-authored per NPC, keyed by relationship tier (e.g., `rosie_chat_low`, `rosie_chat_high`). `getDialogueForNPC(npcId, relationship)` selects the appropriate script. Also contains `DATE_DIALOGUES` for date events.

---

## 9. Game Loop (`src/game/GameLoop.tsx`)

### `useGameLoop()` hook

Returns state object (`GameLoopState`) + handler functions. All phase transitions and event handling live here.

### GameLoopState shape

```ts
interface GameLoopState {
  dailyEvents: GameEvent[];
  currentEvent: GameEvent | null;
  dialogueActive: boolean;
  currentDialogue: DialogueRunner | null;
  currentLine: DialogueLine | null;
  currentNPCId: string | null;
  showEventScreen: boolean;
  showChallengeUI: boolean;
  showDateUI: boolean;
  showCeremonyUI: boolean;
  showSleepTransition: boolean;
  showMorningBriefing: boolean;
  showMainMenu: boolean;
  showProducerPhone: boolean;
  showItemPopup: boolean;
  itemPopupName: string;
  itemPopupDesc: string;
  ceremonyPhase: 'choosing' | 'results';
  ceremonyResults: { npcId: string; partnerId: string | null }[];
  eliminatedThisCeremony: string[];
  dateNPCId: string;
  dateNPCName: string;
  briefingEvents: string[];
  droppedItems: DroppedItem[];    // items spawned in the 3D world
  showInventory: boolean;         // inventory overlay visibility
}
```

### Additional callbacks

- `cancelDialogue()` -- exits active dialogue (used by close button and walk-away proximity check)
- `handleGiftItem(item)` -- gifts an item during dialogue, removing it and boosting relationship
- `handleItemPickup(index)` -- collects a dropped item from the world
- `handleUseItem(item)` -- uses an item from inventory (eat chocolate, read book, etc.)

### Phase transitions

```
MAIN_MENU
  -> startGame() -> MORNING_BRIEFING (generates daily events)
     -> continueMorning() -> DAYTIME_FREE
        -> triggerEvent(i) -> shows EventScreen
           -> handleStartEvent(event) -> EVENT
              challenge -> showChallengeUI -> handleChallengeComplete() -> DAYTIME_FREE (or NIGHTTIME_FREE if no events left)
              date -> showDateUI -> handleDateComplete() -> DAYTIME_FREE (or NIGHTTIME_FREE)
              social -> starts NPC dialogue -> completeEvent()
           -> closeEventScreen() -> dismisses popup without consuming event (player can re-open later)
        -> goToSleep() -> SLEEP_TRANSITION
     -> goToSleep() from NIGHTTIME_FREE -> SLEEP_TRANSITION
        -> continueSleep():
           if day == 7 -> CEREMONY
              -> handleCeremonyChoice(npcId) -> ceremonyPhase='results' (NPCs pick partners, eliminations happen)
              -> continueCeremony() -> advanceDay() -> MORNING_BRIEFING (next week)
           else -> advanceDay() -> MORNING_BRIEFING
```

When `completeEvent()` is called on the game store, it decrements `eventsRemaining`. If it reaches 0, the store auto-transitions to `NIGHTTIME_FREE` and sets `isNight = true`. Events are required -- the "Advance to Night" button only appears after all events are completed. Closing the event popup (via `closeEventScreen()`) merely dismisses it without consuming the event.

### Movement locking

`Island.tsx` computes: `movementLocked = phase !== 'DAYTIME_FREE' && phase !== 'NIGHTTIME_FREE'`. This is passed to `PlayerController.isMovementLocked`.

### Energy spending

- NPC talk (day): `ENERGY_COSTS.TALK_NPC_DAY = 5`
- NPC talk (night): `ENERGY_COSTS.TALK_NPC_NIGHT = 0` (free)
- Events: spent via `handleStartEvent()` which calls `useBiometricStore.setState({ energy: ... })` directly.
- If energy is insufficient, an ItemPopup ("Too tired...") is shown instead.

---

## 10. Cross-Component Communication

### Module-level refs

Defined in `PlayerController.tsx` and imported by other modules:

| Ref | Type | Writers | Readers |
|---|---|---|---|
| `playerPositionRef` | `{ current: Vector3 }` | `PlayerController` (useFrame) | `IsometricCamera`, `NPCController` (proximity checks) |
| `playerTargetRef` | `{ current: Vector3 }` | `PlayerController` (useFrame) | (currently copies playerPositionRef) |
| `joystickInputRef` | `{ current: { x, y, active } }` | `VirtualJoystick` (touch/mouse handlers) | `PlayerController` (useFrame, merged with WASD) |

### Store access patterns

- **Hook access**: `const gameStore = useGameStore()` -- causes re-render on any change.
- **Selector access**: `useGameStore((s) => s.phase)` -- re-renders only on phase change.
- **Direct mutation**: `useBiometricStore.setState({ energy: ... })` -- used in GameLoop to bypass computed stats.
- **Outside React**: `useRelationshipStore.getState()` -- not currently used but available.

### Callback flow

`Game.tsx` creates handlers via `useGameLoop()`, passes `handleNPCInteract` down to `<Island>` which passes it to `<NPCController>` which passes it to each `<SingleNPC>` as `onInteract`. When clicked, the NPC calls `onInteract(npcId)` which bubbles up to the game loop.

---

## 11. Key Constants (`src/game/constants.ts`)

### Energy costs
```ts
ENERGY_COSTS = {
  CHALLENGE_EVENT: 25,
  DATE_EVENT: 20,
  SOCIAL_EVENT: 15,
  TALK_NPC_DAY: 5,
  PICK_UP_ITEM: 3,
  PRODUCER_PHONE: 20,
  TALK_NPC_NIGHT: 0,
  WALK: 0,
}
```

### Stat system
```ts
STAT_FLOOR = 15            // Minimum value for energy/charm/performance
BIO_TARGETS = {
  SLEEP_HOURS_MAX: 8,
  ACTIVE_MINUTES_MAX: 60,
  STEPS_MAX: 10000,
}
```

### Camera
```ts
CAMERA = {
  ROTATION_Y: Math.PI / 4,    // 45 degrees
  TILT_X: Math.PI / 5.5,      // ~33 degrees
  ZOOM: 60,
  LERP_FACTOR: 0.1,
  NEAR: 0.1,
  FAR: 1000,
}
```

### Camera angle slider
```ts
// Camera angle slider (module-level ref in IsometricCamera.tsx)
cameraAngleRef = { current: 50 }  // 0-100 slider, default 50
// Interpolates between LOW (high zoom, top-down), MID (balanced), HIGH (low zoom, side view)
```

### Player
```ts
PLAYER = {
  MOVE_SPEED: 4,
  INTERACTION_RADIUS: 2.5,
  COLLISION_RADIUS: 0.4,
}
```

### Coconut Catch (challenge mini-game)
```ts
COCONUT_CATCH = {
  DURATION_SECONDS: 30,
  BRONZE_THRESHOLD: 5,
  SILVER_THRESHOLD: 10,
  GOLD_THRESHOLD: 15,
  BASE_FALL_SPEED: 3,
  PERFORMANCE_SPEED_MODIFIER: 0.02,  // lower speed per performance point
  BASE_CATCH_RADIUS: 40,
  PERFORMANCE_RADIUS_MODIFIER: 0.3,  // extra radius per performance point
  SPAWN_INTERVAL_MS: 800,
}
```

### Relationship
```ts
RELATIONSHIP = {
  MIN: -100,
  MAX: 100,
  GIFT_FLOWERS: 15,
  GIFT_CHOCOLATE: 10,
  DATE_GREAT: 20,
  DATE_GOOD: 10,
  DATE_BAD: -5,
  CHALLENGE_GOLD: 15,
  CHALLENGE_SILVER: 10,
  CHALLENGE_BRONZE: 5,
  NIGHT_CHAT_BONUS: 3,
}
```

### Ceremony
```ts
CEREMONY = {
  RANDOM_FACTOR_MIN: 0.05,
  RANDOM_FACTOR_MAX: 0.15,
}
```

### Schedule
```ts
DAYS_PER_WEEK = 7
EVENTS_PER_DAY = 3
// MAX_INVENTORY removed -- inventory is now unlimited

WEEKLY_SCHEDULE = ['arrival', 'free', 'challenge', 'date', 'drama', 'free', 'ceremony']
```

Relationship tiers (in `systems/relationships.ts`):
- hostile: <= -50
- cold: <= -20
- neutral: <= 20
- warm: <= 50
- close: <= 80
- romantic: > 80

---

## 12. API Routes

All routes are Next.js App Router API routes (files under `src/app/api/`). All are currently **mock stubs** returning hardcoded/randomised data.

| Route | Method | Purpose | Request body | Response |
|---|---|---|---|---|
| `/api/ai/bio` | POST | Generate player bio text | `{ playerChoices, relationships, stats, weekNumber }` | `{ bio: string }` -- picks from 3 canned strings by week |
| `/api/ai/character` | POST | Generate a new arrival NPC | `{ currentCast, playerPreferences, weekNumber }` | `{ character: Character }` -- returns Maple (week 2) or Coco (otherwise) |
| `/api/ai/dialogue` | POST | Generate AI dialogue lines | `{ npcProfile, situation, relationshipLevel, playerStats }` | `{ lines: string[], choices: string[] }` -- returns 3 generic lines + 3 generic choices |
| `/api/health/mock` | GET | Simulate health device data | (none) | `{ sleepHours, sleepQuality, activeMinutes, stepCount, timestamp }` -- all randomised |

---

## 13. Starting Cast (6 NPCs)

| ID | Name | Species | Zone | Activity | Romance | Confidence |
|---|---|---|---|---|---|---|
| `rosie` | Rosie | rabbit | Garden | early_bird | romantic | 55 |
| `blaze` | Blaze | fox | Challenge Arena | balanced | competitive | 95 |
| `pudge` | Pudge | bear | Villa | early_bird | either | 40 |
| `kiki` | Kiki | cat | Beach | night_owl | romantic | 85 |
| `sprocket` | Sprocket | penguin | Beach | balanced | friendship | 30 |
| `lily` | Lily | frog | Jungle | early_bird | either | 35 |

Player character: species `dog`, ID `player`, default zone Villa.

---

## 14. Key Type Definitions (`src/characters/CharacterData.ts`)

```ts
type AnimalSpecies = 'rabbit' | 'cat' | 'penguin' | 'bear' | 'frog' | 'deer' | 'duck' | 'fox' | 'owl' | 'dog';

type GamePhase = 'MAIN_MENU' | 'MORNING_BRIEFING' | 'DAYTIME_FREE' | 'EVENT' | 'NIGHTTIME_FREE' | 'SLEEP_TRANSITION' | 'CEREMONY' | 'CEREMONY_RESULT';

type EventType = 'challenge' | 'date' | 'social' | 'arrival' | 'drama';

interface PersonalityProfile {
  extroversion: number;    // 0-100
  agreeableness: number;
  confidence: number;
  humor: number;
  loyalty: number;
}

interface Character {
  id: string;
  name: string;
  species: AnimalSpecies;
  personality: PersonalityProfile;
  colorPalette: ColorPalette;        // { primary, secondary, accent }
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

interface GameEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  energyCost: number;
  location: string;
  involvedNPCs: string[];
}

interface ItemDef {
  id: string;
  name: string;
  description: string;
  effect: 'gift_relationship' | 'energy_restore' | 'charm_boost' | 'reveal_info' | 'producer_phone' | 'cosmetic' | 'performance_boost';
  effectValue: number;
  spawnZones: string[];
  rarity: 'common' | 'uncommon' | 'rare';
  ownerNpcId?: string;
  giftValue: number;
  consumeOnUse: boolean;
}

interface BiometricData {
  sleepHours: number;
  sleepQuality: number;
  activeMinutes: number;
  stepCount: number;
  energy: number;
  charm: number;
  performance: number;
}
```

---

## 15. Key Files

| File | Purpose |
|---|---|
| `src/scene/ItemPickups.tsx`     | 3D item pickup objects with glow and auto-collect    |
| `src/ui/InventoryUI.tsx`        | Bag inventory grid UI                                |
