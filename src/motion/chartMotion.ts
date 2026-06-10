import { tempoTokens } from '@/theme/tokens';
import { FadeInDown } from 'react-native-reanimated';

export function chartEnter(index = 0) {
  return FadeInDown.delay(index * tempoTokens.chart.staggerMs)
    .duration(300)
    .springify()
    .damping(18);
}

export function chartBarTiming(delayIndex = 0) {
  return {
    delayMs: delayIndex * tempoTokens.chart.staggerMs,
    durationMs: tempoTokens.chart.durationMs,
  };
}
