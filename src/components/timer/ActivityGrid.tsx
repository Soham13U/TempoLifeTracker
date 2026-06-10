import type { Activity } from '@/types/activity';
import { useTimerStore } from '@/store/timerStore';
import { tempoTokens } from '@/theme/tokens';
import { XStack, YStack } from '@/components/ui/stacks';
import { SectionHeader } from '../ui/SectionHeader';
import { QuickActivityButton } from './QuickActivityButton';

type Props = {
  activities: Activity[];
};

export function ActivityGrid({ activities }: Props) {
  const { activityId, startActivity } = useTimerStore();

  const rows: Activity[][] = [];
  for (let i = 0; i < activities.length; i += 3) {
    rows.push(activities.slice(i, i + 3));
  }

  return (
    <YStack gap="$3">
      <SectionHeader title="Quick Start" />
      <YStack gap={tempoTokens.space.item}>
        {rows.map((row, idx) => (
          <XStack
            key={idx}
            gap={tempoTokens.space.item}
            jc={row.length < 3 ? 'center' : 'flex-start'}
          >
            {row.map((activity) => (
              <QuickActivityButton
                key={activity.id}
                activity={activity}
                isActive={activityId === activity.id}
                fill={row.length === 3}
                onPress={() => startActivity(activity.id)}
              />
            ))}
          </XStack>
        ))}
      </YStack>
    </YStack>
  );
}
