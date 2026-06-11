import type { ActivityCategory } from './activity';

export type TimelineItem = {
  sessionId: string;
  activityId: string;
  activityName: string;
  category: ActivityCategory;
  startTime: number;
  endTime: number | null;
  durationMs: number;
  note?: string;
  color?: string;
  icon?: string;
};

export type ThemePreference = 'system' | 'light' | 'dark';

export type ColorScheme = 'phosphor' | 'ink' | 'stone' | 'copper' | 'slate';
