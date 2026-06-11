import { AppText } from '@/components/ui/AppText';
import { palettes } from '@/theme/palettes';
import { tempoTokens } from '@/theme/tokens';
import type { ColorScheme } from '@/types/dashboard';
import { useThemeColors } from '@/utils/themeColors';
import { Pressable, View } from 'react-native';
import { XStack, YStack } from '@/components/ui/stacks';

const ROW1: ColorScheme[] = ['phosphor', 'ink', 'stone'];
const ROW2: ColorScheme[] = ['copper', 'slate'];

type Props = {
  value: ColorScheme;
  resolvedTheme: 'light' | 'dark';
  onChange: (scheme: ColorScheme) => void;
};

function PaletteCell({
  scheme,
  selected,
  resolvedTheme,
  onPress,
}: {
  scheme: ColorScheme;
  selected: boolean;
  resolvedTheme: 'light' | 'dark';
  onPress: () => void;
}) {
  const colors = useThemeColors();
  const palette = palettes[scheme][resolvedTheme];
  const radius = colors.isDark
    ? tempoTokens.radius.button
    : tempoTokens.radius.buttonLight;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${palettes[scheme].name} palette`}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        opacity: pressed ? 0.85 : 1,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? colors.phosphor : colors.border,
        borderRadius: radius,
        backgroundColor: colors.card,
        minHeight: 56,
        paddingVertical: 10,
        paddingHorizontal: 8,
      })}
    >
      <YStack gap="$2" ai="center" jc="center" f={1}>
        <XStack gap="$2" ai="center">
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: palette.background,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          />
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: palette.phosphor,
            }}
          />
        </XStack>
        <AppText
          variant="caption"
          fontSize={11}
          fontFamily={tempoTokens.font.mono}
        >
          {palettes[scheme].name}
        </AppText>
      </YStack>
    </Pressable>
  );
}

export function PalettePicker({ value, resolvedTheme, onChange }: Props) {
  return (
    <YStack gap="$2">
      <XStack gap="$2">
        {ROW1.map((scheme) => (
          <PaletteCell
            key={scheme}
            scheme={scheme}
            selected={value === scheme}
            resolvedTheme={resolvedTheme}
            onPress={() => onChange(scheme)}
          />
        ))}
      </XStack>
      <XStack gap="$2">
        <YStack f={1} />
        {ROW2.map((scheme) => (
          <PaletteCell
            key={scheme}
            scheme={scheme}
            selected={value === scheme}
            resolvedTheme={resolvedTheme}
            onPress={() => onChange(scheme)}
          />
        ))}
      </XStack>
    </YStack>
  );
}
