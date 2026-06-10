import { TerminalMeter } from '@/components/terminal/TerminalMeter';

type Props = {
  ratio: number;
  color: string;
  delayIndex?: number;
};

export function AnimatedBar({ ratio, color, delayIndex }: Props) {
  return <TerminalMeter ratio={ratio} color={color} delayIndex={delayIndex} />;
}
