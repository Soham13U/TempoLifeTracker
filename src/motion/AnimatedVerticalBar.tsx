import { tempoTokens } from '@/theme/tokens';
import { useThemeColors } from '@/utils/themeColors';
import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SPRING_SOFT } from './constants';

type Props = {
  targetHeight: number;
  active?: boolean;
};

export function AnimatedVerticalBar({ targetHeight, active = true }: Props) {
  const colors = useThemeColors();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(active ? 1 : 0, SPRING_SOFT);
  }, [active, progress]);

  const style = useAnimatedStyle(() => ({
    height: Math.max(4, progress.value * targetHeight),
  }));

  return (
    <Animated.View
      style={[
        {
          width: '100%',
          backgroundColor: colors.primary,
          borderRadius: tempoTokens.radius.bar,
          opacity: active ? 1 : 0.2,
        },
        style,
      ]}
    />
  );
}
