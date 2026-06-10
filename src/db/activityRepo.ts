import type { Activity, ActivityCategory } from '@/types/activity';
import { generateId } from '@/utils/id';
import { getDatabase } from './database';

type ActivityRow = {
  id: string;
  name: string;
  category: string;
  icon: string | null;
  color: string | null;
  is_archived: number;
  created_at: number;
  updated_at: number;
};

function mapRow(row: ActivityRow): Activity {
  return {
    id: row.id,
    name: row.name,
    category: row.category as ActivityCategory,
    icon: row.icon ?? undefined,
    color: row.color ?? undefined,
    isArchived: row.is_archived === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAllActivities(includeArchived = false): Promise<Activity[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<ActivityRow>(
    includeArchived
      ? 'SELECT * FROM activities ORDER BY category, name'
      : 'SELECT * FROM activities WHERE is_archived = 0 ORDER BY category, name'
  );
  return rows.map(mapRow);
}

export async function getActivityById(id: string): Promise<Activity | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<ActivityRow>(
    'SELECT * FROM activities WHERE id = ?',
    [id]
  );
  return row ? mapRow(row) : null;
}

export async function createActivity(input: {
  name: string;
  category: ActivityCategory;
  icon?: string;
  color?: string;
}): Promise<Activity> {
  const db = await getDatabase();
  const now = Date.now();
  const id = generateId();
  await db.runAsync(
    `INSERT INTO activities (id, name, category, icon, color, is_archived, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 0, ?, ?)`,
    [id, input.name, input.category, input.icon ?? null, input.color ?? null, now, now]
  );
  const created = await getActivityById(id);
  if (!created) throw new Error('Failed to create activity');
  return created;
}

export async function updateActivity(
  id: string,
  input: Partial<Pick<Activity, 'name' | 'category' | 'icon' | 'color' | 'isArchived'>>
): Promise<Activity> {
  const existing = await getActivityById(id);
  if (!existing) throw new Error('Activity not found');

  const updated: Activity = {
    ...existing,
    ...input,
    updatedAt: Date.now(),
  };

  const db = await getDatabase();
  await db.runAsync(
    `UPDATE activities SET name = ?, category = ?, icon = ?, color = ?, is_archived = ?, updated_at = ?
     WHERE id = ?`,
    [
      updated.name,
      updated.category,
      updated.icon ?? null,
      updated.color ?? null,
      updated.isArchived ? 1 : 0,
      updated.updatedAt,
      id,
    ]
  );
  return updated;
}

export async function archiveActivity(id: string): Promise<void> {
  await updateActivity(id, { isArchived: true });
}
