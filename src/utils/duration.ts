import type { ActivitySession } from '@/types/session';
import type { ActiveTimerState } from '@/types/session';

export function getElapsedMs(
  session: ActivitySession,
  activeState?: ActiveTimerState
): number {
  const now = Date.now();
  const rawEnd = session.endTime ?? now;
  const pausedExtra =
    activeState?.isPaused && activeState.pausedAt
      ? now - activeState.pausedAt
      : 0;

  return Math.max(
    0,
    rawEnd - session.startTime - session.pausedDurationMs - pausedExtra
  );
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function formatDurationHuman(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return '<1m';
}
