import { TerminalMeter } from '@/components/terminal/TerminalMeter';
import { TerminalPanel } from '@/components/terminal/TerminalPanel';
import { AppText } from '@/components/ui/AppText';
import type { ActivityCategory } from '@/types/activity';
import { ACTIVITY_CATEGORIES } from '@/types/activity';
import { CATEGORY_LABELS } from '@/utils/categories';
import { getCategoryColor } from '@/utils/colors';
import { formatDurationHuman } from '@/utils/duration';
import { useThemeColors } from '@/utils/themeColors';
import { YStack, XStack } from '@/components/ui/stacks';

type Props = {
  totals: Record<ActivityCategory, number>;
};

export function CategoryBreakdown({ totals }: Props) {
  const colors = useThemeColors();
  const entries = ACTIVITY_CATEGORIES.filter((c) => totals[c] > 0);

  if (entries.length === 0) {
    return null;
  }

  const max = Math.max(...entries.map((c) => totals[c]), 1);

  return (
    <TerminalPanel>
      <YStack gap="$3">
        {entries.map((category, index) => {
          const ms = totals[category];
          const ratio = ms / max;
          const categoryColor = getCategoryColor(category);

          return (
            <YStack key={category} gap="$1">
              <XStack jc="space-between" ai="center" gap="$3">
                <AppText
                  variant="caption"
                  color={colors.phosphor}
                  f={1}
                  minWidth={0}
                  numberOfLines={1}
                >
                  {`> ${CATEGORY_LABELS[category].toUpperCase()}`}
                </AppText>
                <AppText variant="caption" color={colors.phosphor} flexShrink={0}>
                  {formatDurationHuman(ms)}
                </AppText>
              </XStack>
              <TerminalMeter
                ratio={ratio}
                color={categoryColor}
                delayIndex={index}
              />
            </YStack>
          );
        })}
      </YStack>
    </TerminalPanel>
  );
}
