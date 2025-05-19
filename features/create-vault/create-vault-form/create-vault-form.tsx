import { FC, PropsWithChildren, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { FormController } from 'shared/hook-form/form-controller';

import { CreateVaultSchema } from 'features/create-vault/types';
import {
  CREATE_VAULT_FORM_STEPS,
  CREATE_VAULT_STEPS,
  SECTION_NAMES_BY_STEP,
} from 'features/create-vault/consts';

import { createVaultSchema } from './validation';
import { useCreateVault } from './use-create-vault';

import { MainSettings } from './stages/main-settings';
import { Confirmation } from './stages/confirmation';
import { ResultOverview } from './stages/result-overview';

import { FormTitle, FormBlock, FormSubtitle } from './styles';

import type { Address } from 'viem';

export const CreateVaultForm: FC<PropsWithChildren> = () => {
  const formObject = useForm({
    defaultValues: {
      nodeOperator: '' as Address,
      vaultManager: [{ value: '' as Address }],
      nodeOperatorManager: '' as Address,
      nodeOperatorFeeBP: undefined,
      confirmExpiry: 36,
      acceptTerms: false,
      roles: {},
      step: CREATE_VAULT_FORM_STEPS.main,
    },
    mode: 'onTouched',
    resolver: zodResolver(createVaultSchema, { async: true }),
  });

  const { createVault, retryEvent, mutation } = useCreateVault();

  const onSubmit = useCallback(
    async (data: CreateVaultSchema): Promise<boolean> => {
      const { success } = await createVault(data);
      return success;
    },
    [createVault],
  );

  const step = formObject.watch('step');

  return (
    <FormProvider {...formObject}>
      <FormController onSubmit={onSubmit} retryEvent={retryEvent}>
        <FormBlock>
          {mutation.isSuccess ? (
            <ResultOverview transactionResult={mutation.data} />
          ) : (
            <>
              <FormSubtitle>
                Step {step} of {CREATE_VAULT_STEPS}
              </FormSubtitle>
              <FormTitle> {SECTION_NAMES_BY_STEP[step]}</FormTitle>
              <MainSettings isShown={step === CREATE_VAULT_FORM_STEPS.main} />
              <Confirmation
                isShown={step === CREATE_VAULT_FORM_STEPS.confirm}
              />
            </>
          )}
        </FormBlock>
      </FormController>
    </FormProvider>
  );
};
