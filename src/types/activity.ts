export type ActivityCategory =
  | 'focus'
  | 'learning'
  | 'health'
  | 'life'
  | 'leisure'
  | 'rest'
  | 'other';

export type Activity = {
  id: string;
  name: string;
  category: ActivityCategory;
  icon?: string;
  color?: string;
  isArchived: boolean;
  createdAt: number;
  updatedAt: number;
};

export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  'focus',
  'learning',
  'health',
  'life',
  'leisure',
  'rest',
  'other',
];
