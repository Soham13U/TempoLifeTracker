import { endOfDay, format, startOfDay } from 'date-fns';

export function getDayBounds(date: Date): { start: number; end: number } {
  const start = startOfDay(date).getTime();
  const end = endOfDay(date).getTime();
  return { start, end };
}

export function formatDateLabel(date: Date): string {
  return format(date, 'EEEE, d MMMM');
}

export function formatShortDate(date: Date): string {
  return format(date, 'd MMM');
}

export function formatTime(timestamp: number): string {
  return format(new Date(timestamp), 'HH:mm');
}

export function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
