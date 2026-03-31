'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useCallback, useEffect, useRef } from 'react';
import Island from '@/scene/Island';
import { useGameLoop } from './GameLoop';
import { useGameStore } from '@/store/gameStore';
import { useBiometricStore } from '@/store/biometricStore';
import { useRelationshipStore } from '@/store/relationshipStore';
import { usePlayerStore } from '@/store/playerStore';
import { STARTING_CAST } from '@/characters/roster';
import HUD from '@/ui/HUD';
import DialogueBox from '@/ui/DialogueBox';
import VirtualJoystick from '@/ui/VirtualJoystick';
import MainMenu from '@/ui/MainMenu';
import MorningBriefing from '@/ui/MorningBriefing';
import EventScreen from '@/ui/EventScreen';
import ChallengeUI from '@/ui/ChallengeUI';
import DateUI from '@/ui/DateUI';
import CeremonyUI from '@/ui/CeremonyUI';
import SleepTransition from '@/ui/SleepTransition';
import ItemPopup from '@/ui/ItemPopup';
import ProducerPhone from '@/ui/ProducerPhone';
import InventoryUI from '@/ui/InventoryUI';
import { canAfford } from '@/systems/energy';
import { cameraAngleRef } from '@/scene/IsometricCamera';
import { playerPositionRef } from '@/scene/PlayerController';
import { npcPositionsRef } from '@/scene/NPCController';
import { PLAYER } from '@/game/constants';

