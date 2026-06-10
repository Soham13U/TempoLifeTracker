import { FadeInDown } from 'react-native-reanimated';

const BASE_DURATION = 280;
const STAGGER_MS = 40;

export function fadeInUp(index = 0) {
  return FadeInDown.delay(index * STAGGER_MS)
    .duration(BASE_DURATION)
    .springify()
    .damping(18)
    .stiffness(120);
}
