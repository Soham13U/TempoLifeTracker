import { PalettePicker } from "@/components/settings/PalettePicker";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { AppText } from "@/components/ui/AppText";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SegmentedRow } from "@/components/ui/SegmentedRow";
import { XStack, YStack } from "@/components/ui/stacks";
import { useThemePreference } from "@/contexts/ThemeContext";
import { resetDatabase } from "@/db/database";
import {
  getNotificationsEnabled,
  setNotificationsEnabled,
} from "@/db/settingsRepo";
import {
  areNotificationsSupported,
  requestNotificationPermissions,
} from "@/services/notifications";
import { useTimerStore } from "@/store/timerStore";
import type { ThemePreference } from "@/types/dashboard";
import { exportCsv, exportJson } from "@/utils/export";
import { useThemeColors } from "@/utils/themeColors";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { Alert, Switch } from "react-native";

const THEME_SEGMENTS: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export default function SettingsScreen() {
  const {
    preference,
    setPreference,
    colorScheme,
    setColorScheme,
    resolvedTheme,
  } = useThemePreference();
  const colors = useThemeColors();
  const [notifications, setNotifications] = useState(true);
  const loadActiveSession = useTimerStore((s) => s.loadActiveSession);

  useEffect(() => {
    getNotificationsEnabled().then(setNotifications);
  }, []);

  const notificationsSupported = areNotificationsSupported();

  const toggleNotifications = async (value: boolean) => {
    if (value && !notificationsSupported) {
      Alert.alert(
        "Not available in Expo Go",
        "Timer notifications require a development build (npx expo run:android). The rest of Tempo works in Expo Go.",
      );
      return;
    }
    if (value) {
      const ok = await requestNotificationPermissions();
      if (!ok) {
        Alert.alert(
          "Permission needed",
          "Enable notifications in system settings.",
        );
        return;
      }
    }
    await setNotificationsEnabled(value);
    setNotifications(value);
  };

  const handleReset = () => {
    Alert.alert(
      "Reset demo data",
      "This clears all sessions and restores default activities.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await useTimerStore.getState().stopTimer();
            await resetDatabase();
            await loadActiveSession();
            Alert.alert("Done", "Data has been reset.");
          },
        },
      ],
    );
  };

  return (
    <Screen>
      <AppText variant="title">Settings</AppText>

      <YStack gap="$2">
        <SectionHeader title="Theme" />
        <SegmentedRow
          segments={THEME_SEGMENTS}
          value={preference}
          onChange={setPreference}
        />
      </YStack>

      <YStack gap="$2">
        <SectionHeader title="Color palette" />
        <PalettePicker
          value={colorScheme}
          resolvedTheme={resolvedTheme}
          onChange={setColorScheme}
        />
      </YStack>

      <AppCard>
        <XStack jc="space-between" ai="center" gap="$3">
          <YStack flex={1} gap="$1">
            <AppText variant="body">Active timer notification</AppText>
            <AppText variant="caption">
              {notificationsSupported
                ? "Reminder while a timer is running"
                : "Requires a dev build — unavailable in Expo Go"}
            </AppText>
          </YStack>
          <Switch
            value={notifications}
            onValueChange={toggleNotifications}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.isDark ? colors.text : "#FFFFFF"}
          />
        </XStack>
      </AppCard>

      <YStack gap="$2">
        <SectionHeader title="Export" />
        <AppButton variant="secondary" onPress={() => exportJson()}>
          Export JSON
        </AppButton>
        <AppButton variant="secondary" onPress={() => exportCsv()}>
          Export CSV
        </AppButton>
      </YStack>

      <AppButton variant="danger" onPress={handleReset}>
        Reset demo data
      </AppButton>

      <AppCard>
        <YStack gap="$2">
          <AppText variant="subtitle">About Tempo</AppText>
          <AppText variant="caption">
            A calm, manual daily life tracker. Your data stays on this device.
          </AppText>
          <AppText variant="caption">
            Version {Constants.expoConfig?.version ?? "1.0.0"}
          </AppText>
        </YStack>
      </AppCard>
    </Screen>
  );
}
