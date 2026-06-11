import { createAnimations } from '@tamagui/animations-reanimated';
import { defaultConfig } from '@tamagui/config/v4';
import { createTamagui } from 'tamagui';
import { COLOR_SCHEMES, palettes } from './palettes';

const reanimatedAnimations = createAnimations({
  quick: {
    type: 'spring',
    damping: 20,
    mass: 0.8,
    stiffness: 250,
  },
  soft: {
    type: 'spring',
    damping: 18,
    stiffness: 120,
  },
  lazy: {
    type: 'spring',
    damping: 20,
    stiffness: 60,
  },
});

function buildPaletteThemes() {
  const result: Record<string, Record<string, string>> = {};

  for (const scheme of COLOR_SCHEMES) {
    const palette = palettes[scheme];
    for (const mode of ['light', 'dark'] as const) {
      const tokens = palette[mode];
      const base =
        mode === 'light' ? defaultConfig.themes.light : defaultConfig.themes.dark;
      result[`${mode}_${scheme}`] = {
        ...base,
        background: tokens.background,
        color: tokens.text,
        colorMuted: tokens.textMuted,
        card: tokens.card,
        primary: tokens.primary,
        accent: tokens.accent,
        danger: tokens.danger,
        borderColor: tokens.border,
        phosphor: tokens.phosphor,
        onPrimary: tokens.onPrimary,
      };
    }
  }

  return result;
}

export const config = createTamagui({
  ...defaultConfig,
  animations: {
    default: reanimatedAnimations,
  },
  themes: {
    ...defaultConfig.themes,
    ...buildPaletteThemes(),
  },
});

export type AppConfig = typeof config;

declare module 'tamagui' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
