import type { TempoDatabase } from './types';
import {
  CREATE_ACTIVITIES,
  CREATE_ACTIVITY_SESSIONS,
  CREATE_APP_SETTINGS,
  CREATE_SCHEMA_VERSION,
} from './schema';

const CURRENT_VERSION = 1;

export async function runMigrations(db: TempoDatabase): Promise<void> {
  await db.execAsync(CREATE_SCHEMA_VERSION);
  await db.execAsync(CREATE_ACTIVITIES);
  await db.execAsync(CREATE_ACTIVITY_SESSIONS);
  await db.execAsync(CREATE_APP_SETTINGS);

  const row = await db.getFirstAsync<{ version: number }>(
    'SELECT version FROM schema_version LIMIT 1'
  );

  if (!row) {
    await db.runAsync('INSERT INTO schema_version (version) VALUES (?)', [
      CURRENT_VERSION,
    ]);
    return;
  }

  if (row.version < CURRENT_VERSION) {
    await db.runAsync('UPDATE schema_version SET version = ?', [CURRENT_VERSION]);
  }
}
