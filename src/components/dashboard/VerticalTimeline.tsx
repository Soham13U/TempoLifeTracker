import type { TimelineItem as TimelineItemType } from '@/types/dashboard';
import { clipTimelineItemToDay } from '@/utils/sessionBounds';
import { tempoTokens } from '@/theme/tokens';
import { YStack } from '@/components/ui/stacks';
import { TimelineItemRow } from './TimelineItem';

type Props = {
  items: TimelineItemType[];
  date: Date;
};

function getDisplayDuration(item: TimelineItemType, date: Date): number {
  const clipped = clipTimelineItemToDay(item, date);
  return clipped?.durationMs ?? item.durationMs;
}

export function VerticalTimeline({ items, date }: Props) {
  const maxDurationMs = Math.max(
    1,
    ...items.map((item) => getDisplayDuration(item, date))
  );

  return (
    <YStack gap={tempoTokens.space.timelineItem}>
      {items.map((item, index) => (
        <TimelineItemRow
          key={item.sessionId}
          item={item}
          date={date}
          index={index}
          isLast={index === items.length - 1}
          maxDurationMs={maxDurationMs}
          hasPriorNote={index > 0 && Boolean(items[index - 1]?.note)}
        />
      ))}
    </YStack>
  );
}
