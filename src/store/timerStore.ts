import * as settingsRepo from '@/db/settingsRepo';
import * as sessionRepo from '@/db/sessionRepo';
import type { ActivitySession } from '@/types/session';
import type { ActiveTimerState } from '@/types/session';
import { EMPTY_ACTIVE_TIMER } from '@/types/session';
import {
  cancelActiveTimerNotification,
  showActiveTimerNotification,
} from '@/services/notifications';
import * as activityRepo from '@/db/activityRepo';
import { lightImpact, mediumImpact, selection } from '@/motion/haptics';
import { create } from 'zustand';

type TimerStore = ActiveTimerState & {
  activeSession: ActivitySession | null;
  isLoading: boolean;
  tick: number;
  startActivity: (activityId: string) => Promise<void>;
  pauseTimer: () => Promise<void>;
  resumeTimer: () => Promise<void>;
  stopTimer: () => Promise<void>;
  switchActivity: (activityId: string) => Promise<void>;
  loadActiveSession: () => Promise<void>;
  refreshTick: () => void;
};

async function persistState(state: ActiveTimerState): Promise<void> {
  if (!state.activeSessionId) {
    await settingsRepo.clearActiveTimerState();
    return;
  }
  await settingsRepo.setActiveTimerState(state);
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  ...EMPTY_ACTIVE_TIMER,
  activeSession: null,
  isLoading: true,
  tick: 0,

  refreshTick: () => set({ tick: Date.now() }),

  loadActiveSession: async () => {
    set({ isLoading: true });
    try {
      const saved = await settingsRepo.getActiveTimerState();
      const openSession = await sessionRepo.getActiveSession();

      if (openSession) {
        const state: ActiveTimerState = {
          activeSessionId: openSession.id,
          activityId: openSession.activityId,
          startTime: openSession.startTime,
          pausedAt: saved.pausedAt,
          pausedDurationMs: openSession.pausedDurationMs,
          isPaused: saved.isPaused,
        };
        set({ ...state, activeSession: openSession, isLoading: false });
        await persistState(state);
      } else {
        set({ ...EMPTY_ACTIVE_TIMER, activeSession: null, isLoading: false });
        await settingsRepo.clearActiveTimerState();
      }
    } finally {
      set({ isLoading: false });
    }
  },

  startActivity: async (activityId: string) => {
    const { activeSessionId } = get();
    if (activeSessionId) {
      await get().switchActivity(activityId);
      return;
    }

    const session = await sessionRepo.createSession({ activityId });
    const activity = await activityRepo.getActivityById(activityId);
    const state: ActiveTimerState = {
      activeSessionId: session.id,
      activityId,
      startTime: session.startTime,
      pausedAt: null,
      pausedDurationMs: 0,
      isPaused: false,
    };

    set({ ...state, activeSession: session });
    await persistState(state);
    if (activity) await showActiveTimerNotification(activity.name);
    lightImpact();
  },

  pauseTimer: async () => {
    const { activeSessionId, isPaused } = get();
    if (!activeSessionId || isPaused) return;

    const pausedAt = Date.now();
    const state: ActiveTimerState = {
      ...get(),
      pausedAt,
      isPaused: true,
    };
    set({ pausedAt, isPaused: true });
    await persistState(state);
    selection();
  },

  resumeTimer: async () => {
    const { activeSession, activeSessionId, pausedAt, pausedDurationMs, isPaused } =
      get();
    if (!activeSessionId || !activeSession || !isPaused || !pausedAt) return;

    const pauseDelta = Date.now() - pausedAt;
    const newPausedMs = pausedDurationMs + pauseDelta;

    await sessionRepo.updateSession(activeSessionId, {
      pausedDurationMs: newPausedMs,
    });

    const updatedSession = {
      ...activeSession,
      pausedDurationMs: newPausedMs,
    };

    const state: ActiveTimerState = {
      ...get(),
      pausedAt: null,
      pausedDurationMs: newPausedMs,
      isPaused: false,
    };

    set({
      pausedAt: null,
      pausedDurationMs: newPausedMs,
      isPaused: false,
      activeSession: updatedSession,
    });
    await persistState(state);
    selection();
  },

  stopTimer: async () => {
    const {
      activeSessionId,
      activeSession,
      isPaused,
      pausedAt,
      pausedDurationMs,
    } = get();
    if (!activeSessionId || !activeSession) return;

    let finalPausedMs = pausedDurationMs;
    if (isPaused && pausedAt) {
      finalPausedMs += Date.now() - pausedAt;
    }

    const endTime = Date.now();
    await sessionRepo.updateSession(activeSessionId, {
      endTime,
      pausedDurationMs: finalPausedMs,
    });

    set({ ...EMPTY_ACTIVE_TIMER, activeSession: null });
    await settingsRepo.clearActiveTimerState();
    await cancelActiveTimerNotification();
    mediumImpact();
  },

  switchActivity: async (activityId: string) => {
    await get().stopTimer();
    await get().startActivity(activityId);
  },
}));
