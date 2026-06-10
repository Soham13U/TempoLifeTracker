import { SessionNotesList } from '@/components/detail/SessionNotesList';
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
import { formatDateLabel, getDayBounds } from '@/utils/date';
import { formatDurationHuman, getElapsedMs } from '@/utils/duration';
import { getActivityIcon } from '@/utils/icons';
import { tempoTokens } from '@/theme/tokens';
import { useThemeColors } from '@/utils/themeColors';
import { parseISO, startOfDay } from 'date-fns';
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Spinner } from 'tamagui';
import { XStack, YStack } from '@/components/ui/stacks';

export default function ActivityViewScreen() {
  const { id, date: dateParam } = useLocalSearchParams<{
    id: string;
    date?: string;
  }>();
  const router = useRouter();
  const colors = useThemeColors();
  const activeSessionId = useTimerStore((s) => s.activeSessionId);
  const storeActivityId = useTimerStore((s) => s.activityId);
  const startTime = useTimerStore((s) => s.startTime);
  const pausedAt = useTimerStore((s) => s.pausedAt);
  const pausedDurationMs = useTimerStore((s) => s.pausedDurationMs);
  const isPaused = useTimerStore((s) => s.isPaused);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [sessions, setSessions] = useState<ActivitySession[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedDate = useMemo(() => {
    if (dateParam) {
      const parsed = parseISO(dateParam);
      if (!Number.isNaN(parsed.getTime())) {
        return startOfDay(parsed);
      }
    }
    return startOfDay(new Date());
  }, [dateParam]);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const a = await activityRepo.getActivityById(id);
    if (!a) {
      setActivity(null);
      setSessions([]);
      setLoading(false);
      return;
    }
    const { start, end } = getDayBounds(selectedDate);
    const daySessions = await sessionRepo.getSessionsInRange(start, end);
    const forActivity = daySessions.filter((s) => s.activityId === id);
    setActivity(a);
    setSessions(forActivity);
    setLoading(false);
  }, [id, selectedDate]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const activeState = {
    activeSessionId,
    activityId: storeActivityId,
    startTime,
    pausedAt,
    pausedDurationMs,
    isPaused,
  };

  const totalMs = useMemo(
    () =>
      sessions.reduce(
        (sum, s) => sum + getElapsedMs(s, activeState),
        0
      ),
    [sessions, activeSessionId, storeActivityId, startTime, pausedAt, pausedDurationMs, isPaused]
  );

  if (loading) {
    return (
      <Screen scroll={false} header>
        <YStack f={1} ai="center" jc="center" gap="$3">
          <Spinner size="large" color={colors.primary} />
          <AppText variant="caption">Loading activity…</AppText>
        </YStack>
      </Screen>
    );
  }

  if (!activity) {
    return (
      <Screen header>
        <YStack gap="$4" ai="center" py="$6">
          <AppText variant="subtitle">Activity not found</AppText>
          <AppButton variant="secondary" onPress={() => router.back()}>
            Close
          </AppButton>
        </YStack>
      </Screen>
    );
  }

  const Icon = getActivityIcon(activity.icon);
  const color = activity.color ?? getCategoryColor(activity.category);

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
                <StatRow label="Date" value={formatDateLabel(selectedDate)} />
                <StatRow
                  label="Total tracked"
                  value={formatDurationHuman(totalMs)}
                  accentValue
                />
                <StatRow label="Sessions" value={String(sessions.length)} />
              </YStack>
            </YStack>
          </TerminalPanel>

          <SessionNotesList sessions={sessions} />

          <AppButton onPress={() => router.push(`/activity/${activity.id}`)}>
            Edit
          </AppButton>
        </YStack>
      </Screen>
    </>
  );
}
