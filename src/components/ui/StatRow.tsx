import { XStack } from '@/components/ui/stacks';
import { AppText } from './AppText';
import { useThemeColors } from '@/utils/themeColors';
import type { ReactNode } from 'react';

type Props = {
  label: ReactNode;
  value: ReactNode;
  accentValue?: boolean;
};

export function StatRow({ label, value, accentValue }: Props) {
  const colors = useThemeColors();

  return (
    <XStack jc="space-between" ai="center" gap="$3" minHeight={20} py="$1">
      <XStack f={1} ai="center" minWidth={0}>
        {typeof label === 'string' ? (
          <AppText variant="caption" color={colors.textMuted} numberOfLines={1}>
            {label}
          </AppText>
        ) : (
          label
        )}
      </XStack>
      {typeof value === 'string' ? (
        <AppText
          variant="caption"
          color={accentValue ? colors.phosphor : colors.text}
          flexShrink={0}
          ta="right"
        >
          {value}
        </AppText>
      ) : (
        value
      )}
    </XStack>
  );
}
