import {
  ActivityIconMark,
  CATEGORY_DOT_INSET,
  CategoryDot,
} from '@/components/activity/ActivityIconMark';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { XStack, YStack } from '@/components/ui/stacks';
import { useActivityStore } from '@/store/activityStore';
import { ACTIVITY_CATEGORIES } from '@/types/activity';
import { CATEGORY_LABELS } from '@/utils/categories';
import { getCategoryColor } from '@/utils/colors';
import { getActivityIcon } from '@/utils/icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';

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
                  const categoryColor =
                    activity.color ?? getCategoryColor(category);
                  return (
                    <AppCard
                      key={activity.id}
                      pressable
                      onPress={() => router.push(`/activity/${activity.id}`)}
                      position="relative"
                    >
                      <CategoryDot
                        color={categoryColor}
                        style={{
                          top: CATEGORY_DOT_INSET,
                          left: CATEGORY_DOT_INSET,
                        }}
                      />
                      <XStack ai="center" gap="$3" minHeight={24}>
                        <ActivityIconMark icon={Icon} size={20} container={24} />
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
