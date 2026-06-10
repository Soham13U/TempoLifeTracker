import * as activityRepo from '@/db/activityRepo';
import * as sessionRepo from '@/db/sessionRepo';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { formatTime } from './date';
import { formatDurationHuman } from './duration';
import { getElapsedMs } from './duration';

export async function exportJson(): Promise<void> {
  const activities = await activityRepo.getAllActivities(true);
  const sessions = await sessionRepo.getAllSessions();
  const payload = JSON.stringify({ activities, sessions }, null, 2);
  const path = `${FileSystem.cacheDirectory}tempo-export.json`;
  await FileSystem.writeAsStringAsync(path, payload);
  await Sharing.shareAsync(path, { mimeType: 'application/json' });
}

export async function exportCsv(): Promise<void> {
  const activities = await activityRepo.getAllActivities(true);
  const sessions = await sessionRepo.getAllSessions();
  const activityMap = new Map(activities.map((a) => [a.id, a]));

  const header =
    'activity_name,category,start_time,end_time,duration,note';
  const rows = sessions.map((s) => {
    const activity = activityMap.get(s.activityId);
    const duration = formatDurationHuman(getElapsedMs(s));
    const note = (s.note ?? '').replace(/"/g, '""');
    return [
      `"${activity?.name ?? 'Unknown'}"`,
      activity?.category ?? 'other',
      formatTime(s.startTime),
      s.endTime ? formatTime(s.endTime) : '',
      duration,
      `"${note}"`,
    ].join(',');
  });

  const csv = [header, ...rows].join('\n');
  const path = `${FileSystem.cacheDirectory}tempo-export.csv`;
  await FileSystem.writeAsStringAsync(path, csv);
  await Sharing.shareAsync(path, { mimeType: 'text/csv' });
}
