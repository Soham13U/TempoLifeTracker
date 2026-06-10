import { chartBarTiming } from '@/motion/chartMotion';
import { tempoTokens } from '@/theme/tokens';
import { useThemeColors } from '@/utils/themeColors';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  ratio: number;
  delayIndex?: number;
  active?: boolean;
  color?: string;
};

export function ColumnTrack({
  ratio,
  delayIndex = 0,
  active = true,
  color,
}: Props) {
  const colors = useThemeColors();
  const clamped = active ? Math.min(1, Math.max(0, ratio)) : 0;
  const progress = useSharedValue(0);
  const { delayMs, durationMs } = chartBarTiming(delayIndex);
  const fillColor = color ?? colors.phosphor;
  const maxHeight = tempoTokens.chart.columnMaxHeight;

  useEffect(() => {
    progress.value = withDelay(
      delayMs,
      withTiming(clamped, {
        duration: durationMs,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [clamped, delayMs, durationMs, progress]);

  const fillStyle = useAnimatedStyle(() => ({
    height: progress.value * maxHeight,
  }));

  return (
    <View
      style={[
        styles.track,
        {
          height: maxHeight,
          backgroundColor: colors.border,
          opacity: 0.25,
          borderRadius: tempoTokens.chart.radius,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: fillColor,
            borderTopLeftRadius: tempoTokens.chart.radius,
            borderTopRightRadius: tempoTokens.chart.radius,
          },
          fillStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  fill: {
    width: '100%',
    minHeight: 0,
  },
});
