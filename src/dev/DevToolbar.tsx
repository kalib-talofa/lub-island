'use client';

import { useEffect, useRef, useState } from 'react';
import GUI from 'lil-gui';
import { useBiometricStore } from '@/store/biometricStore';
import { useGameStore } from '@/store/gameStore';
import { useRelationshipStore } from '@/store/relationshipStore';
import { usePlayerStore } from '@/store/playerStore';
import { cameraAngleRef } from '@/scene/IsometricCamera';
import { ITEM_DEFS, JOURNAL_DEFS } from '@/systems/items';
import { droppedItemsRef, triggerNightSpawnRef } from '@/game/GameLoop';
import { playerPositionRef } from '@/scene/PlayerController';

export default function DevToolbar() {
  const [visible, setVisible] = useState(true);
  const guiRef = useRef<GUI | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || guiRef.current) return;

    const gui = new GUI({ container: containerRef.current, title: '🏝️ Lub Island Dev Tools' });
    guiRef.current = gui;
    gui.domElement.style.width = '100%';

    // Biometric controls
    const bioFolder = gui.addFolder('🏋️ Biometric Data');
    const bioState = useBiometricStore.getState();
    const bioProxy = {
      sleepHours: bioState.sleepHours,
      sleepQuality: bioState.sleepQuality,
      activeMinutes: bioState.activeMinutes,
      stepCount: bioState.stepCount,
      godMode: bioState.godMode,
      energy: bioState.energy,
      charm: bioState.charm,
      performance: bioState.performance,
    };

    bioFolder.add(bioProxy, 'sleepHours', 0, 12, 0.5).name('Sleep Hours').onChange((v: number) => {
      useBiometricStore.getState().setSleepHours(v);
    });
    bioFolder.add(bioProxy, 'sleepQuality', 0, 100, 1).name('Sleep Quality').onChange((v: number) => {
      useBiometricStore.getState().setSleepQuality(v);
    });
    bioFolder.add(bioProxy, 'activeMinutes', 0, 180, 1).name('Active Minutes').onChange((v: number) => {
      useBiometricStore.getState().setActiveMinutes(v);
    });
    bioFolder.add(bioProxy, 'stepCount', 0, 30000, 100).name('Step Count').onChange((v: number) => {
      useBiometricStore.getState().setStepCount(v);
    });
    bioFolder.add(bioProxy, 'godMode').name('⚡ God Mode').onChange((v: boolean) => {
      useBiometricStore.getState().setGodMode(v);
    });

    // Computed stats (read-only display)
    const statsFolder = gui.addFolder('📊 Computed Stats');
    const energyCtrl = statsFolder.add(bioProxy, 'energy', 0, 100).name('Energy').disable();
    const charmCtrl = statsFolder.add(bioProxy, 'charm', 0, 100).name('Charm').disable();
    const perfCtrl = statsFolder.add(bioProxy, 'performance', 0, 100).name('Performance').disable();

    // Game controls
    const gameFolder = gui.addFolder('🎮 Game Controls');
    const gameState = useGameStore.getState();
    const gameProxy = {
      day: gameState.day,
      eventsRemaining: gameState.eventsRemaining,
      phase: gameState.phase,
    };

    const dayCtrl = gameFolder.add(gameProxy, 'day').name('Current Day').disable();
    const eventsCtrl = gameFolder.add(gameProxy, 'eventsRemaining').name('Events Left').disable();
    const phaseCtrl = gameFolder.add(gameProxy, 'phase').name('Phase').disable();

    gameFolder.add({ advanceToNight: () => { useGameStore.getState().advanceToNight(); triggerNightSpawnRef.current?.(); } }, 'advanceToNight').name('🌙 Advance to Night');
    gameFolder.add({ advanceDay: () => useGameStore.getState().advanceDay() }, 'advanceDay').name('☀️ Advance to Next Day');
    gameFolder.add({ advanceToCeremony: () => useGameStore.getState().advanceToCeremony() }, 'advanceToCeremony').name('🏛️ Advance to Ceremony');
    gameFolder.add({ resetWeek: () => useGameStore.getState().resetWeek() }, 'resetWeek').name('🔄 Reset Week');

    // Camera angle slider
    const cameraFolder = gui.addFolder('📷 Camera');
    const cameraProxy = { angle: cameraAngleRef.current };
    cameraFolder.add(cameraProxy, 'angle', 0, 100, 1).name('Camera Angle').onChange((v: number) => {
      cameraAngleRef.current = v;
    });

    // Items - add any item to inventory
    const itemsFolder = gui.addFolder('🎒 Items');
    itemsFolder.close(); // start collapsed

    // Regular items
    const regularFolder = itemsFolder.addFolder('Regular Items');
    ITEM_DEFS.forEach(item => {
      regularFolder.add(
        { [`add_${item.id}`]: () => usePlayerStore.getState().addItem(item) },
        `add_${item.id}`,
      ).name(`+ ${item.name}`);
    });

    // Journals
    const journalFolder = itemsFolder.addFolder('Character Journals');
    JOURNAL_DEFS.forEach(item => {
      journalFolder.add(
        { [`add_${item.id}`]: () => usePlayerStore.getState().addItem(item) },
        `add_${item.id}`,
      ).name(`+ ${item.name}`);
    });

    // Clear inventory
    itemsFolder.add(
      { clear: () => usePlayerStore.setState({ inventory: [] }) },
      'clear',
    ).name('🗑️ Clear Inventory');

    // Inventory count display
    const itemProxy = { count: usePlayerStore.getState().inventory.length };
    const itemCountCtrl = itemsFolder.add(itemProxy, 'count').name('Items in Bag').disable();

    // Relationship controls
    const relFolder = gui.addFolder('💕 Relationships');
    const relProxy: Record<string, number> = {};
    const rels = useRelationshipStore.getState().relationships;
    Object.keys(rels).forEach(npcId => {
      relProxy[npcId] = rels[npcId];
      relFolder.add(relProxy, npcId, -100, 100, 1).name(npcId).onChange((v: number) => {
        const current = useRelationshipStore.getState().getRelationship(npcId);
        useRelationshipStore.getState().changeRelationship(npcId, v - current);
      });
    });

    // Night drops tracker
    const nightFolder = gui.addFolder('🌙 Night Drops');
    nightFolder.close();

    const MAX_DROPS = 4;
    const posProxy = { playerX: '—', playerZ: '—' };
    const playerXCtrl = nightFolder.add(posProxy, 'playerX').name('Player X').disable();
    const playerZCtrl = nightFolder.add(posProxy, 'playerZ').name('Player Z').disable();

    const dropProxies = Array.from({ length: MAX_DROPS }, (_, i) => ({ label: '—' }));
    const dropCtrls = dropProxies.map((p, i) =>
      nightFolder.add(p, 'label').name(`Drop ${i + 1}`).disable()
    );

    // Update display periodically
    const interval = setInterval(() => {
      const bio = useBiometricStore.getState();
      const game = useGameStore.getState();
      const rel = useRelationshipStore.getState();

      bioProxy.energy = bio.energy;
      bioProxy.charm = bio.charm;
      bioProxy.performance = bio.performance;
      energyCtrl.updateDisplay();
      charmCtrl.updateDisplay();
      perfCtrl.updateDisplay();

      gameProxy.day = game.day;
      gameProxy.eventsRemaining = game.eventsRemaining;
      gameProxy.phase = game.phase;
      dayCtrl.updateDisplay();
      eventsCtrl.updateDisplay();
      phaseCtrl.updateDisplay();

      // Items
      const player = usePlayerStore.getState();
      itemProxy.count = player.inventory.length;
      itemCountCtrl.updateDisplay();

      Object.keys(rel.relationships).forEach(npcId => {
        if (relProxy[npcId] !== undefined) {
          relProxy[npcId] = rel.relationships[npcId];
        }
      });
      relFolder.controllersRecursive().forEach(c => c.updateDisplay());

      // Night drops
      const px = playerPositionRef.current;
      posProxy.playerX = px.x.toFixed(1);
      posProxy.playerZ = px.z.toFixed(1);
      playerXCtrl.updateDisplay();
      playerZCtrl.updateDisplay();

      const drops = droppedItemsRef.current;
      dropProxies.forEach((p, i) => {
        const drop = drops[i];
        if (drop) {
          const loc = drop.isIndoors
            ? 'Villa (indoors)'
            : `(${drop.position[0].toFixed(1)}, ${drop.position[2].toFixed(1)})`;
          p.label = `${drop.item.name} — ${loc}`;
        } else {
          p.label = '—';
        }
        dropCtrls[i].updateDisplay();
      });
    }, 500);

    return () => {
      clearInterval(interval);
      gui.destroy();
      guiRef.current = null;
    };
  }, []);

  return (
    <>
      {/* Toggle button — always visible */}
      <button
        onClick={() => setVisible(v => !v)}
        style={{
          position: 'fixed',
          right: visible ? 300 : 0,
          top: 8,
          zIndex: 1001,
          background: '#2a2a4e',
          color: '#aaa',
          border: '1px solid #444',
          borderRadius: '6px 0 0 6px',
          padding: '6px 10px',
          cursor: 'pointer',
          fontSize: '14px',
          transition: 'right 0.2s ease',
        }}
        title={visible ? 'Hide Dev Tools' : 'Show Dev Tools'}
      >
        {visible ? '▶' : '◀ Dev'}
      </button>

      {/* Panel */}
      <div className="dev-toolbar-area" ref={containerRef} style={{
        position: 'fixed',
        right: visible ? 0 : -300,
        top: 0,
        width: '300px',
        height: '100vh',
        background: '#1a1a2e',
        overflowY: 'auto',
        borderLeft: '1px solid #333',
        zIndex: 1000,
        transition: 'right 0.2s ease',
      }} />
    </>
  );
}
