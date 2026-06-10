import { YStack } from '@/components/ui/stacks';
import { AppText } from './AppText';

type Props = {
  title: string;
  message?: string;
};

export function EmptyState({ title, message }: Props) {
  return (
    <YStack ai="center" p="$6" gap="$2">
      <AppText variant="subtitle" ta="center">
        {title}
      </AppText>
      {message ? (
        <AppText variant="caption" ta="center">
          {message}
        </AppText>
      ) : null}
    </YStack>
  );
}
