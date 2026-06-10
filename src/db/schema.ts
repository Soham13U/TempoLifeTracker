export const CREATE_ACTIVITIES = `
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  is_archived INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
`;

export const CREATE_ACTIVITY_SESSIONS = `
CREATE TABLE IF NOT EXISTS activity_sessions (
  id TEXT PRIMARY KEY NOT NULL,
  activity_id TEXT NOT NULL,
  start_time INTEGER NOT NULL,
  end_time INTEGER,
  paused_duration_ms INTEGER NOT NULL DEFAULT 0,
  note TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (activity_id) REFERENCES activities(id)
);
`;

export const CREATE_APP_SETTINGS = `
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);
`;

export const CREATE_SCHEMA_VERSION = `
CREATE TABLE IF NOT EXISTS schema_version (
  version INTEGER NOT NULL
);
`;
