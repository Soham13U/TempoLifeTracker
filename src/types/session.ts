export type ActivitySession = {
  id: string;
  activityId: string;
  startTime: number;
  endTime: number | null;
  pausedDurationMs: number;
  note?: string;
  createdAt: number;
  updatedAt: number;
};

export type ActiveTimerState = {
  activeSessionId: string | null;
  activityId: string | null;
  startTime: number | null;
  pausedAt: number | null;
  pausedDurationMs: number;
  isPaused: boolean;
};

export const EMPTY_ACTIVE_TIMER: ActiveTimerState = {
  activeSessionId: null,
  activityId: null,
  startTime: null,
  pausedAt: null,
  pausedDurationMs: 0,
  isPaused: false,
};
