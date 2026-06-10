import {
  getThemePreference,
  setThemePreference,
} from '@/db/settingsRepo';
import type { ThemePreference } from '@/types/dashboard';
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
  resolvedTheme: 'light' | 'dark';
  setPreference: (p: ThemePreference) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemePreferenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const system = useSystemScheme();
  const [preference, setPref] = useState<ThemePreference>('dark');

  useEffect(() => {
    getThemePreference().then(setPref);
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

  const value = useMemo(
    () => ({ preference, resolvedTheme, setPreference }),
    [preference, resolvedTheme, setPreference]
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
