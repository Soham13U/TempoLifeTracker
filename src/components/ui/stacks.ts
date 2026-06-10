import { XStack as TamaguiXStack, YStack as TamaguiYStack } from 'tamagui';
import type { ComponentType } from 'react';

// Tamagui v2 strict props are narrower than runtime; use loose typing for layout.
export const XStack = TamaguiXStack as ComponentType<Record<string, unknown>>;
export const YStack = TamaguiYStack as ComponentType<Record<string, unknown>>;
