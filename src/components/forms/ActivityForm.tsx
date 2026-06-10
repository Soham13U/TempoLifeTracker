import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { tempoTokens } from '@/theme/tokens';
import { ACTIVITY_CATEGORIES, type ActivityCategory } from '@/types/activity';
import { CATEGORY_LABELS } from '@/utils/categories';
import {
  ICON_CATEGORIES,
  formatIconName,
  getActivityIcon,
} from '@/utils/icons';
import { useThemeColors } from '@/utils/themeColors';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet } from 'react-native';
import { Input, ScrollView } from 'tamagui';
import { XStack, YStack } from '@/components/ui/stacks';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(40),
  category: z.enum([
    'focus',
    'learning',
    'health',
    'life',
    'leisure',
    'rest',
    'other',
  ] as const),
  icon: z.string().min(1),
});

export type ActivityFormValues = z.infer<typeof schema>;

type Props = {
  defaultValues?: Partial<ActivityFormValues>;
  onSubmit: (values: ActivityFormValues) => Promise<void>;
  submitLabel?: string;
};

export function ActivityForm({
  defaultValues,
  onSubmit,
  submitLabel = 'Save',
}: Props) {
  const colors = useThemeColors();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      category: 'focus',
      icon: 'circle',
      ...defaultValues,
    },
  });

  const selectedIcon = watch('icon');
  const Icon = getActivityIcon(selectedIcon);

  return (
    <YStack gap="$4">
      <YStack gap="$2">
        <AppText variant="caption">Name</AppText>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
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
        {errors.name ? (
          <AppText variant="caption" color="$danger">
            {errors.name.message}
          </AppText>
        ) : null}
      </YStack>

      <YStack gap="$2">
        <AppText variant="caption">Category</AppText>
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <XStack gap="$2">
                {ACTIVITY_CATEGORIES.map((cat) => (
                  <AppButton
                    key={cat}
                    size="sm"
                    variant={value === cat ? 'primary' : 'secondary'}
                    onPress={() => onChange(cat as ActivityCategory)}
                  >
                    {CATEGORY_LABELS[cat]}
                  </AppButton>
                ))}
              </XStack>
            </ScrollView>
          )}
        />
      </YStack>

      <YStack gap="$3">
        <AppText variant="caption">Icon</AppText>
        <YStack
          ai="center"
          jc="center"
          bg="$card"
          br="$4"
          py="$4"
          borderWidth={1}
          borderColor="$borderColor"
        >
          <YStack
            w={64}
            h={64}
            ai="center"
            jc="center"
            br="$4"
            bg="$background"
          >
            <Icon size={32} color={colors.primary} />
          </YStack>
          <AppText variant="body" mt="$2" fontWeight="600">
            {formatIconName(selectedIcon)}
          </AppText>
        </YStack>

        <Controller
          control={control}
          name="icon"
          render={({ field: { onChange, value } }) => (
            <YStack gap="$4">
              {ICON_CATEGORIES.map(({ label, icons }) => (
                <YStack key={label} gap="$2">
                  <AppText variant="caption" color="$colorMuted">
                    {label}
                  </AppText>
                  <XStack flexWrap="wrap" gap="$2">
                    {icons.map((iconName) => {
                      const I = getActivityIcon(iconName);
                      const selected = value === iconName;
                      return (
                        <Pressable
                          key={iconName}
                          onPress={() => onChange(iconName)}
                          style={({ pressed }) => [
                            styles.iconCell,
                            {
                              backgroundColor: selected
                                ? colors.primary
                                : colors.card,
                              borderColor: selected
                                ? colors.primary
                                : colors.border,
                              opacity: pressed ? 0.75 : 1,
                            },
                          ]}
                        >
                          <I
                            size={22}
                            color={selected ? '#FFFFFF' : colors.icon}
                          />
                        </Pressable>
                      );
                    })}
                  </XStack>
                </YStack>
              ))}
            </YStack>
          )}
        />
      </YStack>

      <AppButton
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        opacity={isSubmitting ? 0.6 : 1}
      >
        {submitLabel}
      </AppButton>
    </YStack>
  );
}

const styles = StyleSheet.create({
  iconCell: {
    width: 48,
    height: 48,
    borderRadius: tempoTokens.radius.button,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
