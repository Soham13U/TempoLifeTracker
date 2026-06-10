import { useThemeColors } from '@/utils/themeColors';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const LINE_GAP = 4;

export function ScanlineOverlay() {
  const colors = useThemeColors();
  const drift = useSharedValue(0);

  useEffect(() => {
    drift.value = withRepeat(
      withTiming(LINE_GAP, { duration: 8000, easing: Easing.linear }),
      -1,
      false
    );
  }, [drift]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: drift.value }],
  }));

  if (!colors.isDark) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, animStyle, { opacity: 0.03 }]}
    >
      {Array.from({ length: 120 }).map((_, i) => (
        <View
          key={i}
          style={{
            height: 1,
            marginBottom: LINE_GAP - 1,
            backgroundColor: colors.phosphor,
          }}
        />
      ))}
    </Animated.View>
  );
}
