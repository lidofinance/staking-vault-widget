import { FC, PropsWithChildren, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useDappStatus } from 'modules/web3';
import { FormController } from 'shared/hook-form/form-controller';

import { useData } from './data-provider';
import { EventSubsciption } from 'utils/event-subsciption';

const INVALID_NUMBER_MIN_MESSAGE = `Must be ${0} or above`;
const INVALID_NUMBER_MAX_MESSAGE = `Must be ${9999999} or less`;
export const someFieldSchema = z.coerce
  .number({ message: 'Only number is valid' })
  .min(0, INVALID_NUMBER_MIN_MESSAGE)
  .max(9999999, INVALID_NUMBER_MAX_MESSAGE);

export const dataFormSchema = z.object({
  someField: z
    .string()
    .refine((val) => val !== '', { message: 'Value cannot be empty' })
    .pipe(someFieldSchema)
    .transform((val) => String(val)),
});

export type DataFormSchema = z.infer<typeof dataFormSchema>;

export const DataFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isDappActive } = useDappStatus();
  const data = useData();
  const currentValue = data?.someField.find((item) => item.type === 'Current');

  const formObject = useForm<DataFormSchema>({
    defaultValues: {
      someField: currentValue?.value || '',
    },
    disabled: !isDappActive,
    resolver: zodResolver(dataFormSchema),
    mode: 'all',
  });

  const onSubmit = useCallback(async (): Promise<boolean> => {
    const success = await Promise.resolve(true);

    return success;
  }, []);

  return (
    <FormProvider {...formObject}>
      <FormController onSubmit={onSubmit} retryEvent={new EventSubsciption()}>
        {children}
      </FormController>
    </FormProvider>
  );
};
