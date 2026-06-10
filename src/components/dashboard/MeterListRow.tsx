import { BarTrack } from '@/components/charts/BarTrack';
import { AppText } from '@/components/ui/AppText';
import { tempoTokens } from '@/theme/tokens';
import { useThemeColors } from '@/utils/themeColors';
import type { ReactNode } from 'react';
import { Pressable } from 'react-native';
import { XStack, YStack } from '@/components/ui/stacks';

const PREFIX_GAP = 8;
const METER_INDENT = tempoTokens.space.listIndent + PREFIX_GAP;

type Props = {
  label: string;
  durationLabel: string;
  ratio: number;
  color: string;
  delayIndex?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export function MeterListRow({
  label,
  durationLabel,
  ratio,
  color,
  delayIndex = 0,
  onPress,
  accessibilityLabel,
}: Props) {
  const colors = useThemeColors();

  const content = (
    <YStack gap={tempoTokens.space.listRow}>
      <XStack jc="space-between" ai="center" gap="$2">
        <XStack f={1} ai="center" gap={PREFIX_GAP} minWidth={0}>
          <AppText
            variant="caption"
            color={colors.textMuted}
            w={tempoTokens.space.listIndent}
            flexShrink={0}
          >
            {'>'}
          </AppText>
          <AppText variant="caption" numberOfLines={1} f={1} color={colors.text}>
            {label}
          </AppText>
        </XStack>
        <AppText variant="caption" color={colors.phosphor} flexShrink={0} ta="right">
          {durationLabel}
        </AppText>
      </XStack>
      <XStack paddingLeft={METER_INDENT}>
        <YStack f={1}>
          <BarTrack ratio={ratio} color={color} delayIndex={delayIndex} />
        </YStack>
      </XStack>
    </YStack>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? `${label}, ${durationLabel}`}
        onPress={onPress}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

export function MeterListSection({ children }: { children: ReactNode }) {
  return <YStack gap={tempoTokens.space.listSection}>{children}</YStack>;
}
