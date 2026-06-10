import { BracketHeader } from '@/components/terminal/BracketHeader';

type Props = {
  title: string;
  action?: React.ReactNode;
};

export function SectionHeader({ title, action }: Props) {
  return <BracketHeader title={title} action={action} />;
}
