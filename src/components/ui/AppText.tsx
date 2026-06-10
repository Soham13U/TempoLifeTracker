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
    fontFamily: tempoTokens.font.sansSemiBold,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '$color',
    fontFamily: tempoTokens.font.monoSemiBold,
    letterSpacing: 0.5,
  },
  body: {
    fontSize: 16,
    color: '$color',
    fontFamily: tempoTokens.font.sans,
  },
  caption: {
    fontSize: 12,
    color: '$colorMuted',
    fontFamily: tempoTokens.font.mono,
    letterSpacing: 0.3,
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
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
};

type Props = Record<string, unknown> & {
  variant?: Variant;
};

export function AppText({ variant = 'body', ...props }: Props) {
  return <TamaguiText {...variantStyles[variant]} {...props} />;
}
