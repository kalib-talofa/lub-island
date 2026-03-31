import { create } from 'zustand';
import { GamePhase, EventType } from '@/characters/CharacterData';
import { DAYS_PER_WEEK, EVENTS_PER_DAY } from '@/game/constants';

interface GameStore {
  phase: GamePhase;
  day: number;         // 1-7
  week: number;        // starts at 1
  eventsRemaining: number;  // 0-3
  eventsCompleted: number;
  isNight: boolean;
  currentEventType: EventType | null;

  setPhase: (phase: GamePhase) => void;
  startEvent: (type: EventType) => void;
  completeEvent: () => void;
  transitionToNight: () => void;
  advanceDay: () => void;
  advanceToNight: () => void;
  advanceToCeremony: () => void;
  resetWeek: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  phase: 'MAIN_MENU',
  day: 1,
  week: 1,
  eventsRemaining: EVENTS_PER_DAY,
  eventsCompleted: 0,
  isNight: false,
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
    const newDay = s.day + 1;
    if (newDay > DAYS_PER_WEEK) {
      return { day: 1, week: s.week + 1, eventsRemaining: EVENTS_PER_DAY, eventsCompleted: 0, isNight: false, phase: 'MORNING_BRIEFING', currentEventType: null };
    }
    return { day: newDay, eventsRemaining: EVENTS_PER_DAY, eventsCompleted: 0, isNight: false, phase: 'MORNING_BRIEFING', currentEventType: null };
  }),

  advanceToNight: () => set({ phase: 'NIGHTTIME_FREE', isNight: true, eventsRemaining: 0, currentEventType: null }),

  advanceToCeremony: () => set({ phase: 'CEREMONY', day: DAYS_PER_WEEK, currentEventType: null }),

  resetWeek: () => set({ day: 1, week: 1, eventsRemaining: EVENTS_PER_DAY, eventsCompleted: 0, isNight: false, phase: 'MORNING_BRIEFING', currentEventType: null }),

  resetGame: () => set({ phase: 'MAIN_MENU', day: 1, week: 1, eventsRemaining: EVENTS_PER_DAY, eventsCompleted: 0, isNight: false, currentEventType: null }),
}));
