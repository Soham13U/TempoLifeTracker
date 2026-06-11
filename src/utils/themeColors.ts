import { useThemePreference } from '@/contexts/ThemeContext';
import { getPaletteTokens } from '@/theme/palettes';

export function useThemeColors() {
  const { resolvedTheme, colorScheme } = useThemePreference();
  const isDark = resolvedTheme === 'dark';
  const tokens = getPaletteTokens(colorScheme, resolvedTheme);

  return {
    primary: tokens.primary,
    phosphor: tokens.phosphor,
    cyan: tokens.accent,
    glow: tokens.glow,
    background: tokens.background,
    card: tokens.card,
    text: tokens.text,
    textMuted: tokens.textMuted,
    border: tokens.border,
    icon: tokens.icon,
    onPrimary: tokens.onPrimary,
    danger: tokens.danger,
    isDark,
    colorScheme,
  };
}
