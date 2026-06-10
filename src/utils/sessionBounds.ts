import type { TimelineItem } from '@/types/dashboard';
import type { ActivitySession } from '@/types/session';
import { getDayBounds, isSameLocalDay } from './date';
import { getElapsedMs } from './duration';

type ActiveState = Parameters<typeof getElapsedMs>[1];

export type ClippedSession = {
  sessionId: string;
  startMs: number;
  endMs: number;
  durationMs: number;
};

function resolveEndMs(
  session: Pick<ActivitySession, 'endTime'>,
  dayDate: Date,
  activeState?: ActiveState
): number | null {
  if (session.endTime !== null) {
    return session.endTime;
  }
  if (isSameLocalDay(dayDate, new Date())) {
    return Date.now();
  }
  return null;
}

export function clipSessionToDay(
  session: ActivitySession,
  dayDate: Date,
  activeState?: ActiveState
): ClippedSession | null {
  const { start: dayStart, end: dayEnd } = getDayBounds(dayDate);
  const rawEnd = resolveEndMs(session, dayDate, activeState);
  if (rawEnd === null) {
    return null;
  }

  const startMs = Math.max(session.startTime, dayStart);
  const endMs = Math.min(rawEnd, dayEnd);

  if (endMs <= startMs) {
    return null;
  }

  return {
    sessionId: session.id,
    startMs,
    endMs,
    durationMs: endMs - startMs,
  };
}

export function clipTimelineItemToDay(
  item: TimelineItem,
  dayDate: Date
): ClippedSession | null {
  const { start: dayStart, end: dayEnd } = getDayBounds(dayDate);
  const rawEnd = item.endTime ?? (isSameLocalDay(dayDate, new Date()) ? Date.now() : null);
  if (rawEnd === null) {
    return null;
  }

  const startMs = Math.max(item.startTime, dayStart);
  const endMs = Math.min(rawEnd, dayEnd);

  if (endMs <= startMs) {
    return null;
  }

  return {
    sessionId: item.sessionId,
    startMs,
    endMs,
    durationMs: endMs - startMs,
  };
}

export type ChartBlock = {
  sessionId: string;
  startMs: number;
  endMs: number;
  lane: number;
  color: string;
  activityName: string;
  durationMs: number;
};

export function assignLanes(
  blocks: Omit<ChartBlock, 'lane'>[]
): ChartBlock[] {
  const sorted = [...blocks].sort((a, b) => a.startMs - b.startMs);
  const laneEnds: number[] = [];
  const result: ChartBlock[] = [];

  for (const block of sorted) {
    let lane = laneEnds.findIndex((end) => end <= block.startMs);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(block.endMs);
    } else {
      laneEnds[lane] = block.endMs;
    }
    result.push({ ...block, lane });
  }

  return result;
}
