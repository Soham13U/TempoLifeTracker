import { ColumnTrack } from '@/components/charts/ColumnTrack';
import { TerminalPanel } from '@/components/terminal/TerminalPanel';
import { AppText } from '@/components/ui/AppText';
import { getSessionsForDay, getTotalTrackedMs } from '@/utils/analytics';
import { formatShortDate, isSameLocalDay } from '@/utils/date';
import { formatDurationHuman } from '@/utils/duration';
import { useThemeColors } from '@/utils/themeColors';
import { startOfDay, subDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { Spinner } from 'tamagui';
import { XStack, YStack } from '@/components/ui/stacks';
import { SectionHeader } from '../ui/SectionHeader';

type DayTotal = { date: Date; totalMs: number };

const COLUMN_ROW_HEIGHT = 88;

export function WeeklySummary() {
  const colors = useThemeColors();
  const [days, setDays] = useState<DayTotal[]>([]);
  const [weekTotal, setWeekTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const today = startOfDay(new Date());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const results: DayTotal[] = [];
      let total = 0;
      for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const sessions = await getSessionsForDay(date);
        const ms = getTotalTrackedMs(sessions);
        results.push({ date, totalMs: ms });
        total += ms;
      }
      if (!cancelled) {
        setDays(results);
        setWeekTotal(total);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const max = Math.max(...days.map((d) => d.totalMs), 1);

  return (
    <YStack gap="$3">
      <SectionHeader title="This week" />
      <TerminalPanel>
        {loading ? (
          <YStack ai="center" jc="center" py="$6" gap="$2">
            <Spinner size="small" color={colors.phosphor} />
            <AppText variant="caption">Loading week summary…</AppText>
          </YStack>
        ) : (
          <YStack gap="$3">
            <AppText variant="label" color={colors.phosphor}>
              {`${formatDurationHuman(weekTotal)} tracked`}
            </AppText>
            <XStack ai="flex-end" jc="space-between" h={COLUMN_ROW_HEIGHT} gap="$1">
              {days.map((day, index) => {
                const ratio = day.totalMs / max;
                const isToday = isSameLocalDay(day.date, today);
                const columnColor = isToday
                  ? colors.phosphor
                  : colors.cyan;

                return (
                  <YStack key={day.date.toISOString()} ai="center" f={1} gap="$1">
                    {day.totalMs > 0 ? (
                      <AppText
                        variant="caption"
                        fontSize={10}
                        color={colors.textMuted}
                        numberOfLines={1}
                      >
                        {formatDurationHuman(day.totalMs)}
                      </AppText>
                    ) : (
                      <AppText variant="caption" fontSize={10} opacity={0}>
                        —
                      </AppText>
                    )}
                    <ColumnTrack
                      ratio={ratio}
                      delayIndex={index}
                      active={day.totalMs > 0}
                      color={day.totalMs > 0 ? columnColor : undefined}
                    />
                    <AppText variant="caption" fontSize={10}>
                      {formatShortDate(day.date)}
                    </AppText>
                  </YStack>
                );
              })}
            </XStack>
          </YStack>
        )}
      </TerminalPanel>
    </YStack>
  );
}
