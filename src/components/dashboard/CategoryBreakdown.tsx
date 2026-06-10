import { MeterListRow, MeterListSection } from '@/components/dashboard/MeterListRow';
import { TerminalPanel } from '@/components/terminal/TerminalPanel';
import type { ActivityCategory } from '@/types/activity';
import { ACTIVITY_CATEGORIES } from '@/types/activity';
import { CATEGORY_LABELS } from '@/utils/categories';
import { getCategoryColor } from '@/utils/colors';
import { formatDurationHuman } from '@/utils/duration';

type Props = {
  totals: Record<ActivityCategory, number>;
};

export function CategoryBreakdown({ totals }: Props) {
  const entries = ACTIVITY_CATEGORIES.filter((c) => totals[c] > 0);

  if (entries.length === 0) {
    return null;
  }

  const max = Math.max(...entries.map((c) => totals[c]), 1);

  return (
    <TerminalPanel>
      <MeterListSection>
        {entries.map((category, index) => {
          const ms = totals[category];
          const ratio = ms / max;
          const categoryColor = getCategoryColor(category);

          return (
            <MeterListRow
              key={category}
              label={CATEGORY_LABELS[category].toUpperCase()}
              durationLabel={formatDurationHuman(ms)}
              ratio={ratio}
              color={categoryColor}
              delayIndex={index}
            />
          );
        })}
      </MeterListSection>
    </TerminalPanel>
  );
}
