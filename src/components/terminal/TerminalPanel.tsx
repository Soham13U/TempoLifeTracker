import { tempoTokens } from '@/theme/tokens';
import { useThemeColors } from '@/utils/themeColors';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

type Props = {
  children: ReactNode;
  pressable?: boolean;
  onPress?: () => void;
  padded?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'none';
};

export function TerminalPanel({
  children,
  pressable,
  onPress,
  padded = true,
  accessibilityLabel,
  accessibilityRole,
}: Props) {
  const colors = useThemeColors();
  const radius = colors.isDark
    ? tempoTokens.radius.card
    : tempoTokens.radius.cardLight;

  const style = {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius,
    padding: padded ? tempoTokens.space.cardPadding : 0,
  };

  if (pressable && onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole={accessibilityRole ?? 'button'}
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => [style, pressed && { opacity: 0.92 }]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={style}>{children}</View>;
}
