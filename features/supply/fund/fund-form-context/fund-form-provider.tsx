import { FC, ReactNode, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useFund } from 'features/supply/fund/hooks/use-fund';
import { FormController } from 'shared/hook-form/form-controller';
import { FundFormSchema } from 'features/supply/fund/types';
import invariant from 'tiny-invariant';

export const FundFormProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const formObject = useForm<FundFormSchema>({
    defaultValues: {
      amount: undefined,
    },
    mode: 'all',
    // TODO: add validation
    reValidateMode: 'onChange',
  });

  const { fund, retryEvent } = useFund();

  const onSubmit = useCallback(
    async ({ amount }: FundFormSchema) => {
      // TODO: add validation, remove stub
      if (!amount) return false;
      invariant(amount, '[FundFormProvider] amount is undefined');
      return fund(amount);
    },
    [fund],
  );

  return (
    <FormProvider {...formObject}>
      <FormController onSubmit={onSubmit} retryEvent={retryEvent}>
        {children}
      </FormController>
    </FormProvider>
  );
};
