import { tempoTokens } from '@/theme/tokens';
import { useThemeColors } from '@/utils/themeColors';
import { YStack } from '@/components/ui/stacks';

type AppCardProps = Record<string, unknown> & {
  children?: React.ReactNode;
  padded?: boolean;
  pressable?: boolean;
  onPress?: () => void;
};

export function AppCard({
  children,
  padded = true,
  pressable,
  onPress,
  ...props
}: AppCardProps) {
  const colors = useThemeColors();
  const radius = colors.isDark
    ? tempoTokens.radius.card
    : tempoTokens.radius.cardLight;

  return (
    <YStack
      bg="$card"
      br={radius}
      borderWidth={1}
      borderColor="$borderColor"
      p={padded ? tempoTokens.space.cardPadding : 0}
      transition={pressable ? 'soft' : undefined}
      pressStyle={pressable ? { o: 0.92, scale: 0.99 } : undefined}
      onPress={pressable ? onPress : undefined}
      cursor={pressable ? 'pointer' : undefined}
      {...props}
    >
      {children}
    </YStack>
  );
}
