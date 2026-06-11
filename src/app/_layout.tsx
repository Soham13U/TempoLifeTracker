import 'react-native-gesture-handler';
import '../../global.css';
import { ThemePreferenceProvider, useThemePreference } from '@/contexts/ThemeContext';
import { getDatabase } from '@/db/database';
import config from '@/theme/tamagui.config';
import { getTamaguiThemeName } from '@/theme/palettes';
import { tempoTokens } from '@/theme/tokens';
import { useThemeColors } from '@/utils/themeColors';
import { useTimerStore } from '@/store/timerStore';
import {
  Inter_400Regular,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_600SemiBold,
} from '@expo-google-fonts/jetbrains-mono';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { TamaguiProvider, Theme, Spinner } from 'tamagui';
import { YStack } from '@/components/ui/stacks';
import { AppText } from '@/components/ui/AppText';
export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

function RootInner() {
  const { resolvedTheme, colorScheme } = useThemePreference();
  const colors = useThemeColors();
  const loadActiveSession = useTimerStore((s) => s.loadActiveSession);
  const [ready, setReady] = useState(false);
  const [fontsLoaded] = useFonts({
    JetBrainsMono_400Regular,
    JetBrainsMono_600SemiBold,
    Inter_400Regular,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (!fontsLoaded) return;
    (async () => {
      try {
        await getDatabase();
        await loadActiveSession();
      } finally {
        setReady(true);
        await SplashScreen.hideAsync();
      }
    })();
  }, [loadActiveSession, fontsLoaded]);

  const backgroundColor = colors.background;
  const headerTintColor = colors.phosphor;
  const themeName = getTamaguiThemeName(resolvedTheme, colorScheme);

  if (!ready || !fontsLoaded) {
    return (
      <Theme name={themeName}>
        <YStack
          f={1}
          ai="center"
          jc="center"
          style={{ backgroundColor }}
        >
          <Spinner size="large" color={colors.phosphor} />
          <AppText mt="$4" variant="caption">
            Loading Tempo…
          </AppText>
        </YStack>
      </Theme>
    );
  }
  const headerTitleStyle = {
    fontFamily: tempoTokens.font.monoSemiBold,
    fontSize: 14,
    letterSpacing: 1,
  };

  return (
    <Theme name={themeName}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="activity/new"
          options={{
            headerShown: true,
            title: 'NEW ACTIVITY',
            presentation: 'modal',
            animation: 'slide_from_bottom',
            headerStyle: { backgroundColor },
            headerTintColor,
            headerTitleStyle,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="activity/[id]"
          options={{
            headerShown: true,
            title: 'EDIT ACTIVITY',
            animation: 'fade',
            headerStyle: { backgroundColor },
            headerTintColor,
            headerTitleStyle,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="session/view/[id]"
          options={{
            headerShown: true,
            title: 'SESSION',
            presentation: 'modal',
            animation: 'slide_from_bottom',
            headerStyle: { backgroundColor },
            headerTintColor,
            headerTitleStyle,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="session/[id]"
          options={{
            headerShown: true,
            title: 'SESSION',
            animation: 'fade',
            headerStyle: { backgroundColor },
            headerTintColor,
            headerTitleStyle,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="activity/view/[id]"
          options={{
            headerShown: true,
            title: 'ACTIVITY',
            presentation: 'modal',
            animation: 'slide_from_bottom',
            headerStyle: { backgroundColor },
            headerTintColor,
            headerTitleStyle,
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </Theme>
  );
}

export default function RootLayout() {
  return (
    <TamaguiProvider config={config} defaultTheme="dark_phosphor">
      <ThemePreferenceProvider>
        <RootInner />
      </ThemePreferenceProvider>
    </TamaguiProvider>
  );
}
