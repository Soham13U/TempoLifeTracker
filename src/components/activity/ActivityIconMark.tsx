import { useThemeColors } from '@/utils/themeColors';
import type { LucideIcon } from 'lucide-react-native';
import { View, type StyleProp, type ViewStyle } from 'react-native';

export const CATEGORY_DOT_SIZE = 8;
export const CATEGORY_DOT_INSET = 8;

type ActivityIconMarkProps = {
  icon: LucideIcon;
  size?: number;
  container?: number;
};

export function ActivityIconMark({
  icon: Icon,
  size = 22,
  container = 28,
}: ActivityIconMarkProps) {
  const colors = useThemeColors();

  return (
    <View
      style={{
        width: container,
        height: container,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon size={size} color={colors.icon} />
    </View>
  );
}

type CategoryDotProps = {
  color: string;
  style?: StyleProp<ViewStyle>;
};

export function CategoryDot({ color, style }: CategoryDotProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        {
          position: 'absolute',
          width: CATEGORY_DOT_SIZE,
          height: CATEGORY_DOT_SIZE,
          borderRadius: CATEGORY_DOT_SIZE / 2,
          backgroundColor: color,
          borderWidth: 1,
          borderColor: colors.card,
        },
        style,
      ]}
    />
  );
}
