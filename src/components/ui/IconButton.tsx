import { SPRING_QUICK } from '@/motion/constants';
import { tempoTokens } from '@/theme/tokens';
import { useThemeColors } from '@/utils/themeColors';
import type { LucideIcon } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  icon: LucideIcon;
  onPress: () => void;
  accessibilityLabel: string;
  disabled?: boolean;
};

export function IconButton({
  icon: Icon,
  onPress,
  accessibilityLabel,
  disabled = false,
}: Props) {
  const colors = useThemeColors();
  const size = tempoTokens.size.iconButton;
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.35 : 1,
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      onPressIn={() => {
        if (!disabled) scale.value = withSpring(0.92, SPRING_QUICK);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, SPRING_QUICK);
      }}
      style={[
        {
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: tempoTokens.radius.button,
        },
        animStyle,
      ]}
    >
      <Icon size={22} color={colors.icon} />
    </AnimatedPressable>
  );
}
