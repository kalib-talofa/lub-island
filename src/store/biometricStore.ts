import { create } from 'zustand';
import { BiometricData } from '@/characters/CharacterData';
import { STAT_FLOOR, BIO_TARGETS } from '@/game/constants';

const clamp = (min: number, max: number, val: number) => Math.max(min, Math.min(max, val));

const computeStats = (sleep: number, quality: number, active: number, steps: number) => ({
  energy: Math.max(STAT_FLOOR, clamp(0, 100, (sleep / BIO_TARGETS.SLEEP_HOURS_MAX) * (quality / 100) * 100)),
  charm: Math.max(STAT_FLOOR, clamp(0, 100, (active / BIO_TARGETS.ACTIVE_MINUTES_MAX) * 100)),
  performance: Math.max(STAT_FLOOR, clamp(0, 100, (steps / BIO_TARGETS.STEPS_MAX) * 100)),
});

interface BiometricStore extends BiometricData {
  setSleepHours: (v: number) => void;
  setSleepQuality: (v: number) => void;
  setActiveMinutes: (v: number) => void;
  setStepCount: (v: number) => void;
  setGodMode: (on: boolean) => void;
  godMode: boolean;
}

export const useBiometricStore = create<BiometricStore>((set) => ({
  sleepHours: 7,
  sleepQuality: 70,
  activeMinutes: 30,
  stepCount: 5000,
  ...computeStats(7, 70, 30, 5000),
  godMode: false,
  setSleepHours: (v) => set((s) => {
    const stats = computeStats(v, s.sleepQuality, s.activeMinutes, s.stepCount);
    return { sleepHours: v, ...stats };
  }),
  setSleepQuality: (v) => set((s) => {
    const stats = computeStats(s.sleepHours, v, s.activeMinutes, s.stepCount);
    return { sleepQuality: v, ...stats };
  }),
  setActiveMinutes: (v) => set((s) => {
    const stats = computeStats(s.sleepHours, s.sleepQuality, v, s.stepCount);
    return { activeMinutes: v, ...stats };
  }),
  setStepCount: (v) => set((s) => {
    const stats = computeStats(s.sleepHours, s.sleepQuality, s.activeMinutes, v);
    return { stepCount: v, ...stats };
  }),
  setGodMode: (on) => set(() => on
    ? { godMode: true, energy: 100, charm: 100, performance: 100 }
    : { godMode: false, ...computeStats(7, 70, 30, 5000) }
  ),
}));
