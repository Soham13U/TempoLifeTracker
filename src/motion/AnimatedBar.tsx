import { BarTrack } from '@/components/charts/BarTrack';

type Props = {
  ratio: number;
  color: string;
  delayIndex?: number;
};

export function AnimatedBar({ ratio, color, delayIndex }: Props) {
  return <BarTrack ratio={ratio} color={color} delayIndex={delayIndex} />;
}
