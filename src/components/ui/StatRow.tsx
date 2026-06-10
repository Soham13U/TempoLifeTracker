import { XStack } from '@/components/ui/stacks';
import { AppText } from './AppText';
import type { ReactNode } from 'react';

type Props = {
  label: ReactNode;
  value: ReactNode;
};

export function StatRow({ label, value }: Props) {
  return (
    <XStack jc="space-between" ai="center" gap="$2">
      <XStack f={1} ai="center" gap="$2" minWidth={0}>
        {typeof label === 'string' ? (
          <AppText variant="body" numberOfLines={1}>
            {label}
          </AppText>
        ) : (
          label
        )}
      </XStack>
      {typeof value === 'string' ? (
        <AppText variant="caption" flexShrink={0}>
          {value}
        </AppText>
      ) : (
        value
      )}
    </XStack>
  );
}
