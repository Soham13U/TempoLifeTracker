import { TerminalMeter } from '@/components/terminal/TerminalMeter';
import { TerminalPanel } from '@/components/terminal/TerminalPanel';
import { AppText } from '@/components/ui/AppText';
import { tempoTokens } from '@/theme/tokens';
import type { Activity } from '@/types/activity';
import type { ActivitySession } from '@/types/session';
import { getAllActivitiesSorted } from '@/utils/analytics';
import { getCategoryColor } from '@/utils/colors';
import { formatDurationHuman } from '@/utils/duration';
import { useThemeColors } from '@/utils/themeColors';
import { ScrollView } from 'react-native';
import { YStack, XStack } from '@/components/ui/stacks';

type Props = {
  sessions: ActivitySession[];
  activities: Activity[];
  totalMs: number;
  activeState?: Parameters<typeof import('@/utils/duration').getElapsedMs>[1];
};

export function ActivityBreakdown({
  sessions,
  activities,
  totalMs,
  activeState,
}: Props) {
  const colors = useThemeColors();
  const entries = getAllActivitiesSorted(sessions, activities, activeState);

  if (entries.length === 0) {
    return null;
  }

  const max = Math.max(...entries.map((e) => e.durationMs), 1);
  const needsScroll = entries.length > 10;

  const content = (
    <YStack gap="$3">
      {entries.map(({ activity, durationMs }, index) => {
        const color = activity.color ?? getCategoryColor(activity.category);
        const ratio = durationMs / max;
        const pct =
          totalMs > 0 ? Math.round((durationMs / totalMs) * 100) : null;
        const durationLabel =
          pct !== null
            ? `${formatDurationHuman(durationMs)} · ${pct}%`
            : formatDurationHuman(durationMs);

        return (
          <YStack key={activity.id} gap="$1">
            <XStack jc="space-between" ai="center" gap="$2">
              <XStack f={1} ai="center" gap="$2" minWidth={0}>
                <AppText variant="caption" color={colors.phosphor} flexShrink={0}>
                  {'>'}
                </AppText>
                <AppText variant="caption" numberOfLines={1} f={1}>
                  {activity.name}
                </AppText>
              </XStack>
              <AppText variant="caption" color={colors.phosphor} flexShrink={0}>
                {durationLabel}
              </AppText>
            </XStack>
            <TerminalMeter ratio={ratio} color={color} delayIndex={index} />
          </YStack>
        );
      })}
    </YStack>
  );

  return (
    <TerminalPanel>
      {needsScroll ? (
        <ScrollView
          style={{ maxHeight: tempoTokens.size.activityListMaxHeight }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </TerminalPanel>
  );
}
