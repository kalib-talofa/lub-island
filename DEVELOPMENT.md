# Lub Island -- Development Guide

Practical reference for working on the Lub Island prototype. Written for both human developers and Claude Code.

---

## 1. Quick Start

```bash
npm install
npm run dev
```

This runs Next.js with Turbopack. Visit **http://localhost:3000** in your browser.

You should see a 3D island scene rendered via React Three Fiber. A virtual joystick appears at the bottom-left (touch/mouse), WASD keys work for keyboard movement, and the dev toolbar panel is open on the right side.

### Other Scripts

| Command          | What it does                              |
| ---------------- | ----------------------------------------- |
| `npm run dev`    | Start dev server (Next.js + Turbopack)    |
| `npm run build`  | Production build                          |
| `npm run start`  | Serve the production build locally        |
| `npm run lint`   | Run Next.js ESLint                        |

---

## 2. Development Tools

### Dev Toolbar (lil-gui)

The dev toolbar is a `lil-gui` panel rendered by `src/dev/DevToolbar.tsx`. It occupies a 300px-wide sidebar on the right edge of the screen.

**Toggle:** Click the small tab in the top-right corner. Arrow icon: `>` hides the panel, `< Dev` reveals it.

**Folders in the toolbar:**

- **Biometric Data** -- Sliders for `sleepHours`, `sleepQuality`, `activeMinutes`, `stepCount`. Also a **God Mode** toggle.
- **Computed Stats** -- Read-only display of `energy`, `charm`, `performance` (derived from biometric data). Updates every 500ms.
- **Game Controls** -- Read-only `day`, `eventsRemaining`, `phase`. Action buttons:
  - Advance to Night
  - Advance to Next Day
  - Advance to Ceremony
  - Reset Week
