import { MeterListRow, MeterListSection } from '@/components/dashboard/MeterListRow';
import { TerminalPanel } from '@/components/terminal/TerminalPanel';
import { tempoTokens } from '@/theme/tokens';
import type { Activity } from '@/types/activity';
import type { ActivitySession } from '@/types/session';
import { getAllActivitiesSorted } from '@/utils/analytics';
import { getCategoryColor } from '@/utils/colors';
import { formatDurationHuman } from '@/utils/duration';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';

type Props = {
  sessions: ActivitySession[];
  activities: Activity[];
  totalMs: number;
  selectedDate: Date;
  activeState?: Parameters<typeof import('@/utils/duration').getElapsedMs>[1];
};

export function ActivityBreakdown({
  sessions,
  activities,
  totalMs,
  selectedDate,
  activeState,
}: Props) {
  const router = useRouter();
  const dateParam = format(selectedDate, 'yyyy-MM-dd');
  const entries = getAllActivitiesSorted(sessions, activities, activeState);

  if (entries.length === 0) {
    return null;
  }

  const max = Math.max(...entries.map((e) => e.durationMs), 1);
  const needsScroll = entries.length > 10;

  const content = (
    <MeterListSection>
      {entries.map(({ activity, durationMs }, index) => {
        const color = activity.color ?? getCategoryColor(activity.category);
        const ratio = durationMs / max;
        const pct =
          totalMs > 0 ? Math.round((durationMs / totalMs) * 100) : null;
        const durationLabel =
          pct !== null
            ? `${formatDurationHuman(durationMs)} – ${pct}%`
            : formatDurationHuman(durationMs);

        return (
          <MeterListRow
            key={activity.id}
            label={activity.name}
            durationLabel={durationLabel}
            ratio={ratio}
            color={color}
            delayIndex={index}
            onPress={() =>
              router.push(`/activity/view/${activity.id}?date=${dateParam}`)
            }
          />
        );
      })}
    </MeterListSection>
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
