'use client';

// ---------------------------------------------------------------------------
// ChallengeUI — Egg Spoon Race mini-game overlay.
//
// Architecture:
//  - A single rAF loop drives the simulation, reading/writing refs only.
//  - raceSimRef (from RaceField) is written each frame so the 3D characters
//    update without any React re-renders in the hot path.
//  - React state is only updated at phase transitions and on leg completion.
// ---------------------------------------------------------------------------

import { useEffect, useRef, useState } from 'react';
import { EGG_RACE } from '@/game/constants';
import {
  getEggRaceTier,
  getPlayerDropChance,
  getPartnerDropChance,
  getRelationshipReward,
} from '@/systems/challenge';
import { raceSimRef, raceDefsRef, RacerState, RacerDef } from '@/scene/RaceField';
import { playerPositionRef, playerRaceRunningRef, playerRaceFacingRef, playerRaceEggRef } from '@/scene/PlayerController';
import { STARTING_CAST } from '@/characters/roster';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const NPC_EMOJI: Record<string, string> = {
  rosie:    '\u{1F430}',
  blaze:    '\u{1F98A}',
  pudge:    '\u{1F43B}',
  kiki:     '\u{1F431}',
  sprocket: '\u{1F427}',
  lily:     '\u{1F438}',
};

// Lane Z offsets (relative to field group at FIELD_Z)
const RACE_LANES = [
  EGG_RACE.LANE_SPACING,   // lane 0 = +2.5 (player pair, closest to spectator)
  0,                        // lane 1
  -EGG_RACE.LANE_SPACING,  // lane 2 = -2.5
] as const;

const HX = EGG_RACE.FIELD_HALF_X; // 10 — field runs from -10 to +10 in X

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type UIPhase = 'countdown' | 'playing' | 'results';
type SimPhase = 'countdown' | 'leg_running' | 'leg_drop_paused' | 'handoff' | 'done';
type LegOutcome = 'pending' | 'delivered' | 'dropped';