- **Relationships** -- One slider per NPC (-100 to 100). Drag to directly set relationship values.
- **Items** -- Contains subfolders and controls for inventory debugging:
  - **Regular Items** subfolder: buttons to add each of the 5 regular items (Flowers, Chocolate, Book, Sunglasses, Producer's Phone).
  - **Character Journals** subfolder: buttons to add each NPC's journal.
  - **Clear Inventory** button to empty the bag.
  - **Items in Bag** count display (auto-refreshes).

### WASD Keyboard Movement

`PlayerController.tsx` registers module-level `keydown`/`keyup` listeners on `window` for W, A, S, D. This runs alongside the virtual joystick. WASD input is normalized to a unit vector and fed into the movement system each frame.

- W = forward (negative Z on screen)
- S = backward
- A = left
- D = right

### God Mode

Toggle via the dev toolbar checkbox. Sets `energy`, `charm`, and `performance` all to 100. Controlled through `biometricStore.setGodMode(true)`.

### Day/Night Advance

Use the Game Controls folder in the dev toolbar:
- **Advance to Night** -- skips to NIGHTTIME_FREE phase.
- **Advance to Next Day** -- increments the day counter and resets to MORNING_BRIEFING.
- **Advance to Ceremony** -- jumps to CEREMONY phase.
- **Reset Week** -- resets back to day 1.

---

## 3. Code Conventions

### TypeScript Strict Mode

`tsconfig.json` has `"strict": true`. All code must pass strict type checks. No `any` unless absolutely unavoidable (and document why).

### "use client" Directive

Add `"use client"` at the top of every component file that uses:
- React hooks (`useState`, `useEffect`, `useRef`, etc.)
- React Three Fiber hooks (`useFrame`, `useThree`)
- Browser APIs (`window`, `document`, `addEventListener`)
- Zustand hooks

Next.js server components are the default; the directive is required to opt into client rendering.

### Path Alias

`@/` maps to `./src/` (configured in `tsconfig.json` paths). Always use `@/` imports instead of relative paths:

```ts
// Good
import { PLAYER } from '@/game/constants';

// Avoid
import { PLAYER } from '../../game/constants';
```

### Zustand Stores

- **Inside React components:** Access stores via their hooks: `useBiometricStore(s => s.energy)`.
- **Outside React** (module-level code, utility functions, callbacks): Use `.getState()`: `useBiometricStore.getState().energy`.
- **Always use individual selectors** to prevent unnecessary re-renders:

```ts
// Good -- only re-renders when energy changes
const energy = useBiometricStore(s => s.energy);

// Bad -- re-renders on ANY store change
const store = useBiometricStore();
```

### Module-Level Refs for 3D Communication

Cross-component 3D data (player position, joystick input) is shared via exported module-level refs, NOT React state. This avoids React reconciliation overhead in the render loop.

```ts
// PlayerController.tsx
export const playerPositionRef = { current: new THREE.Vector3(0, 0, 0) };
export const joystickInputRef = { current: { x: 0, y: 0, active: false } };
```

Other components import and read these refs directly in `useFrame`.

### Game Balance Constants

All gameplay numbers live in `src/game/constants.ts`. Energy costs, stat floors, biometric targets, challenge thresholds, timing values -- everything goes there. Never hardcode a balance number in a component.

---

## 4. How To: Common Tasks

### Add a New NPC

1. **Define the character** in `src/characters/roster.ts`. Add a new `Character` object to the `STARTING_CAST` array with all required fields (id, name, species, personality, colorPalette, catchphrase, backstory, romanceInterest, preferredTraits, dislikedTraits, activityPreference, preferredZone, etc.).

2. **Write dialogue** in `src/characters/dialogueScripts.ts`. Create at least a low-relationship chat script. Follow the existing naming pattern: `{id}_chat_low`, `{id}_chat_mid`, etc.

3. **Add a zone offset** in `src/scene/NPCController.tsx` in the `NPC_ZONE_OFFSETS` record. This prevents the NPC from spawning inside a structure. Format: `npcId: [dx, dz]` -- offset from their zone centre.

4. **Relationship init** happens automatically in `src/store/relationshipStore.ts` -- it iterates `STARTING_CAST` on store creation. No manual step needed as long as the NPC is in the roster.

### Add a New Dialogue Script

Dialogue scripts use the `DialogueScript` format defined in `src/utils/ink.ts`. Structure:

```ts
const myNpc_chat_low: DialogueScript = {
  id: 'myNpc_chat_low',
  startNode: 'greet',
  nodes: {
    greet: {
      id: 'greet',
      speaker: 'NpcName',
      text: 'Hello there!',
      choices: [
        {
          text: '"A charming reply"',
          condition: (v) => v.charm >= 40,         // optional charm gate
          lockMessage: 'Needs 40 charm.',           // shown when locked
          next: 'smooth_reply',
          effects: { relationship: 8 },             // relationship delta
        },
        {
          text: '"A normal reply"',
          next: 'normal_reply',
          effects: { relationship: 3 },
        },
      ],
    },
    smooth_reply: {
      id: 'smooth_reply',
      speaker: 'NpcName',
      text: 'Wow, smooth!',
      next: 'end_node',      // string next goes to another node
    },
    // ... more nodes
  },
};
```

Key points:
- `text` can be a string or a function `(vars) => string` for dynamic text.
- `condition` on choices receives the current biometric/game vars object.
- `effects.relationship` is a delta applied to the NPC's relationship score.
- A node with no `next` and no `choices` ends the conversation.

### Add a New Item

1. Add an `ItemDef` object to the `ITEM_DEFS` array in `src/systems/items.ts`:

```ts
{
  id: 'seashell',
  name: 'Seashell',
  description: 'A pretty seashell found on the beach.',
  effect: 'gift_relationship',   // one of the ItemDef effect types
  effectValue: 10,
  spawnZones: ['Beach'],
  rarity: 'common',
}
```

2. Valid effect types: `'gift_relationship'`, `'energy_restore'`, `'charm_boost'`, `'reveal_info'`, `'producer_phone'`, `'cosmetic'`.

3. `spawnZones` must match zone names used elsewhere (Beach, Villa, Garden, Jungle, etc.).

### Add a New Island Zone

1. Add the zone position in `src/scene/IslandEnvironment.tsx` in the `ZONE_POSITIONS` record:

```ts
export const ZONE_POSITIONS: Record<string, [number, number, number]> = {
  // existing zones...
  newzone: [x, y, z],
};
```

2. Create the zone's visual geometry as a sub-component in `IslandEnvironment.tsx` and render it inside the main component.

3. Add structure colliders for any solid objects in `src/scene/PlayerController.tsx` in the `STRUCTURE_COLLIDERS` array. Use the `zp()` helper for zone-relative positioning:

```ts
{ ...zp("newzone", 0, 0), radius: 2.0 },
```

### Add a New Structure Collider

Structure colliders are circles checked against the player position every frame. Add to the `STRUCTURE_COLLIDERS` array in `src/scene/PlayerController.tsx`:

```ts
{ cx: number, cz: number, radius: number }
```

Use the `zp(zoneName, dx, dz)` helper to position relative to a zone centre:

```ts
// Collider 2 units east and 1 unit south of the garden centre
{ ...zp("garden", 2.0, 1.0), radius: 1.5 },
```

### Add a New Event Type

1. Add the new type to the `EventType` union in `src/characters/CharacterData.ts`:

```ts
export type EventType = 'challenge' | 'date' | 'social' | 'arrival' | 'drama' | 'your_new_type';
```

2. Add generation logic in `src/systems/events.ts`:
   - Add an energy cost mapping in the `eventEnergyCost` function.
   - Add location options in the `EVENT_LOCATIONS` record.
   - Add event generation logic where events are built.

3. Add UI handling in `src/game/GameLoop.tsx` and `src/game/Game.tsx` so the game knows how to present and resolve the new event type.

### Replace Placeholder Models with GLB

The prototype uses primitive Three.js geometry (boxes, spheres, cylinders). To swap in real models:

1. Place the `.glb` file in the `public/` directory (e.g. `public/models/palm_tree.glb`).
2. Use drei's `useGLTF` in the component:

```tsx
import { useGLTF } from '@react-three/drei';

function PalmTree({ position }: { position: [number, number, number] }) {
  const { scene } = useGLTF('/models/palm_tree.glb');
  return <primitive object={scene.clone()} position={position} />;
}
```

3. For models used many times, consider drei's `<Instances>` or `<Merged>` for draw call batching.
4. Preload with `useGLTF.preload('/models/palm_tree.glb')` at module level.

---

## 5. Known Issues and Limitations

- **Joystick vs keyboard listeners:** The virtual joystick writes directly to `joystickInputRef`. Synthetic `dispatchEvent` calls do NOT trigger the module-level `keydown` listeners in `PlayerController.tsx` -- only real user keyboard input works for WASD. The two input methods are independent.
- **No save/load system.** All game state resets on page reload.
- **Social events auto-complete.** Social events trigger NPC dialogue then immediately complete. They should have their own dedicated dialogue flow.
- **Nightly item drop positions are not structure-aware.** Nightly item drops may occasionally spawn inside structure colliders (buildings, fountains). Items are positioned with random offsets from zone centres and clamped to the island radius, but no structure collision check is performed on drop positions.
- **Date dialogue coverage.** Date-specific dialogues only exist for Rosie and Kiki. Other NPCs fall back to regular chat scripts.
- **Ceremony NPC logic.** The ceremony NPC decision doesn't account for existing NPC-to-NPC relationships when determining outcomes.
- **Audio system is stubbed.** Howler is installed but no actual audio files are loaded. The audio system is placeholder only.
- **AI API routes return mock data.** No Anthropic API integration yet. The API routes serve static/random mock responses.
- **New arrival event is non-functional.** The arrival event type exists but doesn't actually add a new NPC to the game world.
- **Collider approximations.** Structure colliders are circles. Box-shaped structures (like the Villa) use one or more circles to approximate their footprint. Some overlap/gaps are expected.
- **`next-env.d.ts` is auto-generated.** Next.js manages this file. Do not edit it manually.

---

## 6. Performance Notes

- **Target:** 60fps on desktop browsers.
- **Draw calls:** Keep under 100. Use drei's `<Instances>` or `<Merged>` for repeated props (palm trees, rocks, etc.). The island environment already uses instancing for some elements.
- **Structure collider checks** run every frame in `useFrame`. Keep `STRUCTURE_COLLIDERS` to a reasonable size (~50 entries max). Each check is an O(n) distance comparison.
- **Zustand selectors** are critical for performance. Always select individual values:

```ts
// This only triggers a re-render when `energy` changes
const energy = useBiometricStore(s => s.energy);
```

Never call a store hook with no selector (`useBiometricStore()`) -- it re-renders on every state change.

- **Module-level refs** (`playerPositionRef`, `joystickInputRef`) bypass React's reconciliation. Use them for data that changes every frame (positions, velocities, input state).
- **Dev toolbar** polls store state on a 500ms interval. This is fine for development but the toolbar should not ship in production.

---

## 7. Deployment

```bash
npm run build
```

Produces a production Next.js build. The project deploys to **Vercel**.

**No environment variables are needed** for the prototype. All API routes return mock data, so there is no Anthropic API key or other secrets to configure.

For Vercel deployment, push to the connected Git repository. Vercel auto-detects the Next.js framework and runs `npm run build`.

---

## Project Structure Reference

```
src/
  app/           -- Next.js app router pages and API routes
  characters/    -- Character definitions, roster, dialogue scripts
  dev/           -- Development tools (DevToolbar)
  game/          -- Game loop, constants, main Game component
  scene/         -- 3D scene: PlayerController, NPCController, IslandEnvironment
  store/         -- Zustand stores (biometric, game, player, relationship)
  systems/       -- Game systems: items, events, calendar
  ui/            -- UI components: VirtualJoystick, HUD, dialogue panels
  utils/         -- Utilities: ink dialogue engine, helpers
```

### Key Files

| File                              | Purpose                                          |
| --------------------------------- | ------------------------------------------------ |
| `src/game/constants.ts`           | All game balance numbers                         |
| `src/characters/roster.ts`        | NPC definitions (STARTING_CAST array)            |
| `src/characters/dialogueScripts.ts` | All dialogue trees                             |
| `src/characters/CharacterData.ts` | Type definitions for Character, GameEvent, etc.  |
| `src/scene/PlayerController.tsx`  | Player movement, WASD input, structure colliders |
| `src/scene/NPCController.tsx`     | NPC positioning and zone offsets                 |
| `src/scene/IslandEnvironment.tsx` | Island geometry and ZONE_POSITIONS               |
| `src/systems/items.ts`            | Item definitions (ITEM_DEFS)                     |
| `src/systems/events.ts`           | Event generation logic                           |
| `src/store/relationshipStore.ts`  | NPC relationship state                           |
| `src/store/biometricStore.ts`     | Biometric data and derived stats                 |
| `src/store/gameStore.ts`          | Game phase, day counter, events                  |
| `src/dev/DevToolbar.tsx`          | lil-gui dev panel                                |
| `src/scene/ItemPickups.tsx`       | 3D item pickup objects with glow and auto-collect |
| `src/ui/InventoryUI.tsx`          | Unlimited bag inventory grid UI                  |
| `src/ui/VirtualJoystick.tsx`      | Touch/mouse joystick input                       |
