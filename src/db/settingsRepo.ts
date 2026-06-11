import type { ActiveTimerState } from '@/types/session';
import { EMPTY_ACTIVE_TIMER } from '@/types/session';
import type { ColorScheme, ThemePreference } from '@/types/dashboard';
import { COLOR_SCHEMES } from '@/theme/palettes';
import { getDatabase } from './database';

async function getSetting(key: string): Promise<string | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_settings WHERE key = ?',
    [key]
  );
  return row?.value ?? null;
}

async function setSetting(key: string, value: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)',
    [key, value]
  );
}

export async function getActiveTimerState(): Promise<ActiveTimerState> {
  const raw = await getSetting('active_timer_state');
  if (!raw) return { ...EMPTY_ACTIVE_TIMER };
  try {
    return JSON.parse(raw) as ActiveTimerState;
  } catch {
    return { ...EMPTY_ACTIVE_TIMER };
  }
}

export async function setActiveTimerState(state: ActiveTimerState): Promise<void> {
  await setSetting('active_timer_state', JSON.stringify(state));
}

export async function clearActiveTimerState(): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM app_settings WHERE key = ?', [
    'active_timer_state',
  ]);
}

export async function getOnboardingComplete(): Promise<boolean> {
  return (await getSetting('onboarding_complete')) === 'true';
}

export async function setOnboardingComplete(value: boolean): Promise<void> {
  await setSetting('onboarding_complete', value ? 'true' : 'false');
}

export async function getThemePreference(): Promise<ThemePreference> {
  const v = await getSetting('theme');
  if (v === 'light' || v === 'dark' || v === 'system') return v;
  return 'system';
}

export async function setThemePreference(theme: ThemePreference): Promise<void> {
  await setSetting('theme', theme);
}

const LEGACY_COLOR_SCHEME_MAP = {
  sage: 'stone',
  ocean: 'slate',
  clay: 'copper',
} as const;

export async function getColorScheme(): Promise<ColorScheme> {
  const v = await getSetting('color_scheme');
  if (!v) return 'phosphor';
  if (v in LEGACY_COLOR_SCHEME_MAP) {
    return LEGACY_COLOR_SCHEME_MAP[v as keyof typeof LEGACY_COLOR_SCHEME_MAP];
  }
  if (COLOR_SCHEMES.includes(v as ColorScheme)) {
    return v as ColorScheme;
  }
  return 'phosphor';
}

export async function setColorScheme(scheme: ColorScheme): Promise<void> {
  await setSetting('color_scheme', scheme);
}

export async function getNotificationsEnabled(): Promise<boolean> {
  const v = await getSetting('notifications_enabled');
  if (v === null) return true;
  return v === 'true';
}

export async function setNotificationsEnabled(enabled: boolean): Promise<void> {
  await setSetting('notifications_enabled', enabled ? 'true' : 'false');
}
