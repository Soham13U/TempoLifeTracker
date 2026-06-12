import {
  ActivityIconMark,
  CATEGORY_DOT_INSET,
  CategoryDot,
} from '@/components/activity/ActivityIconMark';
import { AppText } from '@/components/ui/AppText';
import { YStack } from '@/components/ui/stacks';
import { SPRING_QUICK } from '@/motion/constants';
import { tempoTokens } from '@/theme/tokens';
import type { Activity } from '@/types/activity';
import { getCategoryColor } from '@/utils/colors';
import { getActivityIcon } from '@/utils/icons';
import { useThemeColors } from '@/utils/themeColors';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  activity: Activity;
  onPress: () => void;
  isActive?: boolean;
  fill?: boolean;
};

export function QuickActivityButton({
  activity,
  onPress,
  isActive,
  fill = true,
}: Props) {
  const colors = useThemeColors();
  const scale = useSharedValue(1);
  const Icon = getActivityIcon(activity.icon);
  const categoryColor =
    activity.color ?? getCategoryColor(activity.category);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.94, SPRING_QUICK);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, SPRING_QUICK);
      }}
      style={[
        fill ? { flex: 1, minWidth: '30%' } : { width: '30%', minWidth: 100 },
        animStyle,
      ]}
    >
      <YStack
        bg="$card"
        br={tempoTokens.radius.tile}
        p="$3"
        ai="center"
        gap="$2"
        borderWidth={isActive ? 2 : 1}
        borderColor={isActive ? colors.phosphor : '$borderColor'}
        position="relative"
      >
        <CategoryDot
          color={categoryColor}
          style={{ top: CATEGORY_DOT_INSET, left: CATEGORY_DOT_INSET }}
        />
        <ActivityIconMark icon={Icon} />
        <AppText variant="caption" numberOfLines={1} color="$color">
          {activity.name}
        </AppText>
      </YStack>
    </AnimatedPressable>
  );
}
