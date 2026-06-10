import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { setOnboardingComplete } from '@/db/settingsRepo';
import { useThemeColors } from '@/utils/themeColors';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { XStack, YStack } from '@/components/ui/stacks';

const STEPS = [
  {
    title: 'Track your day manually',
    body: 'Start a timer when you begin an activity. Switch when your day changes.',
  },
  {
    title: 'See the shape of your day',
    body: 'Review your focus, learning, health, leisure, and rest.',
  },
  {
    title: 'Private by default',
    body: 'Your data stays on your device in the MVP.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const stepLabel = String(step + 1).padStart(2, '0');

  const finish = async () => {
    await setOnboardingComplete(true);
    router.replace('/(tabs)/today');
  };

  return (
    <Screen>
      <YStack f={1} jc="center" gap="$6" py="$8" maxWidth={400} w="100%" als="center">
        <AppText variant="label" color={colors.phosphor}>
          // STEP {stepLabel}
        </AppText>

        <XStack jc="center" gap="$2">
          {STEPS.map((_, i) => (
            <YStack
              key={i}
              w={8}
              h={8}
              br={4}
              bg={i === step ? '$phosphor' : '$borderColor'}
              transition="soft"
            />
          ))}
        </XStack>

        <Animated.View
          key={step}
          entering={FadeIn.duration(280).springify()}
          exiting={FadeOut.duration(180)}
        >
          <YStack gap="$3">
            <AppText variant="title">{current.title}</AppText>
            <AppText variant="body" color="$colorMuted" lineHeight={24}>
              {current.body}
            </AppText>
          </YStack>
        </Animated.View>

        <YStack gap="$3" mt="auto" w="100%">
          {step < STEPS.length - 1 ? (
            <AppButton onPress={() => setStep((s) => s + 1)}>Continue</AppButton>
          ) : (
            <AppButton onPress={finish}>Get started</AppButton>
          )}
          {step > 0 ? (
            <AppButton variant="ghost" onPress={() => setStep((s) => s - 1)}>
              Back
            </AppButton>
          ) : null}
        </YStack>
      </YStack>
    </Screen>
  );
}
