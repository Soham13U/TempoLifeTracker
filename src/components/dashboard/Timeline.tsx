import type { TimelineItem as TimelineItemType } from '@/types/dashboard';
import { YStack } from '@/components/ui/stacks';
import { EmptyState } from '../ui/EmptyState';
import { DayTimelineChart } from './DayTimelineChart';
import { TimelineItemRow } from './TimelineItem';

type Props = {
  items: TimelineItemType[];
  date: Date;
  compact?: boolean;
};

export function Timeline({ items, date, compact }: Props) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No sessions yet"
        message="Start a timer to build your timeline"
      />
    );
  }

  const display = compact ? items.slice(-5).reverse() : items;

  return (
    <YStack gap="$3">
      <DayTimelineChart items={items} date={date} />
      <YStack gap="$2">
        {display.map((item, index) => (
          <TimelineItemRow key={item.sessionId} item={item} index={index} />
        ))}
      </YStack>
    </YStack>
  );
}
