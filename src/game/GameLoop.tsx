'use client';

import { useCallback, useMemo, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { usePlayerStore } from '@/store/playerStore';
import { useBiometricStore } from '@/store/biometricStore';
import { useRelationshipStore } from '@/store/relationshipStore';
import { STARTING_CAST } from '@/characters/roster';
import { generateDailyEvents } from '@/systems/events';
import { canAfford } from '@/systems/energy';
import { calculateNPCChoice } from '@/systems/relationships';
import { getDialogueForNPC, getDramaDialogueForNPC, markDialogueSeen, resetSeenDialogues, advanceNPCDialogue, resetNPCDialogueProgress } from '@/characters/dialogueScripts';
import { DialogueRunner, DialogueLine } from '@/utils/ink';
import { ENERGY_COSTS, PROD_ENERGY } from '@/game/constants';
import { EventType, GameEvent, ItemDef } from '@/characters/CharacterData';
import { getRelationshipReward } from '@/systems/challenge';
import { generateNightlyDrops, DroppedItem } from '@/systems/items';
import { ZONE_POSITIONS } from '@/scene/IslandEnvironment';
import { playerPositionRef } from '@/scene/PlayerController';
import { npcPositionsRef } from '@/scene/NPCController';

// All the state the game loop manages
export interface GameLoopState {
  // Daily events
  dailyEvents: GameEvent[];
  currentEvent: GameEvent | null;

  // Dialogue
  dialogueActive: boolean;
  currentDialogue: DialogueRunner | null;
  currentLine: DialogueLine | null;
  currentNPCId: string | null;
  currentScriptId: string | null;

  // Event screens
  showEventScreen: boolean;
  showChallengeUI: boolean;
  showDateUI: boolean;
  showCeremonyUI: boolean;
  showSleepTransition: boolean;
  showMorningBriefing: boolean;
  showMainMenu: boolean;
  showProducerPhone: boolean;
  showItemPopup: boolean;
  showInventory: boolean;

  // Item popup
  itemPopupName: string;
  itemPopupDesc: string;

  // Dropped items in world
  droppedItems: DroppedItem[];
  nightDropsOriginal: DroppedItem[];

  // Ceremony
  ceremonyPhase: 'choosing' | 'results' | 'departure' | 'demo_end';
  ceremonyResults: { npcId: string; partnerId: string | null }[];
  eliminatedThisCeremony: string[];

  // Challenge
  challengeNPCId: string;
  challengeNPCName: string;

  // Date
  dateNPCId: string;
  dateNPCName: string;

  // Briefing
  briefingEvents: string[];

  // Producer phone choice for next day
  producerChoice: EventType | null;
}

/** Module-level ref so DevToolbar can read active drops without prop drilling */
export const droppedItemsRef: { current: DroppedItem[] } = { current: [] };

/** Called by DevToolbar's Advance to Night button to also spawn drops */
export const triggerNightSpawnRef: { current: (() => void) | null } = { current: null };

export function useGameLoop() {
  const gameStore = useGameStore();
  const playerStore = usePlayerStore();
  const bio = useBiometricStore();
  const relStore = useRelationshipStore();

  const [state, setState] = useState<GameLoopState>({
    dailyEvents: [],
    currentEvent: null,
    dialogueActive: false,
    currentDialogue: null,
    currentLine: null,
    currentNPCId: null,
    currentScriptId: null,
    showEventScreen: false,
    showChallengeUI: false,
    showDateUI: false,
    showCeremonyUI: false,
    showSleepTransition: false,
    showMorningBriefing: false,
    showMainMenu: true,
    showProducerPhone: false,
    showItemPopup: false,
    showInventory: false,
    itemPopupName: '',
    itemPopupDesc: '',
    droppedItems: [],
    nightDropsOriginal: [],
    ceremonyPhase: 'choosing',
    ceremonyResults: [],
    eliminatedThisCeremony: [],
    challengeNPCId: '',
    challengeNPCName: '',
    dateNPCId: '',
    dateNPCName: '',
    briefingEvents: [],
    producerChoice: null,
  });


  // Get active (non-eliminated) cast
  const activeCast = useMemo(() =>
    STARTING_CAST.filter(c => !relStore.eliminated.includes(c.id)),
    [relStore.eliminated]
  );

  // ---------------------------------------------------------------------------
  // Inventory
  // ---------------------------------------------------------------------------

  const openInventory = useCallback(() => {
    setState(s => ({ ...s, showInventory: true }));
  }, []);

  const closeInventory = useCallback(() => {
    setState(s => ({ ...s, showInventory: false }));
  }, []);

  /** Handle "use" from the inventory UI */
  const handleUseItem = useCallback((item: ItemDef) => {
    switch (item.id) {
      case 'chocolate': {
        // Eat — restore energy
        playerStore.removeItem(item.id);
        useBiometricStore.setState((s) => ({ energy: Math.min(100, s.energy + 25) }));
        setState(s => ({
          ...s,
          showInventory: false,
          showItemPopup: true,
          itemPopupName: 'Yum!',
          itemPopupDesc: 'You ate the chocolate and restored 25 energy.',
        }));
        break;
      }
      case 'book': {
        playerStore.removeItem(item.id);
        playerStore.addPerformanceBoost(15);
        setState(s => ({
          ...s,
          showInventory: false,
          showItemPopup: true,
          itemPopupName: 'Good Read!',
          itemPopupDesc: 'Reading the book boosted your performance by 15 for today.',
        }));
        break;
      }
      case 'sunglasses': {
        playerStore.removeItem(item.id);
        playerStore.addPerformanceBoost(10);
        setState(s => ({
          ...s,
          showInventory: false,
          showItemPopup: true,
          itemPopupName: 'Looking Cool!',
          itemPopupDesc: 'Wearing sunglasses boosted your performance by 10 for today.',
        }));
        break;
      }
      case 'producer_phone': {
        playerStore.removeItem(item.id);
        setState(s => ({
          ...s,
          showInventory: false,
          showProducerPhone: true,
        }));
        break;
      }
      default: {
        // Character journals
        if (item.id.startsWith('journal_') && item.ownerNpcId) {
          const npc = STARTING_CAST.find(c => c.id === item.ownerNpcId);
          const npcName = npc?.name ?? 'someone';
          playerStore.unlockJournal(item.ownerNpcId);
          setState(s => ({
            ...s,
            showInventory: false,
            showItemPopup: true,
            itemPopupName: `${npcName}'s Secrets`,
            itemPopupDesc: `You read ${npcName}'s private journal. A special dialogue option is now unlocked when you speak with them!`,
          }));
          // Journal is NOT consumed — stays in inventory until end of day
        }
        break;
      }
    }
  }, [playerStore]);

  // ---------------------------------------------------------------------------
  // Gifting during dialogue
  // ---------------------------------------------------------------------------

  const handleGiftItem = useCallback((item: ItemDef) => {
    if (!state.currentNPCId) return;

    const npcId = state.currentNPCId;
    const npc = STARTING_CAST.find(c => c.id === npcId);
    const npcName = npc?.name ?? 'them';

    // Remove item from inventory
    playerStore.removeItem(item.id);

    // Boost relationship
    relStore.changeRelationship(npcId, item.giftValue);

    // Show a gift response line
    const responseLine: DialogueLine = {
      text: `*${npcName} looks delighted!* "Oh wow, ${item.name}?! That's so thoughtful of you!" (+${item.giftValue} relationship)`,
      speaker: npcName,
      choices: [],
    };

    setState(s => ({ ...s, currentLine: responseLine }));
  }, [state.currentNPCId, playerStore, relStore]);

  // ---------------------------------------------------------------------------
  // Item pickups from world
  // ---------------------------------------------------------------------------

  const handleItemPickup = useCallback((dropId: string) => {
    // Read from the module-level ref (always in sync) to avoid
    // depending on state.droppedItems and recreating this callback.
    const drop = droppedItemsRef.current.find(d => d.dropId === dropId);
    if (!drop) return;

    playerStore.addItem(drop.item);

    // Remove from drops by unique ID
    droppedItemsRef.current = droppedItemsRef.current.filter(d => d.dropId !== dropId);
    setState(s => ({
      ...s,
      droppedItems: s.droppedItems.filter(d => d.dropId !== dropId),
      showItemPopup: true,
      itemPopupName: `Found: ${drop.item.name}`,
      itemPopupDesc: drop.item.description,
    }));
  }, [playerStore]);

  // ---------------------------------------------------------------------------
  // Game flow
  // ---------------------------------------------------------------------------

  // Start game from main menu
  const startGame = useCallback(() => {
    resetNPCDialogueProgress();
    gameStore.setPhase('MORNING_BRIEFING');
    const events = generateDailyEvents(gameStore.day, gameStore.week, activeCast);
    const briefingEvents = events.map(e => e.title);

    setState(s => ({
      ...s,
      showMainMenu: false,
      showMorningBriefing: true,
      dailyEvents: events,
      briefingEvents,
    }));
  }, [gameStore, activeCast]);

  // Continue from morning briefing
  const continueMorning = useCallback(() => {
    gameStore.setPhase('DAYTIME_FREE');
    setState(s => ({ ...s, showMorningBriefing: false }));
  }, [gameStore]);

  // NPC interaction - start dialogue
  const handleNPCInteract = useCallback((npcId: string) => {
    if (state.dialogueActive) return;

    const npc = STARTING_CAST.find(c => c.id === npcId);
    if (!npc) return;

    // Check energy cost
    const isNight = gameStore.isNight;
    const cost = isNight ? ENERGY_COSTS.TALK_NPC_NIGHT : ENERGY_COSTS.TALK_NPC_DAY;

    if (cost > 0 && !canAfford(bio.energy, cost)) {
      setState(s => ({
        ...s,
        showItemPopup: true,
        itemPopupName: "Too tired...",
        itemPopupDesc: "You're too tired for this right now. Better sleep boosts energy!",
      }));
      return;
    }

    // Spend energy
    if (cost > 0 && !PROD_ENERGY) {
      useBiometricStore.setState({ energy: Math.max(0, bio.energy - cost) });
    }

    const relationship = relStore.getRelationship(npcId);
    const script = getDialogueForNPC(npcId, relationship);

    const runner = new DialogueRunner(script, {
      charm: bio.charm,
      energy: bio.energy,
      performance: bio.performance + playerStore.performanceBoostToday,
      player_charm: bio.charm,
      player_energy: bio.energy,
      player_performance: bio.performance + playerStore.performanceBoostToday,
      relationship_level: relationship,
      // Journal unlock flag
      journal_unlocked: playerStore.isJournalUnlocked(npcId) ? 1 : 0,
    });

    const line = runner.getCurrentLine();

    setState(s => ({
      ...s,
      dialogueActive: true,
      currentDialogue: runner,
      currentLine: line,
      currentNPCId: npcId,
      currentScriptId: script.id,
    }));
  }, [state.dialogueActive, gameStore, bio, relStore, playerStore]);

  // Dialogue choice selected
  const handleDialogueChoice = useCallback((index: number) => {
    if (!state.currentDialogue) return;

    const success = state.currentDialogue.selectChoice(index);
    if (!success) return;

    // Apply relationship changes from the dialogue runner's variables
    if (state.currentNPCId) {
      const relChange = state.currentDialogue.getVariable('relationship_level') -
        relStore.getRelationship(state.currentNPCId);
      if (relChange !== 0) {
        relStore.changeRelationship(state.currentNPCId, relChange);
      }
    }

    const line = state.currentDialogue.getCurrentLine();
    if (!line || state.currentDialogue.isComplete()) {
      if (state.currentScriptId) markDialogueSeen(state.currentScriptId);
      if (state.currentNPCId) advanceNPCDialogue(state.currentNPCId);
      setState(s => ({
        ...s,
        dialogueActive: false,
        currentDialogue: null,
        currentLine: null,
        currentNPCId: null,
        currentScriptId: null,
      }));
      return;
    }

    setState(s => ({ ...s, currentLine: line }));
  }, [state.currentDialogue, state.currentNPCId, state.currentScriptId, relStore]);

  // Cancel dialogue (close button or walked away)
  const cancelDialogue = useCallback(() => {
    if (!state.dialogueActive) return;
    setState(s => ({
      ...s,
      dialogueActive: false,
      currentDialogue: null,
      currentLine: null,
      currentNPCId: null,
      currentScriptId: null,
    }));
  }, [state.dialogueActive]);

  // Dialogue advance (no choices, just tap to continue)
  const handleDialogueAdvance = useCallback(() => {
    if (!state.currentDialogue) return;

    const canAdvance = state.currentDialogue.advance();
    if (!canAdvance) {
      if (state.currentNPCId) {
        const relChange = state.currentDialogue.getVariable('relationship_level') -
          relStore.getRelationship(state.currentNPCId);
        if (relChange !== 0) {
          relStore.changeRelationship(state.currentNPCId, relChange);
        }
        advanceNPCDialogue(state.currentNPCId);
      }
      setState(s => ({
        ...s,
        dialogueActive: false,
        currentDialogue: null,
        currentLine: null,
        currentNPCId: null,
      }));
      return;
    }

    const line = state.currentDialogue.getCurrentLine();
    setState(s => ({ ...s, currentLine: line }));
  }, [state.currentDialogue, state.currentNPCId, relStore]);

  // Start an event
  const handleStartEvent = useCallback((event: GameEvent) => {
    if (!canAfford(bio.energy, event.energyCost)) return;

    if (!PROD_ENERGY) {
      useBiometricStore.setState({ energy: Math.max(0, bio.energy - event.energyCost) });
    }
    gameStore.startEvent(event.type);

    // If player is inside the villa, exit first — all NPCs are outdoors
    if (gameStore.isIndoors) {
      gameStore.exitVilla();
    }

    setState(s => ({ ...s, currentEvent: event, showEventScreen: false }));

    if (event.type === 'challenge') {
      const partner = activeCast[Math.floor(Math.random() * activeCast.length)];
      setState(s => ({
        ...s,
        showChallengeUI: true,
        challengeNPCId: partner?.id ?? '',
        challengeNPCName: partner?.name ?? '',
      }));
    } else if (event.type === 'date') {
      const npc = activeCast.find(c => event.involvedNPCs.includes(c.id));
      const dateNpc = npc || activeCast[0];
      // Teleport the player next to the date NPC
      if (dateNpc) {
        const npcPos = npcPositionsRef.current[dateNpc.id];
        if (npcPos) {
          playerPositionRef.current.set(npcPos[0] + 1.5, 0, npcPos[2]);
        }
      }
      setState(s => ({
        ...s,
        showDateUI: true,
        dateNPCId: dateNpc?.id || '',
        dateNPCName: dateNpc?.name || 'Someone',
      }));
    } else {
      const npc = activeCast.find(c => event.involvedNPCs.includes(c.id));
      if (npc) {
        // Teleport the player next to the NPC before starting the dialogue
        const npcPos = npcPositionsRef.current[npc.id];
        if (npcPos) {
          const offsetX = 1.5;
          playerPositionRef.current.set(npcPos[0] + offsetX, 0, npcPos[2]);
        }

        if (event.type === 'drama') {
          // Drama events use drama-specific dialogue scripts
          const relationship = relStore.getRelationship(npc.id);
          const script = getDramaDialogueForNPC(npc.id, relationship);
          const runner = new DialogueRunner(script, {
            charm: bio.charm,
            energy: bio.energy,
            performance: bio.performance + playerStore.performanceBoostToday,
            player_charm: bio.charm,
            player_energy: bio.energy,
            player_performance: bio.performance + playerStore.performanceBoostToday,
            relationship_level: relationship,
            journal_unlocked: playerStore.isJournalUnlocked(npc.id) ? 1 : 0,
          });
          const line = runner.getCurrentLine();
          setState(s => ({
            ...s,
            dialogueActive: true,
            currentDialogue: runner,
            currentLine: line,
            currentNPCId: npc.id,
            currentScriptId: script.id,
          }));
        } else {
          // Social/arrival events use regular NPC chat dialogues
          handleNPCInteract(npc.id);
        }
      }
      setTimeout(() => {
        gameStore.completeEvent();
        setState(s => ({ ...s, currentEvent: null }));
      }, 500);
    }
  }, [bio, gameStore, activeCast, handleNPCInteract, relStore, playerStore]);

  // Show event screen for an event from the daily pool
  const triggerEvent = useCallback((eventIndex: number) => {
    const event = state.dailyEvents[eventIndex];
    if (!event) return;
    setState(s => ({ ...s, currentEvent: event, showEventScreen: true }));
  }, [state.dailyEvents]);

  // Close event screen without completing — player can re-open it later
  const closeEventScreen = useCallback(() => {
    setState(s => ({ ...s, showEventScreen: false, currentEvent: null }));
  }, []);

  // Challenge complete
  const handleChallengeComplete = useCallback((score: number, tier: string) => {
    const delta = getRelationshipReward(tier as 'bronze' | 'silver' | 'gold');
    setState(s => {
      if (s.challengeNPCId) {
        relStore.changeRelationship(s.challengeNPCId, delta);
      }
      return { ...s, showChallengeUI: false, currentEvent: null };
    });
    if (tier === 'gold') playerStore.incrementChallengesWon();
    gameStore.completeEvent();
  }, [relStore, playerStore, gameStore]);

  // Date complete
  const handleDateComplete = useCallback((chemistry: number) => {
    if (state.dateNPCId) {
      const bonus = chemistry >= 4 ? 20 : chemistry >= 2 ? 10 : -5;
      relStore.changeRelationship(state.dateNPCId, bonus);
    }
    playerStore.incrementDatesCompleted();
    gameStore.completeEvent();
    setState(s => ({ ...s, showDateUI: false, currentEvent: null, dateNPCId: '', dateNPCName: '' }));
  }, [state.dateNPCId, relStore, playerStore, gameStore]);

  // Spawn nightly drops — also assigned to triggerNightSpawnRef for dev toolbar
  const spawnNightlyDrops = useCallback(() => {
    const drops = generateNightlyDrops(ZONE_POSITIONS);
    droppedItemsRef.current = drops;
    setState(s => ({ ...s, droppedItems: drops, nightDropsOriginal: drops }));
  }, []);
  triggerNightSpawnRef.current = spawnNightlyDrops;

  // Go to sleep
  const goToSleep = useCallback(() => {
    // If transitioning to night (from daytime), spawn nightly item drops
    if (gameStore.phase === 'DAYTIME_FREE') {
      gameStore.advanceToNight();
      spawnNightlyDrops();
      return;
    }

    // From nighttime, go to actual sleep
    gameStore.setPhase('SLEEP_TRANSITION');
    setState(s => ({ ...s, showSleepTransition: true }));
  }, [gameStore]);

  // Continue from sleep - advance day
  const continueSleep = useCallback(() => {
    setState(s => ({ ...s, showSleepTransition: false }));

    // Reset daily state
    resetSeenDialogues();
    playerStore.clearDayBuffs();

    // Check if it's ceremony day next
    if (gameStore.day === 7) {
      gameStore.setPhase('CEREMONY');
      setState(s => ({ ...s, showCeremonyUI: true, ceremonyPhase: 'choosing' }));
      return;
    }

    gameStore.advanceDay();
    droppedItemsRef.current = [];
    const events = generateDailyEvents(gameStore.day + 1, gameStore.week, activeCast, state.producerChoice);
    const briefingEvents = events.map(e => e.title);
    setState(s => ({
      ...s,
      showMorningBriefing: true,
      dailyEvents: events,
      briefingEvents,
      producerChoice: null, // Clear after use
      droppedItems: [], // Clear leftover drops
      nightDropsOriginal: [],
    }));
  }, [gameStore, activeCast, playerStore, state.producerChoice]);

  // Ceremony - player chooses partner
  const handleCeremonyChoice = useCallback((npcId: string) => {
    relStore.setPartner('player', npcId);

    const results: { npcId: string; partnerId: string | null }[] = [
      { npcId: 'player', partnerId: npcId }
    ];

    const takenIds = new Set([npcId, 'player']);
    const sortedCast = [...activeCast].sort((a, b) => b.personality.confidence - a.personality.confidence);

    for (const npc of sortedCast) {
      if (npc.id === npcId) {
        results.push({ npcId: npc.id, partnerId: 'player' });
        continue;
      }

      const availableCandidates = activeCast.filter(c =>
        c.id !== npc.id && !takenIds.has(c.id)
      );

      if (availableCandidates.length === 0) {
        results.push({ npcId: npc.id, partnerId: null });
        continue;
      }

      const chosenId = calculateNPCChoice(npc, availableCandidates, relStore.relationships);
      results.push({ npcId: npc.id, partnerId: chosenId });
      takenIds.add(chosenId);
    }

    // Fix up: if more than 1 NPC ended up unpaired, pair extras together
    // so at most 1 is left without a partner each week.
    const unpairedFixup = results.filter(r => r.partnerId === null && r.npcId !== 'player');
    while (unpairedFixup.length >= 2) {
      const a = unpairedFixup.pop()!;
      const b = unpairedFixup.pop()!;
      const entryA = results.find(r => r.npcId === a.npcId)!;
      const entryB = results.find(r => r.npcId === b.npcId)!;
      entryA.partnerId = b.npcId;
      entryB.partnerId = a.npcId;
    }

    // Determine who gets eliminated — bias toward NPCs with the most
    // neutral relationships (lowest |relationship|). Strong feelings
    // (love or hate) keep you on the island.
    const unpaired = activeCast.filter(npc => {
      const hasPartner = results.find(r => r.npcId === npc.id && r.partnerId !== null);
      const wasChosen = results.some(r => r.partnerId === npc.id);
      return !hasPartner && !wasChosen;
    });

    // If nobody is naturally unpaired, force-eliminate the NPC with
    // the most neutral player relationship (lowest absolute value)
    let eliminated: string[];
    if (unpaired.length > 0) {
      // Only eliminate ONE — the most neutral (lowest |relationship|)
      unpaired.sort((a, b) =>
        Math.abs(relStore.relationships[a.id] ?? 0) - Math.abs(relStore.relationships[b.id] ?? 0)
      );
      eliminated = [unpaired[0].id];
    } else if (activeCast.length > 2) {
      // Pick the NPC with the weakest relationship (closest to 0)
      // Exclude the player's chosen partner
      const candidates = activeCast.filter(c => c.id !== npcId);
      candidates.sort((a, b) =>
        Math.abs(relStore.relationships[a.id] ?? 0) - Math.abs(relStore.relationships[b.id] ?? 0)
      );
      eliminated = [candidates[0].id];
    } else {
      eliminated = [];
    }

    eliminated.forEach(id => relStore.eliminate(id));

    setState(s => ({
      ...s,
      ceremonyPhase: 'results',
      ceremonyResults: results,
      eliminatedThisCeremony: eliminated,
    }));
  }, [activeCast, relStore]);

  // Continue from ceremony — handles results -> departure -> demo_end
  const continueCeremony = useCallback(() => {
    // From results phase, go to departure screen if anyone was eliminated
    if (state.ceremonyPhase === 'results' && state.eliminatedThisCeremony.length > 0) {
      setState(s => ({ ...s, ceremonyPhase: 'departure' }));
      return;
    }

    // From departure, show demo end screen
    if (state.ceremonyPhase === 'departure') {
      setState(s => ({ ...s, ceremonyPhase: 'demo_end' }));
      return;
    }

    // From demo end (or results with no eliminations), go back to main menu
    setState(s => ({
      ...s,
      showCeremonyUI: false,
      ceremonyPhase: 'choosing',
      ceremonyResults: [],
      eliminatedThisCeremony: [],
      showMainMenu: true,
    }));

    resetSeenDialogues();
    playerStore.clearDayBuffs();

    gameStore.advanceDay();
    const events = generateDailyEvents(1, gameStore.week + 1, activeCast, state.producerChoice);
    setState(s => ({
      ...s,
      showMorningBriefing: true,
      dailyEvents: events,
      briefingEvents: events.map(e => e.title),
      producerChoice: null,
      droppedItems: [],
    }));
  }, [gameStore, activeCast, playerStore, state.ceremonyPhase, state.eliminatedThisCeremony, state.producerChoice]);

  // Producer phone — store the choice so it's injected into next day's events
  const handleProducerPhone = useCallback((eventType: string) => {
    setState(s => ({ ...s, showProducerPhone: false, producerChoice: eventType as EventType }));
    setState(s => ({
      ...s,
      showItemPopup: true,
      itemPopupName: "Producer's Phone",
      itemPopupDesc: `Tomorrow will include a ${eventType} event!`,
    }));
  }, []);

  // Bed interaction inside the villa
  const handleBedInteract = useCallback((npcId: string, isSleeping: boolean) => {
    const npc = STARTING_CAST.find(c => c.id === npcId);
    const name = npc?.name ?? npcId;

    if (isSleeping) {
      setState(s => ({
        ...s,
        showItemPopup: true,
        itemPopupName: `${name}'s Bed`,
        itemPopupDesc: `${name} is fast asleep. Zzz...`,
      }));
    } else {
      setState(s => ({
        ...s,
        showItemPopup: true,
        itemPopupName: `${name}'s Bed`,
        itemPopupDesc: `This is where ${name} sleeps. The bed is currently empty.`,
      }));
    }
  }, []);

  // Dismiss item popup
  const dismissItemPopup = useCallback(() => {
    setState(s => ({ ...s, showItemPopup: false }));
  }, []);

  return {
    state,
    activeCast,
    startGame,
    continueMorning,
    handleNPCInteract,
    cancelDialogue,
    handleDialogueChoice,
    handleDialogueAdvance,
    triggerEvent,
    handleStartEvent,
    closeEventScreen,
    handleChallengeComplete,
    handleDateComplete,
    goToSleep,
    continueSleep,
    handleCeremonyChoice,
    continueCeremony,
    handleProducerPhone,
    dismissItemPopup,
    handleBedInteract,
    // Item system
    openInventory,
    closeInventory,
    handleUseItem,
    handleGiftItem,
    handleItemPickup,
  };
}
