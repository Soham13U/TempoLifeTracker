import { runMigrations } from './migrations';
import { seedDefaultActivities } from './seed';
import type { TempoDatabase } from './types';
import { WebDatabase } from './webDatabase';

let dbInstance: TempoDatabase | null = null;
let initPromise: Promise<TempoDatabase> | null = null;

export async function getDatabase(): Promise<TempoDatabase> {
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const db = new WebDatabase();
    await runMigrations(db);
    await seedDefaultActivities(db);
    dbInstance = db;
    return db;
  })();

  return initPromise;
}

export async function resetDatabase(): Promise<void> {
  const db = await getDatabase();
  await db.execAsync('DELETE FROM activity_sessions');
  await db.execAsync('DELETE FROM activities');
  await db.execAsync('DELETE FROM app_settings');
  await seedDefaultActivities(db);
}
