'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Island from '@/scene/Island';
import { useGameLoop } from './GameLoop';
import { useGameStore } from '@/store/gameStore';
import { useBiometricStore } from '@/store/biometricStore';
import { useRelationshipStore } from '@/store/relationshipStore';
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
import { canAfford } from '@/systems/energy';

export default function Game() {
  const gameStore = useGameStore();
  const bio = useBiometricStore();
  const relStore = useRelationshipStore();

  const {
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
    goToSleep,
    continueSleep,
    handleCeremonyChoice,
    continueCeremony,
    handleProducerPhone,
    dismissItemPopup,
  } = useGameLoop();

  const showFreeRoamUI = gameStore.phase === 'DAYTIME_FREE' || gameStore.phase === 'NIGHTTIME_FREE';

  // NPC speaker color map
  const getNPCColor = (npcId: string | null) => {
    const npc = STARTING_CAST.find(c => c.id === npcId);
    return npc?.colorPalette.primary || '#ffffff';
  };

  return (
    <div className="game-viewport" style={{ position: 'relative' }}>
      {/* 3D Scene */}
      <Canvas
        orthographic
        camera={{ zoom: 60, near: 0.1, far: 1000, position: [20, 20, 20] }}
        style={{ position: 'absolute', inset: 0 }}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <Island onNPCInteract={handleNPCInteract} />
        </Suspense>
      </Canvas>

      {/* UI Overlay Layer */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {/* HUD */}
        {showFreeRoamUI && (
          <div style={{ pointerEvents: 'auto' }}>
            <HUD />
          </div>
        )}

        {/* Virtual Joystick */}
        {showFreeRoamUI && !state.dialogueActive && (
          <div style={{ pointerEvents: 'auto' }}>
            <VirtualJoystick />
          </div>
        )}

        {/* Event trigger buttons - shown during daytime free roam */}
        {gameStore.phase === 'DAYTIME_FREE' && gameStore.eventsRemaining > 0 && !state.dialogueActive && (
          <div style={{
            pointerEvents: 'auto',
            position: 'absolute',
            bottom: '180px',
            right: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {state.dailyEvents.slice(0, gameStore.eventsRemaining).map((evt, i) => (
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
                {evt.type === 'challenge' ? '⚔️' : evt.type === 'date' ? '💕' : '🎉'} {evt.title}
              </button>
            ))}

            {/* Rest / Go to Night button */}
            <button
              onClick={goToSleep}
              className="game-button"
              style={{
                padding: '8px 12px',
                borderRadius: '12px',
                background: 'rgba(100,100,150,0.9)',
                color: 'white',
                border: 'none',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              😴 Rest (skip remaining)
            </button>
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
              🌙 Go to Sleep
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
              speakerColor={getNPCColor(state.currentNPCId)}
            />
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
              onSkip={skipEvent}
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
