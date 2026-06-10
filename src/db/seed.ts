import type { ActivityCategory } from '@/types/activity';
import { generateId } from '@/utils/id';
import type { TempoDatabase } from './types';

export const DEFAULT_ACTIVITIES: {
  name: string;
  category: ActivityCategory;
  icon: string;
}[] = [
  { name: 'Coding', category: 'focus', icon: 'code' },
  { name: 'Deep Work', category: 'focus', icon: 'target' },
  { name: 'Japanese', category: 'learning', icon: 'book-open' },
  { name: 'Reading', category: 'learning', icon: 'book' },
  { name: 'Piano', category: 'learning', icon: 'music' },
  { name: 'Workout', category: 'health', icon: 'dumbbell' },
  { name: 'Walk', category: 'health', icon: 'footprints' },
  { name: 'Cooking', category: 'life', icon: 'utensils' },
  { name: 'Cleaning', category: 'life', icon: 'sparkles' },
  { name: 'Gaming', category: 'leisure', icon: 'gamepad-2' },
  { name: 'Social', category: 'leisure', icon: 'users' },
  { name: 'Rest', category: 'rest', icon: 'moon' },
  { name: 'Other', category: 'other', icon: 'circle' },
];

export async function seedDefaultActivities(db: TempoDatabase): Promise<void> {
  const count = await db.getFirstAsync<{ c: number }>(
    'SELECT COUNT(*) as c FROM activities'
  );
  if (count && count.c > 0) return;

  const now = Date.now();
  for (const item of DEFAULT_ACTIVITIES) {
    const id = generateId();
    await db.runAsync(
      `INSERT INTO activities (id, name, category, icon, color, is_archived, created_at, updated_at)
       VALUES (?, ?, ?, ?, NULL, 0, ?, ?)`,
      [id, item.name, item.category, item.icon, now, now]
    );
  }
}
