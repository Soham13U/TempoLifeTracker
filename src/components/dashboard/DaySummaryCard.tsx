import { TerminalPanel } from '@/components/terminal/TerminalPanel';
import { AppText } from '@/components/ui/AppText';
import { useThemeColors } from '@/utils/themeColors';
import { formatDurationHuman } from '@/utils/duration';
import { YStack } from '@/components/ui/stacks';

type Props = {
  totalMs: number;
  label?: string;
};

export function DaySummaryCard({ totalMs, label = 'TOTAL TRACKED' }: Props) {
  const colors = useThemeColors();

  return (
    <TerminalPanel>
      <YStack ai="center" gap="$1" py="$2">
        <AppText variant="label" color={colors.phosphor}>
          // {label}
        </AppText>
        <AppText variant="timer" fontSize={36}>
          {formatDurationHuman(totalMs)}
        </AppText>
      </YStack>
    </TerminalPanel>
  );
}
