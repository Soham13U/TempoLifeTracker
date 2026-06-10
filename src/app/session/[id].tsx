import {
  SessionForm,
  parseTimeOnDate,
  type SessionFormValues,
} from '@/components/forms/SessionForm';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import * as activityRepo from '@/db/activityRepo';
import * as sessionRepo from '@/db/sessionRepo';
import { useTimerStore } from '@/store/timerStore';
import type { ActivitySession } from '@/types/session';
import { formatTime } from '@/utils/date';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Spinner } from 'tamagui';
import { YStack } from '@/components/ui/stacks';
import { useThemeColors } from '@/utils/themeColors';

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useThemeColors();
  const [session, setSession] = useState<ActivitySession | null>(null);
  const [activityName, setActivityName] = useState('');
  const loadActiveSession = useTimerStore((s) => s.loadActiveSession);

  useEffect(() => {
    if (!id) return;
    sessionRepo.getSessionById(id).then(async (s) => {
      if (!s) return;
      setSession(s);
      const activity = await activityRepo.getActivityById(s.activityId);
      setActivityName(activity?.name ?? 'Session');
    });
  }, [id]);

  if (!session) {
    return (
      <Screen scroll={false} header>
        <YStack f={1} ai="center" jc="center" gap="$3">
          <Spinner size="large" color={colors.primary} />
          <AppText variant="caption">Loading session…</AppText>
        </YStack>
      </Screen>
    );
  }

  const baseDate = new Date(session.startTime);
  const defaultValues: SessionFormValues = {
    startTime: formatTime(session.startTime),
    endTime: session.endTime ? formatTime(session.endTime) : '',
    note: session.note ?? '',
  };

  const onSubmit = async (values: SessionFormValues) => {
    const startTime = parseTimeOnDate(values.startTime, baseDate);
    let endTime: number | null = values.endTime
      ? parseTimeOnDate(values.endTime, baseDate)
      : null;

    if (endTime !== null && endTime < startTime) {
      endTime += 24 * 60 * 60 * 1000;
    }

    await sessionRepo.updateSession(session.id, {
      startTime,
      endTime,
      note: values.note || undefined,
    });
    await loadActiveSession();
    router.back();
  };

  const onDelete = async () => {
    Alert.alert('Delete session', 'Remove this session permanently?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const isActive = useTimerStore.getState().activeSessionId === session.id;
          if (isActive) {
            await useTimerStore.getState().stopTimer();
          }
          await sessionRepo.deleteSession(session.id);
          await loadActiveSession();
          router.back();
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ title: activityName }} />
      <Screen header>
        <YStack gap="$4">
          <AppText variant="caption">Edit times in local timezone (HH:mm)</AppText>
          <SessionForm
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            onDelete={onDelete}
          />
        </YStack>
      </Screen>
    </>
  );
}
