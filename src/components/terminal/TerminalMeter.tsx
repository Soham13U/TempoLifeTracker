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
  color: string;
  segments?: number;
  delayIndex?: number;
};

function Segment({
  filled,
  color,
  delayMs,
  showGlow,
  emptyBorderColor,
}: {
  filled: boolean;
  color: string;
  delayMs: number;
  showGlow: boolean;
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
    transform: [{ scaleY: filled ? 0.6 + progress.value * 0.4 : 1 }],
  }));

  return (
    <Animated.View
      style={[
        styles.segment,
        filled
          ? {
              backgroundColor: color,
              shadowColor: showGlow ? color : 'transparent',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: showGlow ? 0.5 : 0,
              shadowRadius: showGlow ? 3 : 0,
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

export function TerminalMeter({
  ratio,
  color,
  segments = tempoTokens.meter.segments,
  delayIndex = 0,
}: Props) {
  const colors = useThemeColors();
  const clamped = Math.min(1, Math.max(0, ratio));
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
        <Segment
          key={index}
          filled={filled}
          color={color}
          delayMs={rowOffset + index * tempoTokens.meter.staggerMs}
          showGlow={colors.isDark && filled}
          emptyBorderColor={colors.border}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    height: tempoTokens.meter.height + 4,
    paddingHorizontal: 3,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 0,
    gap: tempoTokens.meter.gap,
  },
  segment: {
    flex: 1,
    height: tempoTokens.meter.height,
    borderRadius: 0,
  },
});
