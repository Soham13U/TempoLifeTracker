import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useActivityStore } from '@/store/activityStore';
import { ACTIVITY_CATEGORIES } from '@/types/activity';
import { CATEGORY_LABELS } from '@/utils/categories';
import { getCategoryColor } from '@/utils/colors';
import { getActivityIcon } from '@/utils/icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { YStack, XStack } from '@/components/ui/stacks';
import { AppCard } from '@/components/ui/AppCard';

export default function ActivitiesScreen() {
  const router = useRouter();
  const { activities, loadActivities } = useActivityStore();

  useFocusEffect(
    useCallback(() => {
      loadActivities();
    }, [loadActivities])
  );

  const hasActivities = activities.length > 0;

  return (
    <Screen>
      <AppText variant="title">Activities</AppText>

      {!hasActivities ? (
        <EmptyState
          title="No activities yet"
          message="Create your first activity to start tracking"
        />
      ) : (
        ACTIVITY_CATEGORIES.map((category) => {
          const items = activities.filter((a) => a.category === category);
          if (items.length === 0) return null;

          return (
            <YStack key={category} gap="$3">
              <SectionHeader title={CATEGORY_LABELS[category]} />
              <YStack gap="$2.5">
                {items.map((activity) => {
                  const Icon = getActivityIcon(activity.icon);
                  const color = activity.color ?? getCategoryColor(category);
                  return (
                    <AppCard
                      key={activity.id}
                      pressable
                      onPress={() => router.push(`/activity/${activity.id}`)}
                    >
                      <XStack ai="center" gap="$3" minHeight={24}>
                        <YStack w={24} ai="center" jc="center" flexShrink={0}>
                          <Icon size={20} color={color} />
                        </YStack>
                        <AppText
                          variant="caption"
                          color="$color"
                          f={1}
                          numberOfLines={1}
                          fontSize={14}
                          lineHeight={18}
                        >
                          {activity.name}
                        </AppText>
                      </XStack>
                    </AppCard>
                  );
                })}
              </YStack>
            </YStack>
          );
        })
      )}

      <AppButton onPress={() => router.push('/activity/new')}>
        + New Activity
      </AppButton>
    </Screen>
  );
}
