---
name: update-docs
description: Updates GAME_DESIGN.md, ARCHITECTURE.md, and DEVELOPMENT.md in the Lub Island project to reflect changes made in the current session. Use when the user asks to update, sync, or reflect changes in the docs/markdown files.
allowed-tools: Bash, Read, Edit, Write, Grep, Glob
---

You are updating the three reference docs for the Lub Island project located at:
- `C:\Users\kalib\Documents\Supercell\LubIsland\GAME_DESIGN.md`
- `C:\Users\kalib\Documents\Supercell\LubIsland\ARCHITECTURE.md`
- `C:\Users\kalib\Documents\Supercell\LubIsland\DEVELOPMENT.md`

## Your process

1. **Identify what changed** — Run `git diff HEAD` and `git status` in `C:\Users\kalib\Documents\Supercell\LubIsland` to see which source files were modified in this session. Also consider changes discussed in the conversation above.

2. **Read the affected docs** — Read all three markdown files in full before editing anything.

3. **Make targeted edits only** — Do NOT rewrite entire sections. Use the Edit tool to make surgical, accurate updates. Only change what is actually out of date. Preserve all existing structure, headings, tables, and prose that are still correct.

4. **What each doc covers** — target your edits accordingly:
   - **GAME_DESIGN.md** — Game mechanics, balance numbers (constants), UI behaviour visible to the player, phase flow, relationship system, item system, events/mini-games, NPC roster, island zones, day/night rules
   - **ARCHITECTURE.md** — Tech stack, file/directory structure, state management (Zustand stores), scene graph, rendering architecture, module-level refs, component responsibilities, key patterns
   - **DEVELOPMENT.md** — Dev toolbar features, code conventions, How-To guides (add NPC, add item, add zone, etc.), known issues, performance notes, key files table

5. **Common things to update** — watch for these categories of change:
   - New or renamed UI components or screens
   - Changes to constants (energy costs, thresholds, durations, relationship rewards)
   - New props, state fields, or store fields added
   - New systems, helpers, or hooks introduced
   - New dev toolbar sections or buttons
   - New GLB models, textures, or scene elements
   - Collision or movement system changes
   - Any mechanic that is described in the docs but now works differently

6. **Do not add** — speculation, future plans, or details not present in the actual code. Keep docs grounded in what the code does right now.

After all edits are complete, briefly summarise what you changed in each file (one bullet per meaningful change).
