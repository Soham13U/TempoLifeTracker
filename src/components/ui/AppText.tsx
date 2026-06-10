import { tempoTokens } from '@/theme/tokens';
import { Text } from 'tamagui';
import type { ComponentType } from 'react';

const TamaguiText = Text as ComponentType<Record<string, unknown>>;

type Variant = 'title' | 'subtitle' | 'body' | 'caption' | 'timer' | 'label';

const variantStyles: Record<Variant, Record<string, unknown>> = {
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '$color',
    fontFamily: tempoTokens.font.monoSemiBold,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '$color',
    fontFamily: tempoTokens.font.monoSemiBold,
    letterSpacing: 0.25,
    lineHeight: 20,
    fontVariant: ['tabular-nums'],
  },
  body: {
    fontSize: 16,
    color: '$color',
    fontFamily: tempoTokens.font.mono,
    lineHeight: 22,
  },
  caption: {
    fontSize: 12,
    color: '$colorMuted',
    fontFamily: tempoTokens.font.mono,
    letterSpacing: 0,
    lineHeight: 16,
    fontVariant: ['tabular-nums'],
  },
  timer: {
    fontSize: 52,
    fontWeight: '400',
    color: '$phosphor',
    fontFamily: tempoTokens.font.mono,
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '$color',
    fontFamily: tempoTokens.font.monoSemiBold,
    letterSpacing: 0.5,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
};

type Props = Record<string, unknown> & {
  variant?: Variant;
};

export function AppText({ variant = 'body', ...props }: Props) {
  return <TamaguiText {...variantStyles[variant]} {...props} />;
}
