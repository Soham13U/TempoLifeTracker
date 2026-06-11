import { SPRING_QUICK } from '@/motion/constants';
import { tempoTokens } from '@/theme/tokens';
import { getCategoryColor } from '@/utils/colors';
import { getActivityIcon } from '@/utils/icons';
import { useThemeColors } from '@/utils/themeColors';
import type { Activity } from '@/types/activity';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Pressable, View } from 'react-native';
import { YStack } from '@/components/ui/stacks';
import { AppText } from '../ui/AppText';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ICON_CONTAINER = 28;
const DOT_SIZE = 8;

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
      >
        <View
          style={{
            width: ICON_CONTAINER,
            height: ICON_CONTAINER,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={22} color={colors.icon} />
          <View
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: DOT_SIZE,
              height: DOT_SIZE,
              borderRadius: DOT_SIZE / 2,
              backgroundColor: categoryColor,
              borderWidth: 1,
              borderColor: colors.card,
            }}
          />
        </View>
        <AppText variant="caption" numberOfLines={1} color="$color">
          {activity.name}
        </AppText>
      </YStack>
    </AnimatedPressable>
  );
}
