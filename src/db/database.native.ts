import * as SQLite from 'expo-sqlite';
import { runMigrations } from './migrations';
import { seedDefaultActivities } from './seed';
import type { TempoDatabase } from './types';

let dbInstance: TempoDatabase | null = null;
let initPromise: Promise<TempoDatabase> | null = null;

export async function getDatabase(): Promise<TempoDatabase> {
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const db = await SQLite.openDatabaseAsync('tempo.db');
    await runMigrations(db as TempoDatabase);
    await seedDefaultActivities(db as TempoDatabase);
    dbInstance = db as TempoDatabase;
    return dbInstance;
  })();

  return initPromise as Promise<TempoDatabase>;
}

export async function resetDatabase(): Promise<void> {
  const db = await getDatabase();
  await db.execAsync('DELETE FROM activity_sessions');
  await db.execAsync('DELETE FROM activities');
  await db.execAsync('DELETE FROM app_settings');
  await seedDefaultActivities(db);
}
