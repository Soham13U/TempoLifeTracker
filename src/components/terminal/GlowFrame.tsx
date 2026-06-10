import { tempoTokens } from '@/theme/tokens';
import { useThemeColors } from '@/utils/themeColors';
import type { ReactNode } from 'react';
import { View } from 'react-native';

type Props = {
  children: ReactNode;
  active?: boolean;
};

export function GlowFrame({ children, active = true }: Props) {
  const colors = useThemeColors();

  if (!active || !colors.isDark) {
    return <>{children}</>;
  }

  return (
    <View
      style={{
        borderRadius: tempoTokens.radius.card,
        borderWidth: 1,
        borderColor: colors.phosphor,
        shadowColor: colors.phosphor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.28,
        shadowRadius: 10,
        elevation: 8,
      }}
    >
      {children}
    </View>
  );
}
