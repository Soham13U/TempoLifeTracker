import { GlowFrame } from '@/components/terminal/GlowFrame';
import { TerminalPanel } from '@/components/terminal/TerminalPanel';
import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { useTimerStore } from '@/store/timerStore';
import * as activityRepo from '@/db/activityRepo';
import { formatDuration, getElapsedMs } from '@/utils/duration';
import { getActivityIcon } from '@/utils/icons';
import { getCategoryColor } from '@/utils/colors';
import { useThemeColors } from '@/utils/themeColors';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { XStack, YStack } from '@/components/ui/stacks';
import type { Activity } from '@/types/activity';

export function ActiveTimerCard() {
  const router = useRouter();
  const colors = useThemeColors();
  const activeSession = useTimerStore((s) => s.activeSession);
  const activityId = useTimerStore((s) => s.activityId);
  const isPaused = useTimerStore((s) => s.isPaused);
  const pauseTimer = useTimerStore((s) => s.pauseTimer);
  const resumeTimer = useTimerStore((s) => s.resumeTimer);
  const stopTimer = useTimerStore((s) => s.stopTimer);
  const refreshTick = useTimerStore((s) => s.refreshTick);
  const tick = useTimerStore((s) => s.tick);
  const activeSessionId = useTimerStore((s) => s.activeSessionId);
  const startTime = useTimerStore((s) => s.startTime);
  const pausedAt = useTimerStore((s) => s.pausedAt);
  const pausedDurationMs = useTimerStore((s) => s.pausedDurationMs);
  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    if (!activityId) {
      setActivity(null);
      return;
    }
    activityRepo.getActivityById(activityId).then(setActivity);
  }, [activityId]);

  useEffect(() => {
    if (!activeSession) return;
    const id = setInterval(() => refreshTick(), 1000);
    return () => clearInterval(id);
  }, [activeSession, refreshTick]);

  void tick;

  if (!activeSession || !activity) {
    return (
      <TerminalPanel>
        <YStack ai="center" gap="$2" py="$4">
          <AppText variant="label" color={colors.phosphor}>
            // IDLE
          </AppText>
          <AppText variant="subtitle">No active timer</AppText>
          <AppText variant="caption" ta="center">
            Tap an activity below to start tracking
          </AppText>
        </YStack>
      </TerminalPanel>
    );
  }

  const elapsed = getElapsedMs(activeSession, {
    activeSessionId,
    activityId,
    startTime,
    pausedAt,
    pausedDurationMs,
    isPaused,
  });
  const Icon = getActivityIcon(activity.icon);
  const color = activity.color ?? getCategoryColor(activity.category);
  const status = isPaused ? 'PAUSED' : 'RUNNING';

  return (
    <GlowFrame active={!isPaused}>
      <TerminalPanel>
        <YStack gap="$4" ai="center">
          <AppText variant="label" color={colors.phosphor}>
            // {status}
          </AppText>
          <XStack ai="center" gap="$2">
            <Icon size={20} color={color} />
            <AppText variant="subtitle">{activity.name}</AppText>
          </XStack>
          <AppText variant="timer">{formatDuration(elapsed)}</AppText>
          <XStack gap="$3" w="100%" ai="stretch">
            <AppButton
              f={1}
              variant="secondary"
              onPress={() => (isPaused ? resumeTimer() : pauseTimer())}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </AppButton>
            <AppButton f={1} variant="primary" onPress={() => stopTimer()}>
              Stop
            </AppButton>
          </XStack>
          <AppButton
            variant="ghost"
            onPress={() => router.push(`/session/view/${activeSession.id}`)}
          >
            {activeSession.note ? 'View note' : 'Add note'}
          </AppButton>
        </YStack>
      </TerminalPanel>
    </GlowFrame>
  );
}
