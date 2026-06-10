import { ScanlineOverlay } from '@/components/terminal/ScanlineOverlay';
import { TerminalBackdrop } from '@/components/terminal/TerminalBackdrop';
import { ScrollView, StyleSheet, View } from 'react-native';
import { YStack } from '@/components/ui/stacks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tempoTokens } from '@/theme/tokens';
import { useThemeColors } from '@/utils/themeColors';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  /** Set when the screen uses a native stack header (skips top safe-area inset). */
  header?: boolean;
};

export function Screen({
  children,
  scroll = true,
  padded = true,
  header = false,
}: Props) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  const content = (
    <YStack
      paddingTop={header ? 12 : insets.top + 8}
      paddingBottom={insets.bottom + tempoTokens.space.section}
      paddingHorizontal={padded ? tempoTokens.space.screen : 0}
      gap="$4"
    >
      {children}
    </YStack>
  );

  const body = scroll ? (
    <ScrollView
      style={[styles.scroll, { backgroundColor: 'transparent' }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {content}
    </ScrollView>
  ) : (
    content
  );

  return (
    <TerminalBackdrop>
      <View style={[styles.root, { backgroundColor: 'transparent' }]}>
        <ScanlineOverlay />
        {body}
      </View>
    </TerminalBackdrop>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
