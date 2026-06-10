import * as Haptics from 'expo-haptics';

async function run(fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
  } catch {
    // Simulators and unsupported devices fail silently.
  }
}

export function lightImpact(): void {
  void run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

export function mediumImpact(): void {
  void run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
}

export function selection(): void {
  void run(() => Haptics.selectionAsync());
}
