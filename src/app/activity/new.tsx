import { ActivityForm, type ActivityFormValues } from '@/components/forms/ActivityForm';
import { Screen } from '@/components/ui/Screen';
import * as activityRepo from '@/db/activityRepo';
import { useActivityStore } from '@/store/activityStore';
import { Stack, useRouter } from 'expo-router';

export default function NewActivityScreen() {
  const router = useRouter();
  const loadActivities = useActivityStore((s) => s.loadActivities);

  const onSubmit = async (values: ActivityFormValues) => {
    await activityRepo.createActivity(values);
    await loadActivities();
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ title: 'New Activity' }} />
      <Screen header>
        <ActivityForm
          onSubmit={onSubmit}
          submitLabel="Create activity"
        />
      </Screen>
    </>
  );
}
