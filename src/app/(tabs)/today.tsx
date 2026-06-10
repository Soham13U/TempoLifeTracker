import { ActiveTimerCard } from '@/components/timer/ActiveTimerCard';
import { ActivityGrid } from '@/components/timer/ActivityGrid';
import { TerminalPanel } from '@/components/terminal/TerminalPanel';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatRow } from '@/components/ui/StatRow';
import { useDayData } from '@/hooks/useDayData';
import { CATEGORY_LABELS } from '@/utils/categories';
import { getGreeting } from '@/utils/date';
import { formatDurationHuman } from '@/utils/duration';
import { ACTIVITY_CATEGORIES } from '@/types/activity';
import { YStack } from '@/components/ui/stacks';
import { startOfDay } from 'date-fns';
import { useMemo } from 'react';

export default function TodayScreen() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const { activities, totalMs, categoryTotals } = useDayData(today);

  const summaryLines = ACTIVITY_CATEGORIES.filter(
    (c) => categoryTotals[c] > 0
  ).slice(0, 4);

  return (
    <Screen>
      <AppText variant="title">{getGreeting()}</AppText>

      <ActiveTimerCard />
      <ActivityGrid activities={activities} />

      <YStack gap="$2">
        <SectionHeader title="Today" />
        <TerminalPanel>
          <YStack gap="$2">
            <StatRow
              label="Total tracked"
              value={formatDurationHuman(totalMs)}
            />
            {summaryLines.map((cat) => (
              <StatRow
                key={cat}
                label={CATEGORY_LABELS[cat]}
                value={formatDurationHuman(categoryTotals[cat])}
              />
            ))}
          </YStack>
        </TerminalPanel>
      </YStack>
    </Screen>
  );
}
