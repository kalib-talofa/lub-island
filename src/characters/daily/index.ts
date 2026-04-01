import type { DialogueScript } from '@/utils/ink';
import { ROSIE_DAILY } from './rosie';
import { BLAZE_DAILY } from './blaze';
import { PUDGE_DAILY } from './pudge';
import { KIKI_DAILY } from './kiki';
import { SPROCKET_DAILY } from './sprocket';
import { LILY_DAILY } from './lily';

/**
 * Daily dialogue scripts indexed by NPC id.
 *
 * Structure: DAILY_DIALOGUES[npcId][dayIndex][tierIndex]
 *   dayIndex : 0-6 (day 1 through day 7)
 *   tierIndex: 0 = low (rel < 20), 1 = mid (20-59), 2 = high (>= 60)
 */
export const DAILY_DIALOGUES: Record<string, DialogueScript[][]> = {
  rosie: ROSIE_DAILY,
  blaze: BLAZE_DAILY,
  pudge: PUDGE_DAILY,
  kiki: KIKI_DAILY,
  sprocket: SPROCKET_DAILY,
  lily: LILY_DAILY,
};
