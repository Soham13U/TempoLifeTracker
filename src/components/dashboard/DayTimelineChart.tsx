import { terminalBlockEnter } from '@/motion/terminalChart';
import { TerminalPanel } from '@/components/terminal/TerminalPanel';
import { tempoTokens } from '@/theme/tokens';
import type { TimelineItem } from '@/types/dashboard';
import { getCategoryColor } from '@/utils/colors';
import { getDayBounds } from '@/utils/date';
import { formatDurationHuman } from '@/utils/duration';
import { formatTime } from '@/utils/date';
import {
  assignLanes,
  clipTimelineItemToDay,
  type ChartBlock,
} from '@/utils/sessionBounds';
import { useThemeColors } from '@/utils/themeColors';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { LayoutChangeEvent, Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Line, Rect } from 'react-native-svg';
import { YStack } from '@/components/ui/stacks';

const HOUR_LABELS = [0, 6, 12, 18];
const TICK_HOURS = [0, 6, 12, 18, 24];
const MIN_BLOCK_PX = 2;
const LANE_HEIGHT = 12;
const LANE_GAP = 2;
const LABEL_HEIGHT = 14;

type Props = {
  items: TimelineItem[];
  date: Date;
};

function buildBlocks(items: TimelineItem[], date: Date): ChartBlock[] {
  const raw = items
    .map((item) => {
      const clipped = clipTimelineItemToDay(item, date);
      if (!clipped) return null;
      return {
        sessionId: clipped.sessionId,
        startMs: clipped.startMs,
        endMs: clipped.endMs,
        durationMs: clipped.durationMs,
        color: item.color ?? getCategoryColor(item.category),
        activityName: item.activityName,
      };
    })
    .filter((b): b is Omit<ChartBlock, 'lane'> => b !== null);

  return assignLanes(raw);
}

export function DayTimelineChart({ items, date }: Props) {
  const router = useRouter();
  const colors = useThemeColors();
  const [width, setWidth] = useState(0);

  const { start: dayStart, end: dayEnd } = getDayBounds(date);
  const dayMs = dayEnd - dayStart + 1;

  const blocks = useMemo(() => buildBlocks(items, date), [items, date]);
  const laneCount = blocks.reduce((max, b) => Math.max(max, b.lane + 1), 1);
  const chartHeight = Math.max(
    tempoTokens.size.chartHeight - LABEL_HEIGHT,
    laneCount * LANE_HEIGHT + (laneCount - 1) * LANE_GAP + 8
  );

  const msToX = (ms: number) => ((ms - dayStart) / dayMs) * width;
  const msToWidth = (startMs: number, endMs: number) =>
    Math.max(MIN_BLOCK_PX, msToX(endMs) - msToX(startMs));

  const tickOpacity = colors.isDark ? 0.5 : 0.25;
  const gridOpacity = colors.isDark ? 0.04 : 0.06;

  return (
    <YStack
      gap="$2"
      onLayout={(e: LayoutChangeEvent) =>
        setWidth(e.nativeEvent.layout.width)
      }
    >
      <HourLabels width={width} dayStart={dayStart} dayMs={dayMs} colors={colors} />
      <TerminalPanel padded={false}>
        <View style={{ height: chartHeight, position: 'relative' }}>
          {width > 0 ? (
            <Svg width={width} height={chartHeight}>
              {Array.from({ length: laneCount }).map((_, lane) => {
                const y = 4 + lane * (LANE_HEIGHT + LANE_GAP) + LANE_HEIGHT / 2;
                return (
                  <Line
                    key={`lane-${lane}`}
                    x1={0}
                    y1={y}
                    x2={width}
                    y2={y}
                    stroke={colors.border}
                    strokeWidth={1}
                    opacity={gridOpacity}
                  />
                );
              })}
              {TICK_HOURS.map((hour) => {
                const ms = dayStart + hour * 60 * 60 * 1000;
                const x = ((ms - dayStart) / dayMs) * width;
                return (
                  <Line
                    key={`tick-${hour}`}
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={chartHeight}
                    stroke={colors.border}
                    strokeWidth={1}
                    opacity={tickOpacity}
                  />
                );
              })}
              {blocks.map((block) => {
                const x = msToX(block.startMs);
                const w = msToWidth(block.startMs, block.endMs);
                const y = 4 + block.lane * (LANE_HEIGHT + LANE_GAP);
                return (
                  <Rect
                    key={block.sessionId}
                    x={x}
                    y={y}
                    width={w}
                    height={LANE_HEIGHT}
                    rx={0}
                    fill={block.color}
                    fillOpacity={0.85}
                    stroke={colors.isDark ? colors.phosphor : 'transparent'}
                    strokeWidth={colors.isDark ? 1 : 0}
                    strokeOpacity={0.6}
                  />
                );
              })}
            </Svg>
          ) : null}
          {width > 0
            ? blocks.map((block, index) => {
                const x = msToX(block.startMs);
                const w = msToWidth(block.startMs, block.endMs);
                const y = 4 + block.lane * (LANE_HEIGHT + LANE_GAP);
                const label = `${block.activityName}, ${formatTime(block.startMs)} to ${formatTime(block.endMs)}, ${formatDurationHuman(block.durationMs)}`;
                return (
                  <Animated.View
                    key={`tap-${block.sessionId}`}
                    entering={terminalBlockEnter(index)}
                    style={{
                      position: 'absolute',
                      left: x,
                      top: y,
                      width: w,
                      height: LANE_HEIGHT,
                    }}
                  >
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={label}
                      onPress={() => router.push(`/session/${block.sessionId}`)}
                      style={{ flex: 1 }}
                    />
                  </Animated.View>
                );
              })
            : null}
        </View>
      </TerminalPanel>
    </YStack>
  );
}

function HourLabels({
  width,
  dayStart,
  dayMs,
  colors,
}: {
  width: number;
  dayStart: number;
  dayMs: number;
  colors: ReturnType<typeof useThemeColors>;
}) {
  if (width <= 0) {
    return <View style={{ height: LABEL_HEIGHT }} />;
  }

  return (
    <View style={{ height: LABEL_HEIGHT, position: 'relative' }}>
      {HOUR_LABELS.map((hour) => {
        const ms = dayStart + hour * 60 * 60 * 1000;
        const left = ((ms - dayStart) / dayMs) * width;
        const label = String(hour).padStart(2, '0');
        return (
          <Text
            key={hour}
            style={{
              position: 'absolute',
              left: Math.max(0, left - 8),
              fontSize: 10,
              color: colors.phosphor,
              opacity: 0.7,
              fontFamily: tempoTokens.font.mono,
            }}
          >
            {label}
          </Text>
        );
      })}
    </View>
  );
}
