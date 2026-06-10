import { chartBarTiming } from '@/motion/chartMotion';
import { tempoTokens } from '@/theme/tokens';
import { useThemeColors } from '@/utils/themeColors';
import { useEffect } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
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
  delayIndex?: number;
  height?: number;
};

export function BarTrack({
  ratio,
  color,
  delayIndex = 0,
  height = tempoTokens.chart.barHeight,
}: Props) {
  const colors = useThemeColors();
  const clamped = Math.min(1, Math.max(0, ratio));
  const progress = useSharedValue(0);
  const trackWidth = useSharedValue(0);
  const { delayMs, durationMs } = chartBarTiming(delayIndex);
  const trackHeight = tempoTokens.chart.barTrackHeight;

  useEffect(() => {
    progress.value = withDelay(
      delayMs,
      withTiming(clamped, {
        duration: durationMs,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [clamped, delayMs, durationMs, progress]);

  const onLayout = (e: LayoutChangeEvent) => {
    trackWidth.value = e.nativeEvent.layout.width;
  };

  const fillStyle = useAnimatedStyle(() => ({
    width: progress.value * trackWidth.value,
  }));

  return (
    <View
      onLayout={onLayout}
      style={[
        styles.track,
        {
          height: trackHeight,
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
            height,
            backgroundColor: color,
            borderRadius: tempoTokens.chart.radius,
            marginTop: (trackHeight - height) / 2,
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
    justifyContent: 'center',
  },
  fill: {
    minWidth: 0,
  },
});
