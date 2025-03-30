import { FC, ReactNode, useMemo, useCallback } from 'react';
import { Address, isAddress } from 'viem';
import { FormProvider, useForm } from 'react-hook-form';

import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import { useClaimWithDelegation } from 'modules/web3/hooks/use-claim-with-delegation';

import {
  FormController,
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';

import { ClaimFormSchema } from 'features/claim/claim/types';

export const ClaimFormProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const formObject = useForm<ClaimFormSchema>({
    defaultValues: {
      recipient: null,
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });
  const { callClaim } = useClaimWithDelegation();

  const { retryEvent, retryFire } = useFormControllerRetry();

  const onSubmit = useCallback(
    async ({ recipient }: ClaimFormSchema) => {
      if (isAddress(recipient as string)) {
        // TODO: resolve recipient if ens domain
        await callClaim('0x01', recipient as Address);
        return true;
      }

      return false;
    },
    [callClaim],
  );

  const formControllerValue: FormControllerContextValueType<ClaimFormSchema> =
    useMemo(
      () => ({
        onSubmit,
        retryEvent,
        retryFire,
        onReset: formObject.reset,
      }),
      [retryFire, retryEvent, onSubmit, formObject.reset],
    );

  return (
    <FormProvider {...formObject}>
      <FormControllerContext.Provider value={formControllerValue}>
        <FormController>{children}</FormController>
      </FormControllerContext.Provider>
    </FormProvider>
  );
};
