import { AppText } from '@/components/ui/AppText';
import { TerminalPanel } from '@/components/terminal/TerminalPanel';
import { useThemeColors } from '@/utils/themeColors';
import { YStack } from '@/components/ui/stacks';

type Props = {
  title?: string;
  note?: string;
  emptyLabel?: string;
};

export function NoteBlock({
  title = 'Note',
  note,
  emptyLabel = 'No note added',
}: Props) {
  const colors = useThemeColors();

  return (
    <YStack gap="$2">
      <AppText variant="label">{title}</AppText>
      <TerminalPanel>
        {note ? (
          <AppText variant="body">{note}</AppText>
        ) : (
          <AppText variant="caption" color={colors.textMuted}>
            {emptyLabel}
          </AppText>
        )}
      </TerminalPanel>
    </YStack>
  );
}
