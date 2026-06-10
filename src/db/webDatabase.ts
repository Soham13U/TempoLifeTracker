import type { TempoDatabase } from './types';

const STORAGE_KEY = 'tempo-web-db-v1';

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

type SettingRow = { key: string; value: string };

type DbState = {
  schema_version: number | null;
  activities: ActivityRow[];
  activity_sessions: SessionRow[];
  app_settings: SettingRow[];
};

function emptyState(): DbState {
  return {
    schema_version: null,
    activities: [],
    activity_sessions: [],
    app_settings: [],
  };
}

function normalize(sql: string): string {
  return sql.replace(/\s+/g, ' ').trim();
}

function loadState(): DbState {
  if (typeof localStorage === 'undefined') {
    return emptyState();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    return JSON.parse(raw) as DbState;
  } catch {
    return emptyState();
  }
}

function saveState(state: DbState): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export class WebDatabase implements TempoDatabase {
  private state: DbState;

  constructor() {
    this.state = loadState();
  }

  private persist(): void {
    saveState(this.state);
  }

  async execAsync(source: string): Promise<void> {
    const sql = normalize(source);
    if (sql.startsWith('DELETE FROM activity_sessions')) {
      this.state.activity_sessions = [];
    } else if (sql.startsWith('DELETE FROM activities')) {
      this.state.activities = [];
    } else if (sql.startsWith('DELETE FROM app_settings')) {
      this.state.app_settings = [];
    }
    // CREATE TABLE — no-op; schema is implicit in DbState
    this.persist();
  }

  async runAsync(source: string, params: unknown[] = []): Promise<unknown> {
    const sql = normalize(source);

    if (sql.startsWith('INSERT INTO schema_version')) {
      this.state.schema_version = params[0] as number;
    } else if (sql.startsWith('UPDATE schema_version')) {
      this.state.schema_version = params[0] as number;
    } else if (sql.startsWith('INSERT INTO activities')) {
      const hasColorParam = params.length >= 7;
      this.state.activities.push({
        id: params[0] as string,
        name: params[1] as string,
        category: params[2] as string,
        icon: (params[3] as string | null) ?? null,
        color: hasColorParam ? ((params[4] as string | null) ?? null) : null,
        is_archived: 0,
        created_at: (hasColorParam ? params[5] : params[4]) as number,
        updated_at: (hasColorParam ? params[6] : params[5]) as number,
      });
    } else if (sql.startsWith('UPDATE activities SET')) {
      const id = params[6] as string;
      const idx = this.state.activities.findIndex((a) => a.id === id);
      if (idx >= 0) {
        this.state.activities[idx] = {
          ...this.state.activities[idx],
          name: params[0] as string,
          category: params[1] as string,
          icon: (params[2] as string | null) ?? null,
          color: (params[3] as string | null) ?? null,
          is_archived: params[4] as number,
          updated_at: params[5] as number,
        };
      }
    } else if (sql.startsWith('INSERT INTO activity_sessions')) {
      this.state.activity_sessions.push({
        id: params[0] as string,
        activity_id: params[1] as string,
        start_time: params[2] as number,
        end_time: null,
        paused_duration_ms: 0,
        note: null,
        created_at: params[3] as number,
        updated_at: params[4] as number,
      });
    } else if (sql.startsWith('UPDATE activity_sessions')) {
      const id = params[5] as string;
      const idx = this.state.activity_sessions.findIndex((s) => s.id === id);
      if (idx >= 0) {
        this.state.activity_sessions[idx] = {
          ...this.state.activity_sessions[idx],
          start_time: params[0] as number,
          end_time: (params[1] as number | null) ?? null,
          paused_duration_ms: params[2] as number,
          note: (params[3] as string | null) ?? null,
          updated_at: params[4] as number,
        };
      }
    } else if (sql.startsWith('DELETE FROM activity_sessions WHERE')) {
      const id = params[0] as string;
      this.state.activity_sessions = this.state.activity_sessions.filter(
        (s) => s.id !== id
      );
    } else if (sql.startsWith('INSERT OR REPLACE INTO app_settings')) {
      const key = params[0] as string;
      const value = params[1] as string;
      const existing = this.state.app_settings.findIndex((s) => s.key === key);
      if (existing >= 0) {
        this.state.app_settings[existing].value = value;
      } else {
        this.state.app_settings.push({ key, value });
      }
    } else if (sql.startsWith('DELETE FROM app_settings WHERE')) {
      const key = params[0] as string;
      this.state.app_settings = this.state.app_settings.filter(
        (s) => s.key !== key
      );
    }

    this.persist();
    return undefined;
  }

  async getFirstAsync<T>(source: string, params: unknown[] = []): Promise<T | null> {
    const sql = normalize(source);

    if (sql.startsWith('SELECT version FROM schema_version')) {
      if (this.state.schema_version === null) return null;
      return { version: this.state.schema_version } as T;
    }

    if (sql.startsWith('SELECT COUNT(*) as c FROM activities')) {
      return { c: this.state.activities.length } as T;
    }

    if (sql.startsWith('SELECT * FROM activities WHERE id =')) {
      const row = this.state.activities.find((a) => a.id === params[0]);
      return (row as T) ?? null;
    }

    if (sql.startsWith('SELECT * FROM activity_sessions WHERE id =')) {
      const row = this.state.activity_sessions.find((s) => s.id === params[0]);
      return (row as T) ?? null;
    }

    if (sql.includes('end_time IS NULL ORDER BY start_time DESC LIMIT 1')) {
      const open = [...this.state.activity_sessions]
        .filter((s) => s.end_time === null)
        .sort((a, b) => b.start_time - a.start_time);
      return (open[0] as T) ?? null;
    }

    if (sql.startsWith('SELECT value FROM app_settings WHERE')) {
      const row = this.state.app_settings.find((s) => s.key === params[0]);
      return row ? ({ value: row.value } as T) : null;
    }

    return null;
  }

  async getAllAsync<T>(source: string, params: unknown[] = []): Promise<T[]> {
    const sql = normalize(source);

    if (sql.startsWith('SELECT * FROM activities WHERE is_archived = 0')) {
      return [...this.state.activities]
        .filter((a) => a.is_archived === 0)
        .sort(
          (a, b) =>
            a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
        ) as T[];
    }

    if (sql.startsWith('SELECT * FROM activities ORDER BY')) {
      return [...this.state.activities].sort(
        (a, b) =>
          a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
      ) as T[];
    }

    if (sql.includes('start_time <= ? AND (end_time IS NULL OR end_time >= ?)')) {
      const endMs = params[0] as number;
      const startMs = params[1] as number;
      return this.state.activity_sessions
        .filter(
          (s) =>
            s.start_time <= endMs &&
            (s.end_time === null || s.end_time >= startMs)
        )
        .sort((a, b) => a.start_time - b.start_time) as T[];
    }

    if (sql.startsWith('SELECT * FROM activity_sessions ORDER BY start_time DESC')) {
      return [...this.state.activity_sessions].sort(
        (a, b) => b.start_time - a.start_time
      ) as T[];
    }

    return [];
  }
}
