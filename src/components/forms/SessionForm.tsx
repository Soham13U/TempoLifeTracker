import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { tempoTokens } from '@/theme/tokens';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Input, TextArea } from 'tamagui';
import { YStack } from '@/components/ui/stacks';
import { z } from 'zod';

const schema = z.object({
  startTime: z.string().min(1),
  endTime: z.string().optional(),
  note: z.string().max(500).optional(),
});

export type SessionFormValues = z.infer<typeof schema>;

type Props = {
  defaultValues: SessionFormValues;
  onSubmit: (values: SessionFormValues) => Promise<void>;
  onDelete?: () => Promise<void>;
};

function parseTimeOnDate(timeStr: string, baseDate: Date): number {
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date(baseDate);
  d.setHours(h, m, 0, 0);
  return d.getTime();
}

export { parseTimeOnDate };

export function SessionForm({ defaultValues, onSubmit, onDelete }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SessionFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <YStack gap="$4">
      <YStack gap="$2">
        <AppText variant="caption">Start (HH:mm)</AppText>
        <Controller
          control={control}
          name="startTime"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="09:30"
              bg="$card"
              borderColor="$borderColor"
              color="$color"
              style={{
                fontFamily: tempoTokens.font.mono,
                borderRadius: tempoTokens.radius.button,
              }}
            />
          )}
        />
        {errors.startTime ? (
          <AppText variant="caption" color="$danger">
            {errors.startTime.message}
          </AppText>
        ) : null}
      </YStack>

      <YStack gap="$2">
        <AppText variant="caption">End (HH:mm, optional if active)</AppText>
        <Controller
          control={control}
          name="endTime"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="10:45"
              bg="$card"
              borderColor="$borderColor"
              color="$color"
              style={{
                fontFamily: tempoTokens.font.mono,
                borderRadius: tempoTokens.radius.button,
              }}
            />
          )}
        />
      </YStack>

      <YStack gap="$2">
        <AppText variant="caption">Note</AppText>
        <Controller
          control={control}
          name="note"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextArea
              value={value ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
              bg="$card"
              borderColor="$borderColor"
              color="$color"
              style={{
                fontFamily: tempoTokens.font.mono,
                borderRadius: tempoTokens.radius.button,
              }}
              height={80}
            />
          )}
        />
      </YStack>

      <AppButton
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        Save session
      </AppButton>

      {onDelete ? (
        <AppButton variant="danger" onPress={onDelete}>
          Delete session
        </AppButton>
      ) : null}
    </YStack>
  );
}
