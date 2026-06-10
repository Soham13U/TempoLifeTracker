import { useThemePreference } from '@/contexts/ThemeContext';
import { tempoTokens } from '@/theme/tokens';

export function useThemeColors() {
  const { resolvedTheme } = useThemePreference();
  const isDark = resolvedTheme === 'dark';

  return {
    primary: isDark ? tempoTokens.color.phosphor : tempoTokens.color.primaryLight,
    phosphor: isDark ? tempoTokens.color.phosphor : tempoTokens.color.phosphorLight,
    cyan: isDark ? tempoTokens.color.cyan : tempoTokens.color.cyanLight,
    glow: isDark ? tempoTokens.color.glow : 'transparent',
    background: isDark
      ? tempoTokens.color.backgroundDark
      : tempoTokens.color.backgroundLight,
    card: isDark ? tempoTokens.color.cardDark : tempoTokens.color.cardLight,
    text: isDark ? '#E4E4E7' : '#1A1A1E',
    textMuted: isDark
      ? tempoTokens.color.textMutedDark
      : tempoTokens.color.textMuted,
    border: isDark
      ? tempoTokens.color.borderDark
      : tempoTokens.color.borderLight,
    icon: isDark ? '#E4E4E7' : '#1A1A1E',
    danger: tempoTokens.color.danger,
    isDark,
  };
}
