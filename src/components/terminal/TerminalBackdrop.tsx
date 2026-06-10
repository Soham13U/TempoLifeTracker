import { useThemeColors } from '@/utils/themeColors';
import { useState, type ReactNode } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import Svg, { Defs, Line, Pattern, Rect } from 'react-native-svg';

type Props = {
  children: ReactNode;
};

function GridPattern({
  width,
  height,
  stroke,
}: {
  width: number;
  height: number;
  stroke: string;
}) {
  if (width <= 0 || height <= 0) return null;

  return (
    <Svg
      width={width}
      height={height}
      style={{ position: 'absolute', top: 0, left: 0 }}
      pointerEvents="none"
    >
      <Defs>
        <Pattern id="grid" width={24} height={24} patternUnits="userSpaceOnUse">
          <Line x1={24} y1={0} x2={24} y2={24} stroke={stroke} strokeWidth={0.5} opacity={0.04} />
          <Line x1={0} y1={24} x2={24} y2={24} stroke={stroke} strokeWidth={0.5} opacity={0.04} />
        </Pattern>
      </Defs>
      <Rect width={width} height={height} fill="url(#grid)" />
    </Svg>
  );
}

export function TerminalBackdrop({ children }: Props) {
  const colors = useThemeColors();
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };

  if (!colors.isDark) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }} onLayout={onLayout}>
        {children}
      </View>
    );
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.background }}
      onLayout={onLayout}
    >
      <GridPattern
        width={size.width}
        height={size.height}
        stroke={colors.border}
      />
      {children}
    </View>
  );
}
