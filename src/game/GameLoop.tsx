'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { usePlayerStore } from '@/store/playerStore';
import { useBiometricStore } from '@/store/biometricStore';
import { useRelationshipStore } from '@/store/relationshipStore';
import { STARTING_CAST } from '@/characters/roster';
import { generateDailyEvents } from '@/systems/events';
import { canAfford } from '@/systems/energy';
import { getDayType, getDayLabel } from '@/systems/calendar';
import { calculateNPCChoice } from '@/systems/relationships';
import { getDialogueForNPC } from '@/characters/dialogueScripts';
import { DATE_DIALOGUES } from '@/characters/dialogueScripts';
import { DialogueRunner, DialogueLine } from '@/utils/ink';
import { ENERGY_COSTS } from '@/game/constants';
import { GameEvent, Character } from '@/characters/CharacterData';
import { getScoreTier, getRelationshipReward } from '@/systems/challenge';

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

  // Item popup
  itemPopupName: string;
  itemPopupDesc: string;

  // Ceremony
  ceremonyPhase: 'choosing' | 'results';
  ceremonyResults: { npcId: string; partnerId: string | null }[];
  eliminatedThisCeremony: string[];

  // Date
  dateNPCId: string;
  dateNPCName: string;

  // Briefing
  briefingEvents: string[];
}

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
    showEventScreen: false,
    showChallengeUI: false,
    showDateUI: false,
    showCeremonyUI: false,
    showSleepTransition: false,
    showMorningBriefing: false,
    showMainMenu: true,
    showProducerPhone: false,
    showItemPopup: false,
    itemPopupName: '',
    itemPopupDesc: '',
    ceremonyPhase: 'choosing',
    ceremonyResults: [],
    eliminatedThisCeremony: [],
    dateNPCId: '',
    dateNPCName: '',
    briefingEvents: [],
  });

  // Get active (non-eliminated) cast
  const activeCast = useMemo(() =>
    STARTING_CAST.filter(c => !relStore.eliminated.includes(c.id)),
    [relStore.eliminated]
  );

  // Start game from main menu
  const startGame = useCallback(() => {
    gameStore.setPhase('MORNING_BRIEFING');
    const events = generateDailyEvents(gameStore.day, gameStore.week, activeCast);
    const dayType = getDayType(gameStore.day);
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
    if (cost > 0) {
      const newEnergy = bio.energy - cost;
      // We need to reflect this - for prototype, directly modify the computed stat
      // In production this would go through a proper energy system
      useBiometricStore.setState({ energy: Math.max(0, newEnergy) });
    }

    const relationship = relStore.getRelationship(npcId);
    const script = getDialogueForNPC(npcId, relationship);

    const runner = new DialogueRunner(script, {
      player_charm: bio.charm,
      player_energy: bio.energy,
      player_performance: bio.performance,
      relationship_level: relationship,
    });

    const line = runner.getCurrentLine();

    setState(s => ({
      ...s,
      dialogueActive: true,
      currentDialogue: runner,
      currentLine: line,
      currentNPCId: npcId,
    }));
  }, [state.dialogueActive, gameStore, bio, relStore]);

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
      // Dialogue ended
      setState(s => ({
        ...s,
        dialogueActive: false,
        currentDialogue: null,
        currentLine: null,
        currentNPCId: null,
      }));
      return;
    }

    setState(s => ({ ...s, currentLine: line }));
  }, [state.currentDialogue, state.currentNPCId, relStore]);

  // Dialogue advance (no choices, just tap to continue)
  const handleDialogueAdvance = useCallback(() => {
    if (!state.currentDialogue) return;

    const canAdvance = state.currentDialogue.advance();
    if (!canAdvance) {
      // Dialogue ended
      if (state.currentNPCId) {
        const relChange = state.currentDialogue.getVariable('relationship_level') -
          relStore.getRelationship(state.currentNPCId);
        if (relChange !== 0) {
          relStore.changeRelationship(state.currentNPCId, relChange);
        }
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

    useBiometricStore.setState({ energy: Math.max(0, bio.energy - event.energyCost) });
    gameStore.startEvent(event.type);

    setState(s => ({ ...s, currentEvent: event, showEventScreen: false }));

    if (event.type === 'challenge') {
      setState(s => ({ ...s, showChallengeUI: true }));
    } else if (event.type === 'date') {
      const npc = activeCast.find(c => event.involvedNPCs.includes(c.id));
      setState(s => ({
        ...s,
        showDateUI: true,
        dateNPCId: npc?.id || activeCast[0]?.id || '',
        dateNPCName: npc?.name || activeCast[0]?.name || 'Someone',
      }));
    } else {
      // Social event - just a dialogue
      const npc = activeCast.find(c => event.involvedNPCs.includes(c.id));
      if (npc) {
        handleNPCInteract(npc.id);
      }
      // Complete event after dialogue
      setTimeout(() => {
        gameStore.completeEvent();
        setState(s => ({ ...s, currentEvent: null }));
      }, 500);
    }
  }, [bio, gameStore, activeCast, handleNPCInteract]);

  // Show event screen for an event from the daily pool
  const triggerEvent = useCallback((eventIndex: number) => {
    const event = state.dailyEvents[eventIndex];
    if (!event) return;
    setState(s => ({ ...s, currentEvent: event, showEventScreen: true }));
  }, [state.dailyEvents]);

  // Skip an event
  const skipEvent = useCallback(() => {
    gameStore.completeEvent();
    setState(s => ({ ...s, showEventScreen: false, currentEvent: null }));
  }, [gameStore]);

  // Challenge complete
  const handleChallengeComplete = useCallback((score: number, tier: string) => {
    const reward = getRelationshipReward(tier as 'bronze' | 'silver' | 'gold');
    // Boost relationship with all active NPCs (they were "watching")
    activeCast.forEach(npc => {
      relStore.changeRelationship(npc.id, Math.round(reward * 0.5));
    });
    if (tier === 'gold') playerStore.incrementChallengesWon();

    gameStore.completeEvent();
    setState(s => ({ ...s, showChallengeUI: false, currentEvent: null }));
  }, [activeCast, relStore, playerStore, gameStore]);

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

  // Transition to night (called when events run out or player chooses to rest)
  const goToNight = useCallback(() => {
    gameStore.transitionToNight();
  }, [gameStore]);

  // Go to sleep
  const goToSleep = useCallback(() => {
    gameStore.setPhase('SLEEP_TRANSITION');
    setState(s => ({ ...s, showSleepTransition: true }));
  }, [gameStore]);

  // Continue from sleep - advance day
  const continueSleep = useCallback(() => {
    setState(s => ({ ...s, showSleepTransition: false }));

    // Check if it's ceremony day next
    if (gameStore.day === 7) {
      gameStore.setPhase('CEREMONY');
      setState(s => ({ ...s, showCeremonyUI: true, ceremonyPhase: 'choosing' }));
      return;
    }

    gameStore.advanceDay();
    const events = generateDailyEvents(gameStore.day + 1, gameStore.week, activeCast);
    const briefingEvents = events.map(e => e.title);
    setState(s => ({
      ...s,
      showMorningBriefing: true,
      dailyEvents: events,
      briefingEvents,
    }));
  }, [gameStore, activeCast]);

  // Ceremony - player chooses partner
  const handleCeremonyChoice = useCallback((npcId: string) => {
    // Player chose their partner
    relStore.setPartner('player', npcId);

    // NPCs choose their partners based on relationships
    const results: { npcId: string; partnerId: string | null }[] = [
      { npcId: 'player', partnerId: npcId }
    ];

    const takenIds = new Set([npcId, 'player']);

    // Each NPC picks in order of confidence (most confident first)
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

    // Find eliminated - NPCs with no partner
    const chosen = new Set(results.map(r => r.partnerId).filter(Boolean));
    const eliminated = activeCast
      .filter(npc => !chosen.has(npc.id) && !results.find(r => r.npcId === npc.id && r.partnerId !== null))
      .map(npc => npc.id);

    eliminated.forEach(id => relStore.eliminate(id));

    setState(s => ({
      ...s,
      ceremonyPhase: 'results',
      ceremonyResults: results,
      eliminatedThisCeremony: eliminated,
    }));
  }, [activeCast, relStore]);

  // Continue from ceremony results
  const continueCeremony = useCallback(() => {
    setState(s => ({
      ...s,
      showCeremonyUI: false,
      ceremonyPhase: 'choosing',
      ceremonyResults: [],
      eliminatedThisCeremony: [],
    }));

    gameStore.advanceDay(); // Moves to day 1 of next week
    const events = generateDailyEvents(1, gameStore.week + 1, activeCast);
    setState(s => ({
      ...s,
      showMorningBriefing: true,
      dailyEvents: events,
      briefingEvents: events.map(e => e.title),
    }));
  }, [gameStore, activeCast]);

  // Producer phone
  const handleProducerPhone = useCallback((eventType: string) => {
    setState(s => ({ ...s, showProducerPhone: false }));
    // For prototype: just show a confirmation
    setState(s => ({
      ...s,
      showItemPopup: true,
      itemPopupName: "Producer's Phone",
      itemPopupDesc: `Tomorrow's headline event will be: ${eventType}!`,
    }));
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
    handleDialogueChoice,
    handleDialogueAdvance,
    triggerEvent,
    handleStartEvent,
    skipEvent,
    handleChallengeComplete,
    handleDateComplete,
    goToNight,
    goToSleep,
    continueSleep,
    handleCeremonyChoice,
    continueCeremony,
    handleProducerPhone,
    dismissItemPopup,
  };
}
