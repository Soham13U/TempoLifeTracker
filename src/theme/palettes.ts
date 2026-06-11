import type { ColorScheme } from '@/types/dashboard';

export type PaletteTokens = {
  background: string;
  card: string;
  primary: string;
  phosphor: string;
  accent: string;
  text: string;
  textMuted: string;
  border: string;
  icon: string;
  glow: string;
  onPrimary: string;
  danger: string;
};

export type PaletteDefinition = {
  id: ColorScheme;
  name: string;
  light: PaletteTokens;
  dark: PaletteTokens;
};

export const COLOR_SCHEMES: ColorScheme[] = [
  'phosphor',
  'ink',
  'stone',
  'copper',
  'slate',
];

export const palettes: Record<ColorScheme, PaletteDefinition> = {
  phosphor: {
    id: 'phosphor',
    name: 'Phosphor',
    light: {
      background: '#F4F4F0',
      card: '#FFFFFF',
      primary: '#A16207',
      phosphor: '#A16207',
      accent: '#78716C',
      text: '#1A1A1E',
      textMuted: '#6B6B70',
      border: '#D4D4D8',
      icon: '#1A1A1E',
      glow: 'transparent',
      onPrimary: '#08080A',
      danger: '#E5484D',
    },
    dark: {
      background: '#0C0C0E',
      card: '#141416',
      primary: '#C9A86C',
      phosphor: '#C9A86C',
      accent: '#A8A29E',
      text: '#E4E4E7',
      textMuted: '#71717A',
      border: '#2E2E32',
      icon: '#E4E4E7',
      glow: 'rgba(201, 168, 108, 0.22)',
      onPrimary: '#08080A',
      danger: '#E5484D',
    },
  },
  ink: {
    id: 'ink',
    name: 'Ink',
    light: {
      background: '#FAFAFA',
      card: '#FFFFFF',
      primary: '#18181B',
      phosphor: '#18181B',
      accent: '#71717A',
      text: '#09090B',
      textMuted: '#71717A',
      border: '#E4E4E7',
      icon: '#09090B',
      glow: 'transparent',
      onPrimary: '#FAFAFA',
      danger: '#DC2626',
    },
    dark: {
      background: '#09090B',
      card: '#18181B',
      primary: '#FAFAFA',
      phosphor: '#FAFAFA',
      accent: '#A1A1AA',
      text: '#FAFAFA',
      textMuted: '#A1A1AA',
      border: '#27272A',
      icon: '#FAFAFA',
      glow: 'rgba(250, 250, 250, 0.08)',
      onPrimary: '#09090B',
      danger: '#F87171',
    },
  },
  stone: {
    id: 'stone',
    name: 'Stone',
    light: {
      background: '#F0EEEB',
      card: '#FAF9F7',
      primary: '#8C8279',
      phosphor: '#8C8279',
      accent: '#B5ADA3',
      text: '#2A2826',
      textMuted: '#7A746C',
      border: '#DDD8D2',
      icon: '#2A2826',
      glow: 'transparent',
      onPrimary: '#FAF9F7',
      danger: '#C45C4A',
    },
    dark: {
      background: '#1C1B19',
      card: '#262522',
      primary: '#C4B8A8',
      phosphor: '#C4B8A8',
      accent: '#8A8278',
      text: '#EDE9E4',
      textMuted: '#9C958C',
      border: '#3A3834',
      icon: '#EDE9E4',
      glow: 'rgba(196, 184, 168, 0.15)',
      onPrimary: '#1C1B19',
      danger: '#E07A6A',
    },
  },
  copper: {
    id: 'copper',
    name: 'Copper',
    light: {
      background: '#F3EDE6',
      card: '#FBF7F2',
      primary: '#9A4E2A',
      phosphor: '#9A4E2A',
      accent: '#B8956F',
      text: '#2B1F18',
      textMuted: '#7A6B5E',
      border: '#E0D4C8',
      icon: '#2B1F18',
      glow: 'transparent',
      onPrimary: '#FBF7F2',
      danger: '#DC2626',
    },
    dark: {
      background: '#1A120E',
      card: '#261C16',
      primary: '#D4845A',
      phosphor: '#D4845A',
      accent: '#9A6B4A',
      text: '#F2E8DF',
      textMuted: '#A89484',
      border: '#3D2E24',
      icon: '#F2E8DF',
      glow: 'rgba(212, 132, 90, 0.18)',
      onPrimary: '#1A120E',
      danger: '#F87171',
    },
  },
  slate: {
    id: 'slate',
    name: 'Slate',
    light: {
      background: '#EEF1F4',
      card: '#F8FAFB',
      primary: '#4A6278',
      phosphor: '#4A6278',
      accent: '#8A9BAA',
      text: '#1A2330',
      textMuted: '#6B7A88',
      border: '#CDD5DC',
      icon: '#1A2330',
      glow: 'transparent',
      onPrimary: '#F8FAFB',
      danger: '#DC2626',
    },
    dark: {
      background: '#111820',
      card: '#1A222C',
      primary: '#8FA8BE',
      phosphor: '#8FA8BE',
      accent: '#5A6D7E',
      text: '#E4EBF0',
      textMuted: '#8A99A8',
      border: '#2A3540',
      icon: '#E4EBF0',
      glow: 'rgba(143, 168, 190, 0.15)',
      onPrimary: '#111820',
      danger: '#F87171',
    },
  },
};

export function getPaletteTokens(
  scheme: ColorScheme,
  mode: 'light' | 'dark'
): PaletteTokens {
  return palettes[scheme][mode];
}

export function getTamaguiThemeName(
  mode: 'light' | 'dark',
  scheme: ColorScheme
): string {
  return `${mode}_${scheme}`;
}