interface ChallengeUIProps {
  partnerNPCId: string;
  partnerNPCName: string;
  relationship: number;
  otherPairs: { npcA: string; npcB: string }[];
  onComplete: (score: number, tier: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ChallengeUI({
  partnerNPCId,
  partnerNPCName,
  relationship,
  otherPairs,
  onComplete,
}: ChallengeUIProps) {

  // ── React state (transitions + results only) ─────────────────────────────
  const [uiPhase, setUiPhase] = useState<UIPhase>('countdown');
  const [countdownNum, setCountdownNum] = useState(3);
  const [intent, setIntent] = useState<'best' | 'sabotage'>('best');
  const [legOutcomes, setLegOutcomes] = useState<LegOutcome[]>(
    Array(EGG_RACE.TOTAL_ROUNDS).fill('pending'),
  );
  const [eggsResult, setEggsResult] = useState(0);

  // ── Intent ref (read by rAF loop) ────────────────────────────────────────
  const intentRef = useRef<'best' | 'sabotage'>('best');

  // ── Props captured as refs (so rAF can read them after mount) ────────────
  const partnerNPCIdRef = useRef(partnerNPCId);
  const otherPairsRef   = useRef(otherPairs);
  const relationshipRef = useRef(relationship);
  partnerNPCIdRef.current = partnerNPCId;
  otherPairsRef.current   = otherPairs;
  relationshipRef.current = relationship;

  // ── Simulation refs (all mutable sim state) ──────────────────────────────
  const simPhaseRef        = useRef<SimPhase>('countdown');
  const countdownTimerRef  = useRef(3.0);
  const legIndexRef        = useRef(0);
  const legDurationRef     = useRef(0.0);
  const legTimerRef        = useRef(0.0);
  const dropTimerRef       = useRef(0.0);
  const handoffTimerRef    = useRef(0.0);
  const eggsDeliveredRef   = useRef(0);
  const droppedThisLegRef  = useRef(false);
  const legDropOccursRef   = useRef(false);
  const dropAtPctRef       = useRef(0.5);   // 0-1: when in the leg the drop fires

  // ── Racer position refs ───────────────────────────────────────────────────
  const playerPosXRef      = useRef<number>(-HX);
  const partnerPosXRef     = useRef<number>(HX);
  const playerBobRef       = useRef(0.0);
  const partnerBobRef      = useRef(0.0);
  const playerHasEggRef    = useRef(false);
  const partnerHasEggRef   = useRef(false);
  const playerDroppingRef  = useRef(false);
  const partnerDroppingRef = useRef(false);

  // Other lane NPCs (up to 4 slots for 2 pairs)
  const otherPosRef   = useRef([-HX, HX, -HX, HX]);
  const otherDirRef   = useRef([1, -1, 1, -1]);
  const otherBobRef   = useRef([0.0, Math.PI, 0.3, Math.PI + 0.3]);
  const otherSpeedRef = useRef([0.0, 0.0, 0.0, 0.0]);

  const rafRef      = useRef(0);
  const lastTimeRef = useRef(0.0);

  // ── Initialise speeds, raceSimRef, and raceDefsRef ───────────────────────
  useEffect(() => {
    // Random speeds slightly varied per pair
    const speeds = Array(4).fill(0) as number[];
    const usedPairs = Math.min(otherPairs.length, 2);
    for (let p = 0; p < usedPairs; p++) {
      const dur = EGG_RACE.RUN_MIN + Math.random() * (EGG_RACE.RUN_MAX - EGG_RACE.RUN_MIN);
      speeds[p * 2]     = (HX * 2) / dur;
      speeds[p * 2 + 1] = (HX * 2) / (dur * (0.85 + Math.random() * 0.3));
    }
    otherSpeedRef.current = speeds;

    // Populate raceDefsRef so RaceField can render species-correct characters.
    // Slot 0 = player (invisible — actual Ferret.glb handles it via playerPositionRef).
    // Slot 1 = partner NPC.  Slots 2-5 = other pairs.
    const pId = partnerNPCIdRef.current;
    const pairs = otherPairsRef.current;
    const defs: RacerDef[] = [
      { id: 'player', species: 'dog', laneZ: RACE_LANES[0] }, // slot 0 invisible
      { id: pId, species: STARTING_CAST.find(c => c.id === pId)?.species ?? 'rabbit', laneZ: RACE_LANES[0] },
    ];
    for (let p = 0; p < Math.min(pairs.length, 2); p++) {
      const lane = RACE_LANES[p + 1];
      defs.push(
        { id: pairs[p].npcA, species: STARTING_CAST.find(c => c.id === pairs[p].npcA)?.species ?? 'rabbit', laneZ: lane },
        { id: pairs[p].npcB, species: STARTING_CAST.find(c => c.id === pairs[p].npcB)?.species ?? 'rabbit', laneZ: lane },
      );
    }
    raceDefsRef.current = defs;

    buildSimState();
    return () => {
      raceSimRef.current = [];
      raceDefsRef.current = [];
      playerRaceRunningRef.current = false;
      playerRaceEggRef.current = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Build raceSimRef from current refs ───────────────────────────────────
  function buildSimState() {
    const pId   = partnerNPCIdRef.current;
    const pairs = otherPairsRef.current;

    const racers: RacerState[] = [
      // Slot 0: player — invisible (actual Ferret.glb is moved via playerPositionRef)
      {
        id:         'player',
        posX:       playerPosXRef.current,
        laneZ:      RACE_LANES[0],
        direction:  1,
        hasEgg:     playerHasEggRef.current,
        isDropping: playerDroppingRef.current,
        visible:    false,
        bobPhase:   playerBobRef.current,
      },
      // Slot 1: partner
      {
        id:         pId,
        posX:       partnerPosXRef.current,
        laneZ:      RACE_LANES[0],
        direction:  -1,
        hasEgg:     partnerHasEggRef.current,
        isDropping: partnerDroppingRef.current,
        visible:    true,
        bobPhase:   partnerBobRef.current,
      },
    ];

    for (let p = 0; p < Math.min(pairs.length, 2); p++) {
      const lane = RACE_LANES[p + 1];
      const ai   = p * 2;
      const bi   = p * 2 + 1;
      racers.push(
        {
          id: pairs[p].npcA, posX: otherPosRef.current[ai], laneZ: lane,
          direction: otherDirRef.current[ai], hasEgg: false, isDropping: false,
          visible: true, bobPhase: otherBobRef.current[ai],
        },
        {
          id: pairs[p].npcB, posX: otherPosRef.current[bi], laneZ: lane,
          direction: otherDirRef.current[bi], hasEgg: false, isDropping: false,
          visible: true, bobPhase: otherBobRef.current[bi],
        },
      );
    }

    raceSimRef.current = racers;
  }

  // ── rAF simulation loop ───────────────────────────────────────────────────
  useEffect(() => {
    lastTimeRef.current = performance.now();

    function startLeg(legIdx: number) {
      legDurationRef.current =
        EGG_RACE.RUN_MIN + Math.random() * (EGG_RACE.RUN_MAX - EGG_RACE.RUN_MIN);
      legTimerRef.current = 0;
      droppedThisLegRef.current = false;

      const isPlayerLeg = legIdx % 2 === 0;
      playerHasEggRef.current  = isPlayerLeg;
      partnerHasEggRef.current = !isPlayerLeg;
      playerDroppingRef.current  = false;
      partnerDroppingRef.current = false;

      const chance = isPlayerLeg
        ? getPlayerDropChance(relationshipRef.current, intentRef.current)
        : getPartnerDropChance(relationshipRef.current);
      legDropOccursRef.current = Math.random() < chance;
      dropAtPctRef.current = 0.3 + Math.random() * 0.4;

      simPhaseRef.current = 'leg_running';
    }

    function loop(now: number) {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;

      // Advance other-lane NPCs every frame (purely visual)
      for (let i = 0; i < 4; i++) {
        const spd = otherSpeedRef.current[i];
        if (spd === 0) continue;
        otherPosRef.current[i] += otherDirRef.current[i] * spd * dt;
        if (otherPosRef.current[i] >= HX) {
          otherPosRef.current[i] = HX;
          otherDirRef.current[i] = -1;
        } else if (otherPosRef.current[i] <= -HX) {
          otherPosRef.current[i] = -HX;
          otherDirRef.current[i] = 1;
        }
        otherBobRef.current[i] = (otherBobRef.current[i] + dt * 7) % (Math.PI * 2);
      }

      const phase = simPhaseRef.current;

      if (phase === 'countdown') {
        countdownTimerRef.current -= dt;
        const n = Math.ceil(countdownTimerRef.current);
        setCountdownNum(Math.max(0, n));
        if (countdownTimerRef.current <= 0) {
          setUiPhase('playing');
          playerPosXRef.current  = -HX;
          partnerPosXRef.current = HX;
          startLeg(0);
        }
      } else if (phase === 'leg_drop_paused') {
        dropTimerRef.current -= dt;
        if (dropTimerRef.current <= 0) {
          playerDroppingRef.current  = false;
          partnerDroppingRef.current = false;
          simPhaseRef.current = 'leg_running';
        }
      } else if (phase === 'handoff') {
        handoffTimerRef.current -= dt;
        if (handoffTimerRef.current <= 0) {
          startLeg(legIndexRef.current);
        }
      } else if (phase === 'leg_running') {
        const legIdx       = legIndexRef.current;
        const isPlayerLeg  = legIdx % 2 === 0;
        legTimerRef.current += dt;
        const pct = Math.min(1, legTimerRef.current / legDurationRef.current);

        if (isPlayerLeg) {
          // Pingpong: player legs are 0, 2, 4 → player-leg-index = legIdx/2
          // Even player legs run -HX → +HX, odd run +HX → -HX
          const playerLegNum = legIdx / 2;
          const goingRight = playerLegNum % 2 === 0;
          if (goingRight) {
            playerPosXRef.current = -HX + pct * HX * 2;
          } else {
            playerPosXRef.current = HX - pct * HX * 2;
          }
          playerBobRef.current  = (playerBobRef.current + dt * 9) % (Math.PI * 2);
          // Move actual Ferret model to match race position
          playerRaceRunningRef.current = true;
          playerRaceFacingRef.current = goingRight ? Math.PI / 2 : -Math.PI / 2;
          playerRaceEggRef.current = playerHasEggRef.current && !playerDroppingRef.current;
          playerPositionRef.current.set(
            playerPosXRef.current,
            0,
            EGG_RACE.FIELD_Z + EGG_RACE.LANE_SPACING,
          );
        } else {
          // Pingpong: partner legs are 1, 3 → partner-leg-index = (legIdx-1)/2
          const partnerLegNum = (legIdx - 1) / 2;
          const goingLeft = partnerLegNum % 2 === 0;
          if (goingLeft) {
            partnerPosXRef.current = HX - pct * HX * 2;
          } else {
            partnerPosXRef.current = -HX + pct * HX * 2;
          }
          partnerBobRef.current  = (partnerBobRef.current + dt * 9) % (Math.PI * 2);
          playerRaceRunningRef.current = false;
          playerRaceEggRef.current = false;
        }

        // Trigger drop mid-leg
        if (
          legDropOccursRef.current &&
          !droppedThisLegRef.current &&
          pct >= dropAtPctRef.current
        ) {
          droppedThisLegRef.current = true;
          dropTimerRef.current = EGG_RACE.DROP_PAUSE;
          simPhaseRef.current = 'leg_drop_paused';
          if (isPlayerLeg) playerDroppingRef.current = true;
          else partnerDroppingRef.current = true;
          buildSimState();
          rafRef.current = requestAnimationFrame(loop);
          return;
        }

        // Leg complete
        if (pct >= 1.0) {
          const delivered = !droppedThisLegRef.current;
          if (delivered) eggsDeliveredRef.current++;

          const outcome: LegOutcome = delivered ? 'delivered' : 'dropped';
          const li = legIdx;
          setLegOutcomes((prev) => {
            const next = [...prev] as LegOutcome[];
            next[li] = outcome;
            return next;
          });

          const nextLeg = legIdx + 1;
          legIndexRef.current = nextLeg;

          // Snap carrier to the end they arrived at
          if (isPlayerLeg) {
            const playerLegNum = legIdx / 2;
            playerPosXRef.current = (playerLegNum % 2 === 0) ? HX : -HX;
          } else {
            const partnerLegNum = (legIdx - 1) / 2;
            partnerPosXRef.current = (partnerLegNum % 2 === 0) ? -HX : HX;
          }

          playerRaceRunningRef.current = false;
          playerRaceEggRef.current = false;

          if (nextLeg >= EGG_RACE.TOTAL_ROUNDS) {
            simPhaseRef.current = 'done';
            setEggsResult(eggsDeliveredRef.current);
            setUiPhase('results');
          } else {
            handoffTimerRef.current = EGG_RACE.HANDOFF;
            simPhaseRef.current = 'handoff';
          }
        }
      }

      buildSimState();
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleSetIntent(newIntent: 'best' | 'sabotage') {
    intentRef.current = newIntent;
    setIntent(newIntent);
  }

  function handleComplete() {
    const tier = getEggRaceTier(eggsResult);
    onComplete(eggsResult, tier);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const partnerEmoji = NPC_EMOJI[partnerNPCId] ?? '\u{1F464}';

  // ── Countdown ────────────────────────────────────────────────────────────
  if (uiPhase === 'countdown') {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.72)' }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '6rem',
              fontWeight: 900,
              color: 'white',
              lineHeight: 1,
              textShadow: '0 4px 24px rgba(0,0,0,0.5)',
              transition: 'font-size 0.1s',
            }}
          >
            {countdownNum > 0 ? countdownNum : 'GO!'}
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {'\u{1F95A}'} Egg Spoon Race
          </div>
          <div style={{ marginTop: 8, fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
            with {partnerEmoji} {partnerNPCName}
          </div>
        </div>
      </div>
    );
  }

  // ── Results ───────────────────────────────────────────────────────────────
  if (uiPhase === 'results') {
    const tier = getEggRaceTier(eggsResult);
    const delta = getRelationshipReward(tier);
    const deltaPos = delta >= 0;

    const tierStyles = {
      gold:   { emoji: '\u{1F947}', label: 'Gold',   color: '#fcd34d' },
      silver: { emoji: '\u{1F948}', label: 'Silver', color: '#d1d5db' },
      bronze: { emoji: '\u{1F949}', label: 'Bronze', color: '#fb923c' },
    };
    const ts = tierStyles[tier];

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: 'linear-gradient(160deg, #1a2a3a 0%, #0d1b2a 100%)' }}
      >
        <div
          style={{
            background: 'rgba(0,0,0,0.55)',
            borderRadius: 24,
            padding: '32px 28px',
            textAlign: 'center',
            minWidth: 280,
            maxWidth: 360,
            width: '90%',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ fontSize: '3.5rem', lineHeight: 1 }}>{ts.emoji}</div>
          <h2
            style={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              margin: '10px 0 4px',
            }}
          >
            Race Complete!
          </h2>

          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: ts.color, lineHeight: 1.2 }}>
            {eggsResult} / {EGG_RACE.TOTAL_ROUNDS}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', marginTop: 2 }}>
            eggs delivered &nbsp;&middot;&nbsp; {ts.label} Tier
          </div>

          {/* Per-leg egg icons */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '16px 0 8px' }}>
            {legOutcomes.map((outcome, i) => (
              <span key={i} style={{ fontSize: '1.4rem', opacity: outcome === 'pending' ? 0.25 : 1 }}>
                {outcome === 'dropped' ? '\u274C' : '\u{1F95A}'}
              </span>
            ))}
          </div>

          {/* Relationship delta */}
          {partnerNPCName && (
            <div
              style={{
                margin: '12px 0',
                padding: '10px 14px',
                borderRadius: 14,
                background: deltaPos ? 'rgba(16,185,129,0.14)' : 'rgba(239,68,68,0.14)',
                border: `1px solid ${deltaPos ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>
                {partnerEmoji} {partnerNPCName}
              </span>
              <span
                style={{
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  color: deltaPos ? '#34d399' : '#f87171',
                }}
              >
                {deltaPos ? `+${delta}` : delta}
              </span>
            </div>
          )}

          <button
            onClick={handleComplete}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              border: 'none',
              borderRadius: 16,
              padding: '13px 0',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%',
              marginTop: 6,
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // ── Playing — transparent overlay over 3D scene ───────────────────────────
  return (
    <div className="fixed inset-0 z-50" style={{ pointerEvents: 'none' }}>
      {/* Top HUD */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            background: 'rgba(0,0,0,0.6)',
            borderRadius: 16,
            padding: '10px 20px',
            textAlign: 'center',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
            {'\u{1F95A}'} Egg Spoon Race
          </div>
          <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', marginTop: 2 }}>
            {partnerEmoji} {partnerNPCName}
          </div>
          {/* Leg outcome dots */}
          <div style={{ display: 'flex', gap: 7, justifyContent: 'center', marginTop: 8 }}>
            {legOutcomes.map((outcome, i) => (
              <div
                key={i}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background:
                    outcome === 'delivered'
                      ? '#fcd34d'
                      : outcome === 'dropped'
                      ? '#f87171'
                      : 'rgba(255,255,255,0.2)',
                  border: '1.5px solid rgba(255,255,255,0.25)',
                  transition: 'background 0.2s',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom intent buttons */}
      <div
        style={{
          position: 'absolute',
          bottom: 90,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 12,
          pointerEvents: 'auto',
        }}
      >
        <button
          onClick={() => handleSetIntent('best')}
          style={{
            padding: '10px 18px',
            borderRadius: 12,
            border: `2px solid ${intent === 'best' ? '#34d399' : 'rgba(255,255,255,0.2)'}`,
            background:
              intent === 'best' ? 'rgba(52,211,153,0.2)' : 'rgba(0,0,0,0.55)',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '0.85rem',
            backdropFilter: 'blur(6px)',
            transition: 'all 0.12s',
          }}
        >
          {'\u2B50'} Do Your Best
        </button>
        <button
          onClick={() => handleSetIntent('sabotage')}
          style={{
            padding: '10px 18px',
            borderRadius: 12,
            border: `2px solid ${intent === 'sabotage' ? '#f87171' : 'rgba(255,255,255,0.2)'}`,
            background:
              intent === 'sabotage' ? 'rgba(239,68,68,0.2)' : 'rgba(0,0,0,0.55)',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '0.85rem',
            backdropFilter: 'blur(6px)',
            transition: 'all 0.12s',
          }}
        >
          {'\u{1F608}'} Sabotage
        </button>
      </div>
    </div>
  );
}
