import { BarTrack } from '@/components/charts/BarTrack';
import { TerminalPanel } from '@/components/terminal/TerminalPanel';
import { AppText } from '@/components/ui/AppText';
import { useThemeColors } from '@/utils/themeColors';
import { formatDurationHuman } from '@/utils/duration';
import { YStack } from '@/components/ui/stacks';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

type Props = {
  totalMs: number;
  label?: string;
};

export function DaySummaryCard({ totalMs, label = 'TOTAL TRACKED' }: Props) {
  const colors = useThemeColors();
  const dayRatio = Math.min(1, totalMs / MS_PER_DAY);
  const dayPercent = Math.round(dayRatio * 100);

  return (
    <TerminalPanel>
      <YStack ai="center" gap="$2" py="$2">
        <AppText variant="label" color={colors.phosphor}>
          {label}
        </AppText>
        <AppText
          variant="timer"
          fontSize={36}
          lineHeight={40}
          letterSpacing={0}
        >
          {formatDurationHuman(totalMs)}
        </AppText>
        <YStack w="100%" gap="$1" px="$1">
          <BarTrack ratio={dayRatio} color={colors.phosphor} />
          <AppText variant="caption" ta="center" color={colors.textMuted}>
            {totalMs > 0 ? `${dayPercent}% of day` : '—'}
          </AppText>
        </YStack>
      </YStack>
    </TerminalPanel>
  );
}
