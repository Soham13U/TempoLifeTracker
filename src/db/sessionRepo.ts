import type { ActivitySession } from '@/types/session';
import { generateId } from '@/utils/id';
import { getDatabase } from './database';

type SessionRow = {
  id: string;
  activity_id: string;
  start_time: number;
  end_time: number | null;
  paused_duration_ms: number;
  note: string | null;
  created_at: number;
  updated_at: number;
};

function mapRow(row: SessionRow): ActivitySession {
  return {
    id: row.id,
    activityId: row.activity_id,
    startTime: row.start_time,
    endTime: row.end_time,
    pausedDurationMs: row.paused_duration_ms,
    note: row.note ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getSessionById(id: string): Promise<ActivitySession | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<SessionRow>(
    'SELECT * FROM activity_sessions WHERE id = ?',
    [id]
  );
  return row ? mapRow(row) : null;
}

export async function getActiveSession(): Promise<ActivitySession | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<SessionRow>(
    'SELECT * FROM activity_sessions WHERE end_time IS NULL ORDER BY start_time DESC LIMIT 1'
  );
  return row ? mapRow(row) : null;
}

export async function getSessionsInRange(
  startMs: number,
  endMs: number
): Promise<ActivitySession[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<SessionRow>(
    `SELECT * FROM activity_sessions
     WHERE start_time <= ? AND (end_time IS NULL OR end_time >= ?)
     ORDER BY start_time ASC`,
    [endMs, startMs]
  );
  return rows.map(mapRow);
}

export async function createSession(input: {
  activityId: string;
  startTime?: number;
}): Promise<ActivitySession> {
  const db = await getDatabase();
  const now = Date.now();
  const id = generateId();
  const startTime = input.startTime ?? now;

  await db.runAsync(
    `INSERT INTO activity_sessions
     (id, activity_id, start_time, end_time, paused_duration_ms, note, created_at, updated_at)
     VALUES (?, ?, ?, NULL, 0, NULL, ?, ?)`,
    [id, input.activityId, startTime, now, now]
  );

  const session = await getSessionById(id);
  if (!session) throw new Error('Failed to create session');
  return session;
}

export async function updateSession(
  id: string,
  input: Partial<
    Pick<ActivitySession, 'startTime' | 'endTime' | 'pausedDurationMs' | 'note'>
  >
): Promise<ActivitySession> {
  const existing = await getSessionById(id);
  if (!existing) throw new Error('Session not found');

  const updated: ActivitySession = {
    ...existing,
    ...input,
    updatedAt: Date.now(),
  };

  const db = await getDatabase();
  await db.runAsync(
    `UPDATE activity_sessions
     SET start_time = ?, end_time = ?, paused_duration_ms = ?, note = ?, updated_at = ?
     WHERE id = ?`,
    [
      updated.startTime,
      updated.endTime,
      updated.pausedDurationMs,
      updated.note ?? null,
      updated.updatedAt,
      id,
    ]
  );
  return updated;
}

export async function deleteSession(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM activity_sessions WHERE id = ?', [id]);
}

export async function getAllSessions(): Promise<ActivitySession[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<SessionRow>(
    'SELECT * FROM activity_sessions ORDER BY start_time DESC'
  );
  return rows.map(mapRow);
}
