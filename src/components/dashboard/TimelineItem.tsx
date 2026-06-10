import { TerminalPanel } from '@/components/terminal/TerminalPanel';
import { AppText } from '@/components/ui/AppText';
import type { TimelineItem as TimelineItemType } from '@/types/dashboard';
import { formatTime } from '@/utils/date';
import { formatDurationHuman } from '@/utils/duration';
import { getCategoryColor } from '@/utils/colors';
import { useThemeColors } from '@/utils/themeColors';
import { useRouter } from 'expo-router';
import { fadeInUp } from '@/motion/fadeInUp';
import { StickyNote } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { XStack, YStack } from '@/components/ui/stacks';

type Props = {
  item: TimelineItemType;
  index?: number;
};

export function TimelineItemRow({ item, index = 0 }: Props) {
  const router = useRouter();
  const colors = useThemeColors();
  const color = item.color ?? getCategoryColor(item.category);
  const endLabel = item.endTime ? formatTime(item.endTime) : 'now';
  const a11yLabel = `${item.activityName}, ${formatTime(item.startTime)} to ${endLabel}, ${formatDurationHuman(item.durationMs)}`;

  return (
    <Animated.View entering={fadeInUp(index)}>
      <TerminalPanel
        pressable
        onPress={() => router.push(`/session/${item.sessionId}`)}
        accessibilityLabel={a11yLabel}
      >
        <XStack jc="space-between" ai="flex-start" gap="$2">
          <YStack f={1} gap="$1" minWidth={0}>
            <XStack ai="center" gap="$2">
              <YStack w={8} h={8} br={2} bg={color} flexShrink={0} />
              <AppText variant="subtitle" fontSize={15} numberOfLines={1} f={1}>
                {item.activityName}
              </AppText>
              {item.note ? (
                <StickyNote size={14} color={colors.textMuted} />
              ) : null}
            </XStack>
            <AppText variant="caption">
              {formatTime(item.startTime)} – {endLabel}
            </AppText>
          </YStack>
          <AppText variant="caption" color={colors.phosphor} flexShrink={0}>
            {formatDurationHuman(item.durationMs)}
          </AppText>
        </XStack>
      </TerminalPanel>
    </Animated.View>
  );
}
