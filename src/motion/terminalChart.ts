import { FadeIn } from 'react-native-reanimated';

const BLOCK_STAGGER_MS = 50;
const BLOCK_DURATION = 200;

export function terminalBlockEnter(index = 0) {
  return FadeIn.delay(index * BLOCK_STAGGER_MS).duration(BLOCK_DURATION);
}
