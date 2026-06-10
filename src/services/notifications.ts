import { getNotificationsEnabled } from '@/db/settingsRepo';
import { isRunningInExpoGo } from 'expo';
import { Platform } from 'react-native';

let reminderId: string | null = null;
let handlerConfigured = false;

type NotificationsModule = typeof import('expo-notifications');

async function getNotificationsModule(): Promise<NotificationsModule | null> {
  // expo-notifications throws on import in Expo Go (Android, SDK 53+) due to removed push APIs.
  if (isRunningInExpoGo()) {
    return null;
  }

  const Notifications = await import('expo-notifications');

  if (!handlerConfigured) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    handlerConfigured = true;
  }

  return Notifications;
}

export function areNotificationsSupported(): boolean {
  return !isRunningInExpoGo();
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function showActiveTimerNotification(
  activityName: string
): Promise<void> {
  const enabled = await getNotificationsEnabled();
  if (!enabled) return;

  const Notifications = await getNotificationsModule();
  if (!Notifications) return;

  const granted = await requestNotificationPermissions();
  if (!granted) return;

  await cancelActiveTimerNotification();

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('timer', {
      name: 'Active Timer',
      importance: Notifications.AndroidImportance.LOW,
    });
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Tracking: ${activityName}`,
      body: 'Timer is running.',
    },
    trigger: null,
  });

  reminderId = (
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Still tracking: ${activityName}`,
        body: 'Your timer has been running for a while.',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 60 * 60,
      },
    })
  ).toString();
}

export async function cancelActiveTimerNotification(): Promise<void> {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return;

  await Notifications.dismissAllNotificationsAsync();
  if (reminderId) {
    await Notifications.cancelScheduledNotificationAsync(reminderId);
    reminderId = null;
  }
}