export default function Game() {
  const gameStore = useGameStore();
  const bio = useBiometricStore();
  const relStore = useRelationshipStore();
  const playerStore = usePlayerStore();

  const {
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
    openInventory,
    closeInventory,
    handleUseItem,
    handleGiftItem,
    handleItemPickup,
  } = useGameLoop();

  const showFreeRoamUI = gameStore.phase === 'DAYTIME_FREE' || gameStore.phase === 'NIGHTTIME_FREE';

  // NPC speaker colour map – bright enough to read on the dark dialogue box
  const NPC_DIALOGUE_COLORS: Record<string, string> = {
    rosie:    '#F4A6C0',
    blaze:    '#FF8C42',
    pudge:    '#D4A574',
    kiki:     '#C8A8E8',
    sprocket: '#FFD866',
    lily:     '#7ED67E',
  };

  const getNPCColor = (npcId: string | null) => {
    if (!npcId) return '#ffffff';
    return NPC_DIALOGUE_COLORS[npcId] ?? '#ffffff';
  };

  // ---------------------------------------------------------------------------
  // Pinch-to-zoom → camera angle
  // ---------------------------------------------------------------------------
  const viewportRef = useRef<HTMLDivElement>(null);
  const lastPinchDist = useRef<number | null>(null);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    function getTouchDist(e: TouchEvent) {
      const [a, b] = [e.touches[0], e.touches[1]];
      const dx = a.clientX - b.clientX;
      const dy = a.clientY - b.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length === 2) {
        lastPinchDist.current = getTouchDist(e);
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (e.touches.length !== 2 || lastPinchDist.current === null) return;
      const dist = getTouchDist(e);
      const delta = dist - lastPinchDist.current;
      cameraAngleRef.current = Math.max(0, Math.min(100,
        cameraAngleRef.current - delta * 0.5,
      ));
      lastPinchDist.current = dist;
    }

    function onTouchEnd() {
      lastPinchDist.current = null;
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd);
    el.addEventListener('touchcancel', onTouchEnd);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Auto-cancel dialogue when player walks away from NPC
  // ---------------------------------------------------------------------------
  const cancelDialogueRef = useRef(cancelDialogue);
  cancelDialogueRef.current = cancelDialogue;
  const dialogueNpcIdRef = useRef(state.currentNPCId);
  dialogueNpcIdRef.current = state.currentNPCId;
  const dialogueActiveRef = useRef(state.dialogueActive);
  dialogueActiveRef.current = state.dialogueActive;

  useEffect(() => {
    const LEAVE_RADIUS = PLAYER.INTERACTION_RADIUS * 2; // a bit more than interaction radius
    const interval = setInterval(() => {
      if (!dialogueActiveRef.current || !dialogueNpcIdRef.current) return;
      const npcPos = npcPositionsRef.current[dialogueNpcIdRef.current];
      if (!npcPos) return;
      const dx = playerPositionRef.current.x - npcPos[0];
      const dz = playerPositionRef.current.z - npcPos[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist > LEAVE_RADIUS) {
        cancelDialogueRef.current();
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Get giftable items for dialogue
  const giftableItems = state.dialogueActive ? playerStore.getGiftableItems() : [];

  return (
    <div ref={viewportRef} className="game-viewport" style={{ position: 'relative' }}>
      {/* 3D Scene */}
      <Canvas
        shadows
        orthographic
        camera={{ zoom: 60, near: 0.1, far: 1000, position: [20, 20, 20] }}
        style={{ position: 'absolute', inset: 0 }}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <Island
            onNPCInteract={handleNPCInteract}
            droppedItems={state.droppedItems}
            onItemPickup={handleItemPickup}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlay Layer */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {/* HUD */}
        {showFreeRoamUI && (
          <div style={{ pointerEvents: 'auto' }}>
            <HUD onOpenInventory={openInventory} />
          </div>
        )}

        {/* Virtual Joystick */}
        {showFreeRoamUI && !state.dialogueActive && (
          <div style={{ pointerEvents: 'auto' }}>
            <VirtualJoystick />
          </div>
        )}

        {/* Event trigger buttons - shown during daytime free roam */}
        {gameStore.phase === 'DAYTIME_FREE' && !state.dialogueActive && (
          <div style={{
            pointerEvents: 'auto',
            position: 'absolute',
            bottom: '180px',
            right: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {gameStore.eventsRemaining > 0 && state.dailyEvents.slice(0, gameStore.eventsRemaining).map((evt, i) => (
              <button
                key={evt.id}
                onClick={() => triggerEvent(state.dailyEvents.length - gameStore.eventsRemaining + i)}
                className="game-button"
                style={{
                  padding: '8px 12px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.9)',
                  border: '2px solid #f59e0b',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
              >
                {evt.type === 'challenge' ? '\u2694\uFE0F' : evt.type === 'date' ? '\u{1F495}' : '\u{1F389}'} {evt.title}
              </button>
            ))}

            {/* Rest / Go to Night — only available after all events are done */}
            {gameStore.eventsRemaining <= 0 && (
              <button
                onClick={goToSleep}
                className="game-button"
                style={{
                  padding: '10px 20px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #4c1d95, #6d28d9)',
                  color: 'white',
                  border: '2px solid #8b5cf6',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 2px 12px rgba(139,92,246,0.4)',
                }}
              >
                {"\u{1F319}"} Advance to Night
              </button>
            )}
          </div>
        )}

        {/* Night time - go to sleep button */}
        {gameStore.phase === 'NIGHTTIME_FREE' && !state.dialogueActive && (
          <div style={{ pointerEvents: 'auto', position: 'absolute', bottom: '180px', right: '12px' }}>
            <button
              onClick={goToSleep}
              className="game-button"
              style={{
                padding: '10px 20px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
                color: 'white',
                border: '2px solid #6366f1',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 12px rgba(99,102,241,0.4)',
              }}
            >
              {"\u{1F319}"} Go to Sleep
            </button>
          </div>
        )}

        {/* Dialogue Box */}
        {state.dialogueActive && state.currentLine && (
          <div style={{ pointerEvents: 'auto' }}>
            <DialogueBox
              line={state.currentLine}
              onChoice={handleDialogueChoice}
              onAdvance={handleDialogueAdvance}
              onCancel={cancelDialogue}
              speakerColor={getNPCColor(state.currentNPCId)}
              giftableItems={giftableItems}
              onGift={handleGiftItem}
            />
          </div>
        )}

        {/* Inventory */}
        {state.showInventory && (
          <div style={{ pointerEvents: 'auto' }}>
            <InventoryUI onClose={closeInventory} onUseItem={handleUseItem} />
          </div>
        )}

        {/* Main Menu */}
        {state.showMainMenu && (
          <div style={{ pointerEvents: 'auto' }}>
            <MainMenu onStart={startGame} />
          </div>
        )}

        {/* Morning Briefing */}
        {state.showMorningBriefing && (
          <div style={{ pointerEvents: 'auto' }}>
            <MorningBriefing
              day={gameStore.day}
              week={gameStore.week}
              energy={bio.energy}
              charm={bio.charm}
              performance={bio.performance}
              events={state.briefingEvents}
              onContinue={continueMorning}
            />
          </div>
        )}

        {/* Event Screen */}
        {state.showEventScreen && state.currentEvent && (
          <div style={{ pointerEvents: 'auto' }}>
            <EventScreen
              eventType={state.currentEvent.type}
              eventTitle={state.currentEvent.title}
              eventDescription={state.currentEvent.description}
              energyCost={state.currentEvent.energyCost}
              onStart={() => handleStartEvent(state.currentEvent!)}
              onClose={closeEventScreen}
              canAfford={canAfford(bio.energy, state.currentEvent.energyCost)}
            />
          </div>
        )}

        {/* Challenge UI */}
        {state.showChallengeUI && (
          <div style={{ pointerEvents: 'auto' }}>
            <ChallengeUI
              performance={bio.performance}
              onComplete={handleChallengeComplete}
            />
          </div>
        )}

        {/* Date UI */}
        {state.showDateUI && (
          <div style={{ pointerEvents: 'auto' }}>
            <DateUI
              npcId={state.dateNPCId}
              npcName={state.dateNPCName}
              onComplete={handleDateComplete}
            />
          </div>
        )}

        {/* Ceremony UI */}
        {state.showCeremonyUI && (
          <div style={{ pointerEvents: 'auto' }}>
            <CeremonyUI
              cast={activeCast}
              relationships={relStore.relationships}
              onChoosePartner={handleCeremonyChoice}
              phase={state.ceremonyPhase}
              results={state.ceremonyResults}
              eliminated={state.eliminatedThisCeremony}
              onContinue={continueCeremony}
            />
          </div>
        )}

        {/* Sleep Transition */}
        {state.showSleepTransition && (
          <div style={{ pointerEvents: 'auto' }}>
            <SleepTransition
              day={gameStore.day}
              onContinue={continueSleep}
            />
          </div>
        )}

        {/* Producer Phone */}
        {state.showProducerPhone && (
          <div style={{ pointerEvents: 'auto' }}>
            <ProducerPhone
              onChooseEvent={handleProducerPhone}
              onClose={() => {}}
            />
          </div>
        )}

        {/* Item Popup */}
        {state.showItemPopup && (
          <div style={{ pointerEvents: 'auto' }}>
            <ItemPopup
              itemName={state.itemPopupName}
              itemDescription={state.itemPopupDesc}
              onDismiss={dismissItemPopup}
            />
          </div>
        )}
      </div>
    </div>
  );
}
