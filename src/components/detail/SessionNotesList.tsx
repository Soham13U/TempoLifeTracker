import { AppText } from '@/components/ui/AppText';
import { TerminalPanel } from '@/components/terminal/TerminalPanel';
import type { ActivitySession } from '@/types/session';
import { formatTime } from '@/utils/date';
import { useThemeColors } from '@/utils/themeColors';
import { YStack } from '@/components/ui/stacks';

type Props = {
  sessions: ActivitySession[];
  emptyLabel?: string;
};

export function SessionNotesList({
  sessions,
  emptyLabel = 'No notes today',
}: Props) {
  const colors = useThemeColors();
  const withNotes = sessions
    .filter((s) => s.note?.trim())
    .sort((a, b) => a.startTime - b.startTime);

  return (
    <YStack gap="$2">
      <AppText variant="label">Today&apos;s notes</AppText>
      <TerminalPanel>
        {withNotes.length === 0 ? (
          <AppText variant="caption" color={colors.textMuted}>
            {emptyLabel}
          </AppText>
        ) : (
          <YStack gap="$3">
            {withNotes.map((session) => {
              const endLabel = session.endTime
                ? formatTime(session.endTime)
                : 'now';
              return (
                <YStack key={session.id} gap="$1">
                  <AppText variant="caption" color={colors.textMuted}>
                    {formatTime(session.startTime)} – {endLabel}
                  </AppText>
                  <AppText variant="body">{session.note}</AppText>
                </YStack>
              );
            })}
          </YStack>
        )}
      </TerminalPanel>
    </YStack>
  );
}
