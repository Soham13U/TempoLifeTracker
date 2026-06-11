import { tempoTokens } from '@/theme/tokens';
import { useThemeColors } from '@/utils/themeColors';
import { Button } from 'tamagui';
import type { ComponentType } from 'react';

export type AppButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type AppButtonSize = 'default' | 'sm';

const TamaguiButton = Button as ComponentType<Record<string, unknown>>;

const styles: Record<AppButtonVariant, Record<string, unknown>> = {
  primary: { bg: '$primary', color: '$onPrimary', borderWidth: 0 },
  secondary: { bg: '$card', color: '$color', borderWidth: 1, borderColor: '$borderColor' },
  ghost: { bg: 'transparent', color: '$color', borderWidth: 0 },
  danger: { bg: '$danger', color: 'white', borderWidth: 0 },
};

const heights: Record<AppButtonSize, number> = {
  default: tempoTokens.size.button,
  sm: tempoTokens.size.buttonSm,
};

type Props = Record<string, unknown> & {
  variant?: AppButtonVariant;
  size?: AppButtonSize;
};

export function AppButton({ variant = 'primary', size = 'default', ...props }: Props) {
  const colors = useThemeColors();
  const radius = colors.isDark
    ? tempoTokens.radius.button
    : tempoTokens.radius.buttonLight;

  return (
    <TamaguiButton
      br={radius}
      h={heights[size]}
      fontWeight="600"
      fontFamily={tempoTokens.font.monoSemiBold}
      transition="quick"
      pressStyle={{ scale: 0.98, o: 0.92 }}
      {...styles[variant]}
      {...props}
    />
  );
}
