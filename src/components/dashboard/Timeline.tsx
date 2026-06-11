import type { TimelineItem as TimelineItemType } from '@/types/dashboard';
import { EmptyState } from '../ui/EmptyState';
import { VerticalTimeline } from './VerticalTimeline';

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

  return <VerticalTimeline items={display} date={date} />;
}
