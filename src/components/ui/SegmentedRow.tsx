import { AppText } from '@/components/ui/AppText';
import { tempoTokens } from '@/theme/tokens';
import { useThemeColors } from '@/utils/themeColors';
import { Pressable } from 'react-native';
import { XStack } from '@/components/ui/stacks';

type Segment<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  segments: Segment<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedRow<T extends string>({
  segments,
  value,
  onChange,
}: Props<T>) {
  const colors = useThemeColors();
  const radius = colors.isDark
    ? tempoTokens.radius.button
    : tempoTokens.radius.buttonLight;

  return (
    <XStack
      borderWidth={1}
      borderColor={colors.border}
      br={radius}
      overflow="hidden"
    >
      {segments.map((segment, index) => {
        const selected = value === segment.value;
        const isLast = index === segments.length - 1;
        return (
          <Pressable
            key={segment.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={segment.label}
            onPress={() => onChange(segment.value)}
            style={({ pressed }) => ({
              flex: 1,
              minHeight: tempoTokens.size.button,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: selected ? colors.phosphor : colors.card,
              borderRightWidth: isLast ? 0 : 1,
              borderRightColor: colors.border,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <AppText
              variant="caption"
              fontFamily={tempoTokens.font.monoSemiBold}
              fontSize={13}
              color={selected ? colors.onPrimary : colors.text}
            >
              {segment.label}
            </AppText>
          </Pressable>
        );
      })}
    </XStack>
  );
}
