import { AppText } from '@/components/ui/AppText';
import { useThemeColors } from '@/utils/themeColors';
import { XStack } from '@/components/ui/stacks';

type Props = {
  title: string;
  action?: React.ReactNode;
};

export function BracketHeader({ title, action }: Props) {
  const colors = useThemeColors();
  const upper = title.toUpperCase();

  return (
    <XStack jc="space-between" ai="center" mt="$1">
      <XStack ai="center" gap={0}>
        <AppText variant="label" color={colors.phosphor}>
          [
        </AppText>
        <AppText variant="label"> {upper} </AppText>
        <AppText variant="label" color={colors.phosphor}>
          ]
        </AppText>
      </XStack>
      {action}
    </XStack>
  );
}
