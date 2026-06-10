import { METER_TIMING } from '@/motion/constants';
import { tempoTokens } from '@/theme/tokens';
import { useThemeColors } from '@/utils/themeColors';
import { useEffect, useMemo } from 'react';
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
};

function VerticalSegment({
  filled,
  delayMs,
  showGlow,
  phosphor,
  emptyBorderColor,
}: {
  filled: boolean;
  delayMs: number;
  showGlow: boolean;
  phosphor: string;
  emptyBorderColor: string;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delayMs,
      withTiming(filled ? 1 : 0, {
        duration: METER_TIMING.duration,
        easing: Easing.linear,
      })
    );
  }, [delayMs, filled, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: filled ? 0.35 + progress.value * 0.65 : 0.2,
  }));

  return (
    <Animated.View
      style={[
        styles.segment,
        filled
          ? {
              backgroundColor: phosphor,
              shadowColor: showGlow ? phosphor : 'transparent',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: showGlow ? 0.45 : 0,
              shadowRadius: showGlow ? 2 : 0,
            }
          : {
              backgroundColor: 'transparent',
              borderWidth: 1,
              borderColor: emptyBorderColor,
            },
        style,
      ]}
    />
  );
}

export function TerminalVerticalMeter({
  ratio,
  delayIndex = 0,
  active = true,
}: Props) {
  const colors = useThemeColors();
  const segments = tempoTokens.meter.verticalSegments;
  const clamped = active ? Math.min(1, Math.max(0, ratio)) : 0;
  const filledCount = Math.round(clamped * segments);
  const rowOffset = delayIndex * tempoTokens.meter.rowStaggerMs;

  const items = useMemo(
    () => Array.from({ length: segments }, (_, i) => i < filledCount),
    [segments, filledCount]
  );

  return (
    <View
      style={[
        styles.track,
        {
          borderColor: colors.border,
          backgroundColor: colors.isDark ? colors.background : colors.card,
        },
      ]}
    >
      {items.map((filled, index) => (
        <VerticalSegment
          key={index}
          filled={filled}
          delayMs={rowOffset + index * tempoTokens.meter.staggerMs}
          showGlow={colors.isDark && filled}
          phosphor={colors.phosphor}
          emptyBorderColor={colors.border}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    height: 72,
    flexDirection: 'column-reverse',
    alignItems: 'stretch',
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 0,
    gap: tempoTokens.meter.gap,
  },
  segment: {
    flex: 1,
    borderRadius: 0,
    minHeight: 2,
  },
});
