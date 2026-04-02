import { create } from 'zustand';
import { GamePhase, EventType } from '@/characters/CharacterData';
import { getDaysInWeek, EVENTS_PER_DAY } from '@/game/constants';
import { isCeremonyDay, isFreeRoamDay } from '@/systems/calendar';

interface GameStore {
  phase: GamePhase;
  day: number;         // 1-based within current week
  week: number;        // starts at 1
  totalDaysPlayed: number;  // running counter across weeks (for dialogue progression)
  eventsRemaining: number;  // 0-3
  eventsCompleted: number;
  isNight: boolean;
  isIndoors: boolean;
  currentEventType: EventType | null;

  setPhase: (phase: GamePhase) => void;
  startEvent: (type: EventType) => void;
  completeEvent: () => void;
  transitionToNight: () => void;
  advanceDay: () => void;
  advanceToNight: () => void;
  advanceToCeremony: () => void;
  enterVilla: () => void;
  exitVilla: () => void;
  resetWeek: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  phase: 'MAIN_MENU',
  day: 1,
  week: 1,
  totalDaysPlayed: 1,
  eventsRemaining: EVENTS_PER_DAY,
  eventsCompleted: 0,
  isNight: false,
  isIndoors: false,
  currentEventType: null,

  setPhase: (phase) => set({ phase }),

  startEvent: (type) => set({ phase: 'EVENT', currentEventType: type }),

  completeEvent: () => set((s) => {
    const eventsRemaining = Math.max(0, s.eventsRemaining - 1);
    const eventsCompleted = s.eventsCompleted + 1;
    return { eventsRemaining, eventsCompleted, phase: 'DAYTIME_FREE', currentEventType: null };
  }),

  transitionToNight: () => set({ phase: 'NIGHTTIME_FREE', isNight: true, eventsRemaining: 0 }),

  advanceDay: () => set((s) => {
    const daysInWeek = getDaysInWeek(s.week);
    const newDay = s.day + 1;
    const newTotal = s.totalDaysPlayed + 1;

    if (newDay > daysInWeek) {
      // Wrap to next week
      const newWeek = s.week + 1;
      const isCeremony = isCeremonyDay(1, newWeek);
      const isFree = isFreeRoamDay(1, newWeek);
      const events = (isCeremony || isFree) ? 0 : EVENTS_PER_DAY;
      return {
        day: 1, week: newWeek, totalDaysPlayed: newTotal,
        eventsRemaining: events, eventsCompleted: 0,
        isNight: false, phase: 'MORNING_BRIEFING', currentEventType: null,
      };
    }

    const isCeremony = isCeremonyDay(newDay, s.week);
    const isFree = isFreeRoamDay(newDay, s.week);
    const events = (isCeremony || isFree) ? 0 : EVENTS_PER_DAY;
    return {
      day: newDay, totalDaysPlayed: newTotal,
      eventsRemaining: events, eventsCompleted: 0,
      isNight: false, phase: 'MORNING_BRIEFING', currentEventType: null,
    };
  }),

  advanceToNight: () => set({ phase: 'NIGHTTIME_FREE', isNight: true, eventsRemaining: 0, currentEventType: null }),

  advanceToCeremony: () => set((s) => ({
    phase: 'CEREMONY', day: getDaysInWeek(s.week), currentEventType: null,
  })),

  enterVilla: () => set({ isIndoors: true }),
  exitVilla: () => set({ isIndoors: false }),

  resetWeek: () => set({
    day: 1, week: 1, totalDaysPlayed: 1,
    eventsRemaining: EVENTS_PER_DAY, eventsCompleted: 0,
    isNight: false, isIndoors: false, phase: 'MORNING_BRIEFING', currentEventType: null,
  }),

  resetGame: () => set({
    phase: 'MAIN_MENU', day: 1, week: 1, totalDaysPlayed: 1,
    eventsRemaining: EVENTS_PER_DAY, eventsCompleted: 0,
    isNight: false, isIndoors: false, currentEventType: null,
  }),
}));
