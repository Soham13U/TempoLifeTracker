import { useActivityStore } from '@/store/activityStore';
import { useTimerStore } from '@/store/timerStore';
import type { ActivitySession } from '@/types/session';
import type { TimelineItem } from '@/types/dashboard';
import {
  getCategoryTotals,
  getSessionsForDay,
  getTimelineItems,
  getTotalTrackedMs,
} from '@/utils/analytics';
import { startOfDay } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';

function toDayMs(date: Date): number {
  return startOfDay(date).getTime();
}

export function useDayData(date: Date) {
  const dayMs = toDayMs(date);
  const activities = useActivityStore((s) => s.activities);
  const loadActivities = useActivityStore((s) => s.loadActivities);

  const tick = useTimerStore((s) => s.tick);
  const activeSessionId = useTimerStore((s) => s.activeSessionId);
  const activityId = useTimerStore((s) => s.activityId);
  const startTime = useTimerStore((s) => s.startTime);
  const pausedAt = useTimerStore((s) => s.pausedAt);
  const pausedDurationMs = useTimerStore((s) => s.pausedDurationMs);
  const isPaused = useTimerStore((s) => s.isPaused);

  const [sessions, setSessions] = useState<ActivitySession[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    await loadActivities();
    const daySessions = await getSessionsForDay(new Date(dayMs));
    setSessions(daySessions);
    setLoading(false);
  }, [dayMs, loadActivities]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  const activeState = useMemo(
    () =>
      activeSessionId
        ? {
            activeSessionId,
            activityId,
            startTime,
            pausedAt,
            pausedDurationMs,
            isPaused,
          }
        : undefined,
    [
      activeSessionId,
      activityId,
      startTime,
      pausedAt,
      pausedDurationMs,
      isPaused,
    ]
  );

  // Recompute totals when timer ticks (no refetch)
  void tick;

  const totalMs = getTotalTrackedMs(sessions, activeState);
  const categoryTotals = getCategoryTotals(sessions, activities, activeState);
  const timelineItems: TimelineItem[] = getTimelineItems(
    sessions,
    activities,
    activeState
  );

  return {
    sessions,
    activities,
    totalMs,
    categoryTotals,
    timelineItems,
    loading,
    refresh,
    activeState,
  };
}
