import {
  getColorScheme,
  getThemePreference,
  setColorScheme as persistColorScheme,
  setThemePreference,
} from '@/db/settingsRepo';
import type { ColorScheme, ThemePreference } from '@/types/dashboard';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme as useSystemScheme } from 'react-native';

type ThemeContextValue = {
  preference: ThemePreference;
  colorScheme: ColorScheme;
  resolvedTheme: 'light' | 'dark';
  setPreference: (p: ThemePreference) => Promise<void>;
  setColorScheme: (s: ColorScheme) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemePreferenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const system = useSystemScheme();
  const [preference, setPref] = useState<ThemePreference>('system');
  const [colorScheme, setScheme] = useState<ColorScheme>('phosphor');

  useEffect(() => {
    Promise.all([getThemePreference(), getColorScheme()]).then(
      ([theme, scheme]) => {
        setPref(theme);
        setScheme(scheme);
      }
    );
  }, []);

  const resolvedTheme: 'light' | 'dark' =
    preference === 'system'
      ? system === 'dark'
        ? 'dark'
        : 'light'
      : preference;

  const setPreference = useCallback(async (p: ThemePreference) => {
    await setThemePreference(p);
    setPref(p);
  }, []);

  const setColorScheme = useCallback(async (s: ColorScheme) => {
    await persistColorScheme(s);
    setScheme(s);
  }, []);

  const value = useMemo(
    () => ({
      preference,
      colorScheme,
      resolvedTheme,
      setPreference,
      setColorScheme,
    }),
    [preference, colorScheme, resolvedTheme, setPreference, setColorScheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemePreference() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemePreference must be used within provider');
  return ctx;
}
