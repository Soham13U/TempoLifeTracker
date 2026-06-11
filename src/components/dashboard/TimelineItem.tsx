import { BarTrack } from '@/components/charts/BarTrack';
import { TerminalPanel } from '@/components/terminal/TerminalPanel';
import { AppText } from '@/components/ui/AppText';
import { tempoTokens } from '@/theme/tokens';
import type { TimelineItem as TimelineItemType } from '@/types/dashboard';
import { getCategoryColor } from '@/utils/colors';
import { formatTime } from '@/utils/date';
import { formatDurationHuman } from '@/utils/duration';
import { getActivityIcon } from '@/utils/icons';
import { clipTimelineItemToDay } from '@/utils/sessionBounds';
import { useThemeColors } from '@/utils/themeColors';
import { useRouter } from 'expo-router';
import { fadeInUp } from '@/motion/fadeInUp';
import Animated from 'react-native-reanimated';
import { View } from 'react-native';
import { XStack, YStack } from '@/components/ui/stacks';

const RAIL_WIDTH = 48;
const DOT_SIZE = 8;
const SPINE_WIDTH = 2;

type Props = {
  item: TimelineItemType;
  date: Date;
  index?: number;
  isLast?: boolean;
  maxDurationMs?: number;
  hasPriorNote?: boolean;
};

export function TimelineItemRow({
  item,
  date,
  index = 0,
  isLast = false,
  maxDurationMs = 1,
  hasPriorNote = false,
}: Props) {
  const router = useRouter();
  const colors = useThemeColors();
  const color = item.color ?? getCategoryColor(item.category);
  const Icon = getActivityIcon(item.icon);

  const clipped = clipTimelineItemToDay(item, date);
  const startMs = clipped?.startMs ?? item.startTime;
  const endMs = clipped?.endMs ?? item.endTime;
  const durationMs = clipped?.durationMs ?? item.durationMs;
  const endLabel = item.endTime ? formatTime(endMs!) : 'now';
  const noteSuffix = item.note ? `, note: ${item.note}` : '';
  const a11yLabel = `${item.activityName}, ${formatTime(startMs)} to ${endLabel}, ${formatDurationHuman(durationMs)}${noteSuffix}`;
  const durationRatio = maxDurationMs > 0 ? durationMs / maxDurationMs : 0;

  return (
    <Animated.View
      entering={fadeInUp(index)}
      style={{
        marginTop: hasPriorNote ? tempoTokens.space.timelineNoteGap : 0,
      }}
    >
      <XStack gap="$2" ai="stretch">
        <YStack w={RAIL_WIDTH} ai="center" flexShrink={0}>
          <AppText
            variant="caption"
            color={colors.textMuted}
            fontSize={11}
            ta="center"
            fontFamily={tempoTokens.font.mono}
          >
            {formatTime(startMs)}
          </AppText>
          <YStack ai="center" f={1} w={RAIL_WIDTH} mt="$1">
            <View
              style={{
                width: DOT_SIZE,
                height: DOT_SIZE,
                borderRadius: DOT_SIZE / 2,
                backgroundColor: color,
              }}
            />
            {!isLast ? (
              <View
                style={{
                  width: SPINE_WIDTH,
                  flex: 1,
                  minHeight: 12,
                  backgroundColor: colors.border,
                  marginTop: 4,
                }}
              />
            ) : null}
          </YStack>
        </YStack>

        <YStack f={1} minWidth={0} pb={isLast ? 0 : '$1'}>
          <TerminalPanel
            pressable
            onPress={() => router.push(`/session/view/${item.sessionId}`)}
            accessibilityLabel={a11yLabel}
          >
            <YStack gap="$2">
              <XStack jc="space-between" ai="flex-start" gap="$2">
                <YStack f={1} gap="$1.5" minWidth={0}>
                  <XStack ai="center" gap="$2">
                    <Icon size={16} color={color} />
                    <AppText
                      variant="subtitle"
                      fontSize={15}
                      numberOfLines={1}
                      f={1}
                    >
                      {item.activityName}
                    </AppText>
                  </XStack>
                  <AppText variant="caption">
                    {formatTime(startMs)} – {endLabel}
                  </AppText>
                  {item.note ? (
                    <AppText
                      variant="caption"
                      color={colors.textMuted}
                      numberOfLines={2}
                      pb="$1"
                    >
                      {item.note}
                    </AppText>
                  ) : null}
                </YStack>
                <AppText
                  variant="caption"
                  color={colors.phosphor}
                  flexShrink={0}
                >
                  {formatDurationHuman(durationMs)}
                </AppText>
              </XStack>
              <BarTrack
                ratio={durationRatio}
                color={color}
                delayIndex={index}
              />
            </YStack>
          </TerminalPanel>
        </YStack>
      </XStack>
    </Animated.View>
  );
}
