import { FC, PropsWithChildren, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateVault } from 'features/create-vault/create-vault-form/use-create-vault';

import { FormController } from 'shared/hook-form/form-controller';

import { CreateVaultSchema } from 'features/create-vault/types';
import { createVaultSchema } from './validation';
import {
  CREATE_VAULT_FORM_STEPS,
  CREATE_VAULT_STEPS,
  getSectionNameByStep,
} from 'features/create-vault/consts';

import { FormTitle, FormBlock } from './styles';
import { MainSettings } from './stages/main-settings';
import { Confirmation } from './stages/confirmation';

import type { Address } from 'viem';
import { ResultOverview } from './stages/result-overview';

const defaultValues: CreateVaultSchema = {
  nodeOperator: '' as Address,
  vaultManager: [{ value: '' as Address }],
  nodeOperatorManager: '' as Address,
  nodeOperatorFeeBP: '' as unknown as number,
  confirmExpiry: 36,
  acceptTerms: false,
  roles: {},
  step: CREATE_VAULT_FORM_STEPS.main,
};

export const CreateVaultForm: FC<PropsWithChildren> = () => {
  const formObject = useForm({
    defaultValues,
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
      <FormBlock>
        <FormController onSubmit={onSubmit} retryEvent={retryEvent}>
          {mutation.isSuccess ? (
            <ResultOverview transactionResult={mutation.data} />
          ) : (
            <>
              Step {step} of {CREATE_VAULT_STEPS}
              <FormTitle>{getSectionNameByStep(step)}</FormTitle>
              <MainSettings isShown={step === CREATE_VAULT_FORM_STEPS.main} />
              <Confirmation
                isShown={step === CREATE_VAULT_FORM_STEPS.confirm}
              />
            </>
          )}
        </FormController>
      </FormBlock>
    </FormProvider>
  );
};
