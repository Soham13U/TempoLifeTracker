import * as activityRepo from '@/db/activityRepo';
import type { Activity } from '@/types/activity';
import { create } from 'zustand';

type ActivityStore = {
  activities: Activity[];
  isLoading: boolean;
  loadActivities: () => Promise<void>;
};

export const useActivityStore = create<ActivityStore>((set) => ({
  activities: [],
  isLoading: false,

  loadActivities: async () => {
    set({ isLoading: true });
    try {
      const activities = await activityRepo.getAllActivities(false);
      set({ activities });
    } finally {
      set({ isLoading: false });
    }
  },
}));
