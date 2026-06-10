import { NoteBlock } from '@/components/detail/NoteBlock';
import { TerminalPanel } from '@/components/terminal/TerminalPanel';
import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { StatRow } from '@/components/ui/StatRow';
import * as activityRepo from '@/db/activityRepo';
import * as sessionRepo from '@/db/sessionRepo';
import { useTimerStore } from '@/store/timerStore';
import type { Activity } from '@/types/activity';
import type { ActivitySession } from '@/types/session';
import { CATEGORY_LABELS } from '@/utils/categories';
import { getCategoryColor } from '@/utils/colors';
import { formatDateLabel, formatTime } from '@/utils/date';
import { formatDurationHuman, getElapsedMs } from '@/utils/duration';
import { getActivityIcon } from '@/utils/icons';
import { tempoTokens } from '@/theme/tokens';
import { useThemeColors } from '@/utils/themeColors';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Spinner } from 'tamagui';
import { XStack, YStack } from '@/components/ui/stacks';

export default function SessionViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useThemeColors();
  const activeSessionId = useTimerStore((s) => s.activeSessionId);
  const activityId = useTimerStore((s) => s.activityId);
  const startTime = useTimerStore((s) => s.startTime);
  const pausedAt = useTimerStore((s) => s.pausedAt);
  const pausedDurationMs = useTimerStore((s) => s.pausedDurationMs);
  const isPaused = useTimerStore((s) => s.isPaused);
  const [session, setSession] = useState<ActivitySession | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const s = await sessionRepo.getSessionById(id);
    if (!s) {
      setSession(null);
      setActivity(null);
      setLoading(false);
      return;
    }
    const a = await activityRepo.getActivityById(s.activityId);
    setSession(s);
    setActivity(a);
    setLoading(false);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (loading) {
    return (
      <Screen scroll={false} header>
        <YStack f={1} ai="center" jc="center" gap="$3">
          <Spinner size="large" color={colors.primary} />
          <AppText variant="caption">Loading session…</AppText>
        </YStack>
      </Screen>
    );
  }

  if (!session || !activity) {
    return (
      <Screen header>
        <YStack gap="$4" ai="center" py="$6">
          <AppText variant="subtitle">Session not found</AppText>
          <AppButton variant="secondary" onPress={() => router.back()}>
            Close
          </AppButton>
        </YStack>
      </Screen>
    );
  }

  const isActive = session.endTime === null;
  const endLabel = isActive
    ? 'In progress'
    : formatTime(session.endTime as number);
  const durationMs = getElapsedMs(session, {
    activeSessionId,
    activityId,
    startTime,
    pausedAt,
    pausedDurationMs,
    isPaused,
  });
  const Icon = getActivityIcon(activity.icon);
  const color = activity.color ?? getCategoryColor(activity.category);
  const sessionDate = new Date(session.startTime);

  return (
    <>
      <Stack.Screen options={{ title: activity.name }} />
      <Screen header>
        <YStack gap="$4">
          <TerminalPanel>
            <YStack gap="$3">
              <XStack ai="center" gap="$3">
                <YStack
                  w={40}
                  h={40}
                  br={tempoTokens.radius.tile}
                  ai="center"
                  jc="center"
                  borderWidth={1}
                  borderColor={color}
                >
                  <Icon size={22} color={color} />
                </YStack>
                <YStack f={1} gap="$1" minWidth={0}>
                  <AppText variant="subtitle" numberOfLines={2}>
                    {activity.name}
                  </AppText>
                  <AppText variant="caption" color={colors.textMuted}>
                    {CATEGORY_LABELS[activity.category]}
                  </AppText>
                </YStack>
              </XStack>
              <YStack
                gap="$1.5"
                pt="$3"
                borderTopWidth={1}
                borderTopColor={colors.border}
              >
                <StatRow label="Date" value={formatDateLabel(sessionDate)} />
                <StatRow
                  label="Time"
                  value={`${formatTime(session.startTime)} – ${endLabel}`}
                />
                <StatRow
                  label="Duration"
                  value={formatDurationHuman(durationMs)}
                  accentValue
                />
              </YStack>
            </YStack>
          </TerminalPanel>

          <NoteBlock note={session.note} />

          <AppButton onPress={() => router.push(`/session/${session.id}`)}>
            Edit
          </AppButton>
        </YStack>
      </Screen>
    </>
  );
}
