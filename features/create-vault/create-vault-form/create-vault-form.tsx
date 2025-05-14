import {
  FC,
  PropsWithChildren,
  useState,
  useMemo,
  useCallback,
  createContext,
  useContext,
} from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import invariant from 'tiny-invariant';
import { useCreateVault } from 'features/create-vault/hooks/use-create-vault';

import { FormController } from 'shared/hook-form/form-controller';

import {
  CreateVaultSchema,
  type CreateVaultDataContextValue,
} from 'features/create-vault/types';
import { createVaultSchema } from './validation';
import {
  CREATE_VAULT_FORM_STEPS,
  CREATE_VAULT_STEPS,
  getSectionNameByStep,
} from 'features/create-vault/consts';
import { formatCreateVaultData } from 'features/create-vault/utils/format-data';

import { FormTitle, FormBlock } from './styles';
import { MainSettings } from './stages/main-settings';
import { Confirmation } from './stages/confirmation';

import type { Address } from 'viem';

const CreateVaultDataContext =
  createContext<CreateVaultDataContextValue | null>(null);
CreateVaultDataContext.displayName = 'CreateVaultDataContext';

export const useCreateVaultFormData = () => {
  const value = useContext(CreateVaultDataContext);
  invariant(
    value,
    'useCreateVaultFormData was used outside the CreateVaultDataContext provider',
  );

  return value;
};

export const CreateVaultForm: FC<PropsWithChildren> = () => {
  const [step, setStep] = useState(() => CREATE_VAULT_FORM_STEPS.main);
  const formObject = useForm({
    defaultValues: {
      nodeOperator: '' as Address,
      nodeOperatorManager: '' as Address,
      defaultAdmin: '' as Address,
      nodeOperatorFeeBP: 5,
      confirmExpiry: 36,
      acceptTerms: false,
      roles: {},
    },
    mode: 'onBlur',
    resolver: zodResolver(createVaultSchema, { async: true }),
  });

  const { createVault, retryEvent } = useCreateVault();

  const onSubmit = useCallback(
    async (data: CreateVaultSchema): Promise<boolean> => {
      const payload = formatCreateVaultData(data);

      const { success } = await createVault(payload);
      return success;
    },
    [createVault],
  );

  const createVaultData = useMemo<CreateVaultDataContextValue>(
    () => ({
      step,
      handleSetStep: setStep,
    }),
    [step],
  );

  return (
    <FormProvider {...formObject}>
      <CreateVaultDataContext.Provider value={createVaultData}>
        <FormBlock>
          <FormController onSubmit={onSubmit} retryEvent={retryEvent}>
            Step {step + 1} of {CREATE_VAULT_STEPS}
            <FormTitle>{getSectionNameByStep(step)}</FormTitle>
            <MainSettings isShown={step === CREATE_VAULT_FORM_STEPS.main} />
            <Confirmation isShown={step === CREATE_VAULT_FORM_STEPS.confirm} />
            {/*TODO: Final overview stage*/}
          </FormController>
        </FormBlock>
      </CreateVaultDataContext.Provider>
    </FormProvider>
  );
};
