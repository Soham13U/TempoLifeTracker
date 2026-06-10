import { ActivityForm, type ActivityFormValues } from '@/components/forms/ActivityForm';
import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import * as activityRepo from '@/db/activityRepo';
import { useActivityStore } from '@/store/activityStore';
import type { Activity } from '@/types/activity';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Spinner } from 'tamagui';
import { YStack } from '@/components/ui/stacks';
import { useThemeColors } from '@/utils/themeColors';

export default function EditActivityScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const loadActivities = useActivityStore((s) => s.loadActivities);
  const colors = useThemeColors();
  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    if (id) activityRepo.getActivityById(id).then(setActivity);
  }, [id]);

  const onSubmit = async (values: ActivityFormValues) => {
    if (!id) return;
    await activityRepo.updateActivity(id, values);
    await loadActivities();
    router.back();
  };

  const onArchive = () => {
    Alert.alert('Archive activity', 'Hide this from quick start?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Archive',
        onPress: async () => {
          if (!id) return;
          await activityRepo.archiveActivity(id);
          await loadActivities();
          router.back();
        },
      },
    ]);
  };

  if (!activity) {
    return (
      <Screen scroll={false} header>
        <YStack f={1} ai="center" jc="center" gap="$3">
          <Spinner size="large" color={colors.primary} />
          <AppText variant="caption">Loading activity…</AppText>
        </YStack>
      </Screen>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: activity.name }} />
      <Screen header>
        <YStack gap="$4">
          <ActivityForm
            defaultValues={{
              name: activity.name,
              category: activity.category,
              icon: activity.icon ?? 'circle',
            }}
            onSubmit={onSubmit}
          />
          <AppButton variant="danger" onPress={onArchive}>
            Archive activity
          </AppButton>
        </YStack>
      </Screen>
    </>
  );
}
