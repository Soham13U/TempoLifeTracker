import { Tabs } from 'expo-router';
import { tempoTokens } from '@/theme/tokens';
import { Calendar, LayoutGrid, List, Settings } from 'lucide-react-native';
import { useThemeColors } from '@/utils/themeColors';

export default function TabLayout() {
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'shift',
        tabBarActiveTintColor: colors.phosphor,
        tabBarInactiveTintColor: '#71717A',
        sceneStyle: { backgroundColor: colors.background },
        tabBarLabelStyle: {
          fontFamily: tempoTokens.font.mono,
          fontSize: 11,
          letterSpacing: 0.5,
        },
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, size }) => <LayoutGrid color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: 'Activities',
          tabBarIcon: ({ color, size }) => <List color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
