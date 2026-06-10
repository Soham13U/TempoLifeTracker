import * as sessionRepo from '@/db/sessionRepo';
import type { Activity } from '@/types/activity';
import type { ActivityCategory } from '@/types/activity';
import { ACTIVITY_CATEGORIES } from '@/types/activity';
import type { TimelineItem } from '@/types/dashboard';
import type { ActivitySession } from '@/types/session';
import { getDayBounds } from './date';
import { getElapsedMs } from './duration';

export async function getSessionsForDay(date: Date): Promise<ActivitySession[]> {
  const { start, end } = getDayBounds(date);
  const sessions = await sessionRepo.getSessionsInRange(start, end);
  return sessions.filter((s) => {
    const sessionEnd = s.endTime ?? Date.now();
    return s.startTime <= end && sessionEnd >= start;
  });
}

export function getTotalTrackedMs(
  sessions: ActivitySession[],
  activeState?: Parameters<typeof getElapsedMs>[1]
): number {
  return sessions.reduce((sum, session) => {
    if (session.endTime === null && !activeState) {
      return sum + getElapsedMs(session);
    }
    return sum + getElapsedMs(session, activeState);
  }, 0);
}

export function getCategoryTotals(
  sessions: ActivitySession[],
  activities: Activity[],
  activeState?: Parameters<typeof getElapsedMs>[1]
): Record<ActivityCategory, number> {
  const activityMap = new Map(activities.map((a) => [a.id, a]));
  const totals = Object.fromEntries(
    ACTIVITY_CATEGORIES.map((c) => [c, 0])
  ) as Record<ActivityCategory, number>;

  for (const session of sessions) {
    const activity = activityMap.get(session.activityId);
    if (!activity) continue;
    totals[activity.category] += getElapsedMs(session, activeState);
  }

  return totals;
}

export function getActivityTotals(
  sessions: ActivitySession[],
  activeState?: Parameters<typeof getElapsedMs>[1]
): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const session of sessions) {
    totals[session.activityId] =
      (totals[session.activityId] ?? 0) + getElapsedMs(session, activeState);
  }
  return totals;
}

export function getTimelineItems(
  sessions: ActivitySession[],
  activities: Activity[],
  activeState?: Parameters<typeof getElapsedMs>[1]
): TimelineItem[] {
  const activityMap = new Map(activities.map((a) => [a.id, a]));

  return [...sessions]
    .sort((a, b) => a.startTime - b.startTime)
    .map((session) => {
      const activity = activityMap.get(session.activityId);
      return {
        sessionId: session.id,
        activityId: session.activityId,
        activityName: activity?.name ?? 'Unknown',
        category: activity?.category ?? 'other',
        startTime: session.startTime,
        endTime: session.endTime,
        durationMs: getElapsedMs(session, activeState),
        note: session.note,
        color: activity?.color,
        icon: activity?.icon,
      };
    });
}

export function getTopActivities(
  sessions: ActivitySession[],
  activities: Activity[],
  limit = 5,
  activeState?: Parameters<typeof getElapsedMs>[1]
): { activity: Activity; durationMs: number }[] {
  return getAllActivitiesSorted(sessions, activities, activeState).slice(0, limit);
}

export function getAllActivitiesSorted(
  sessions: ActivitySession[],
  activities: Activity[],
  activeState?: Parameters<typeof getElapsedMs>[1]
): { activity: Activity; durationMs: number }[] {
  const totals = getActivityTotals(sessions, activeState);
  const activityMap = new Map(activities.map((a) => [a.id, a]));

  return Object.entries(totals)
    .map(([id, durationMs]) => {
      const activity = activityMap.get(id);
      if (!activity) {
        return null;
      }
      return { activity, durationMs };
    })
    .filter((x): x is { activity: Activity; durationMs: number } => x !== null && x.durationMs > 0)
    .sort((a, b) => b.durationMs - a.durationMs);
}
