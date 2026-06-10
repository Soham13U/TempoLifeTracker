import { ActivityBreakdown } from '@/components/dashboard/ActivityBreakdown';
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown';
import { DaySummaryCard } from '@/components/dashboard/DaySummaryCard';
import { Timeline } from '@/components/dashboard/Timeline';
import { WeeklySummary } from '@/components/dashboard/WeeklySummary';
import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useDayData } from '@/hooks/useDayData';
import { getAllActivitiesSorted } from '@/utils/analytics';
import { formatDateLabel } from '@/utils/date';
import { addDays, startOfDay, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { XStack } from '@/components/ui/stacks';

export default function DashboardScreen() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [selectedDate, setSelectedDate] = useState(today);
  const isToday = selectedDate.getTime() === today.getTime();
  const {
    activities,
    sessions,
    totalMs,
    categoryTotals,
    timelineItems,
    activeState,
  } = useDayData(selectedDate);

  const activityEntries = getAllActivitiesSorted(
    sessions,
    activities,
    activeState
  );

  return (
    <Screen>
      <XStack ai="center" jc="space-between">
        <IconButton
          icon={ChevronLeft}
          accessibilityLabel="Previous day"
          onPress={() => setSelectedDate((d) => subDays(d, 1))}
        />
        <AppText variant="subtitle" ta="center" f={1}>
          {formatDateLabel(selectedDate)}
        </AppText>
        <IconButton
          icon={ChevronRight}
          accessibilityLabel="Next day"
          disabled={isToday}
          onPress={() => setSelectedDate((d) => addDays(d, 1))}
        />
      </XStack>

      <DaySummaryCard totalMs={totalMs} />
      <SectionHeader title="Category Breakdown" />
      <CategoryBreakdown totals={categoryTotals} />

      {activityEntries.length > 0 ? (
        <>
          <SectionHeader title="Activities" />
          <ActivityBreakdown
            sessions={sessions}
            activities={activities}
            totalMs={totalMs}
            selectedDate={selectedDate}
            activeState={activeState}
          />
        </>
      ) : null}

      <SectionHeader title="Timeline" />
      <Timeline items={timelineItems} date={selectedDate} />

      <WeeklySummary />
    </Screen>
  );
}
