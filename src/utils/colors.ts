import type { ActivityCategory } from '@/types/activity';

export const CATEGORY_COLORS: Record<ActivityCategory, string> = {
  focus: '#5B8DEF',
  learning: '#9B7EDE',
  health: '#5CB87A',
  life: '#D4A054',
  leisure: '#E07AAC',
  rest: '#7B8CDE',
  other: '#8E8E93',
};

export function getCategoryColor(category: ActivityCategory): string {
  return CATEGORY_COLORS[category];
}
