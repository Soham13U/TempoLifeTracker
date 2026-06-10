import { getOnboardingComplete } from '@/db/settingsRepo';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { Spinner } from 'tamagui';
import { YStack } from '@/components/ui/stacks';

export default function Index() {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    getOnboardingComplete().then((done) => {
      setTarget(done ? '/(tabs)/today' : '/onboarding');
    });
  }, []);

  if (!target) {
    return (
      <YStack f={1} ai="center" jc="center" bg="$background">
        <Spinner />
      </YStack>
    );
  }

  return <Redirect href={target as '/(tabs)/today'} />;
}
