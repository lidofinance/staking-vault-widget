import { FC, PropsWithChildren, useCallback } from 'react';
import type { Address } from 'viem';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useDappStatus } from 'modules/web3';
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

const AFTER_SUBMIT_RESET_OPTIONS = {
  keepValues: true,
};

export const CreateVaultForm: FC<PropsWithChildren> = () => {
  const { isDappActive } = useDappStatus();
  const formObject = useForm({
    defaultValues: {
      nodeOperator: '' as Address,
      vaultManager: [{ value: '' as Address }],
      nodeOperatorManager: '' as Address,
      nodeOperatorFeeRate: undefined,
      confirmExpiry: '36',
      acceptTerms: false,
      roles: {},
      step: CREATE_VAULT_FORM_STEPS.main,
    },
    disabled: !isDappActive,
    mode: 'onTouched',
    shouldUnregister: false,
    resolver: zodResolver(createVaultSchema, { async: false }, { raw: false }),
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
    <FormController
      formObject={formObject}
      onSubmit={onSubmit}
      retryEvent={retryEvent}
      // this allows not to reset values and display ResultOverview
      afterSubmitResetOptions={AFTER_SUBMIT_RESET_OPTIONS}
    >
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
            <Confirmation isShown={step === CREATE_VAULT_FORM_STEPS.confirm} />
          </>
        )}
      </FormBlock>
    </FormController>
  );
};
