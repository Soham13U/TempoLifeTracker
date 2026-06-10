import { createAnimations } from '@tamagui/animations-reanimated';
import { defaultConfig } from '@tamagui/config/v4';
import { createTamagui } from 'tamagui';
import { tempoTokens } from './tokens';

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

export const config = createTamagui({
  ...defaultConfig,
  animations: {
    default: reanimatedAnimations,
  },
  themes: {
    ...defaultConfig.themes,
    light: {
      ...defaultConfig.themes.light,
      background: tempoTokens.color.backgroundLight,
      color: '#1A1A1E',
      colorMuted: tempoTokens.color.textMuted,
      card: tempoTokens.color.cardLight,
      primary: tempoTokens.color.primaryLight,
      accent: tempoTokens.color.cyanLight,
      danger: tempoTokens.color.danger,
      borderColor: tempoTokens.color.borderLight,
      phosphor: tempoTokens.color.phosphorLight,
    },
    dark: {
      ...defaultConfig.themes.dark,
      background: tempoTokens.color.backgroundDark,
      color: '#E4E4E7',
      colorMuted: tempoTokens.color.textMutedDark,
      card: tempoTokens.color.cardDark,
      primary: tempoTokens.color.phosphor,
      accent: tempoTokens.color.cyan,
      danger: tempoTokens.color.danger,
      borderColor: tempoTokens.color.borderDark,
      phosphor: tempoTokens.color.phosphor,
    },
  },
});

export type AppConfig = typeof config;

declare module 'tamagui' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
