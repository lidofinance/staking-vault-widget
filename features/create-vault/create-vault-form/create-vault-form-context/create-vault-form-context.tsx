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
import invariant from 'tiny-invariant';
import { useCreateVault } from 'features/create-vault/hooks/use-create-vault';

import {
  FormController,
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';

import { type CreateVaultDataContextValue } from 'features/create-vault/types';
import { createVaultSchema, CreateVaultSchema } from './validation';
import { validateFormWithZod } from 'utils/validate-form-value';
import {
  ToggleValue,
  PermissionToggleEnum,
  CREATE_VAULT_FORM_STEPS,
} from 'features/create-vault/consts';
import { formatCreateVaultData } from 'features/create-vault/utils/format-data';
import { Address } from 'viem';

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

export const CreateFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const formObject = useForm<CreateVaultSchema>({
    defaultValues: {
      nodeOperator: '' as Address,
      nodeOperatorManager: '' as Address,
      nodeOperatorFeeBP: 5,
      confirmExpiry: 36,
      defaultAdmin: '' as Address,
      roles: {},
    },
    resolver: validateFormWithZod(createVaultSchema),
    mode: 'all',
  });

  const [step, setStep] = useState(() => CREATE_VAULT_FORM_STEPS.main);
  const [permissionsView, setPermissionsView] = useState<ToggleValue>(
    PermissionToggleEnum.byPermission,
  );

  const { createVault, retryEvent } = useCreateVault();

  const onSubmit = useCallback(
    async (data: CreateVaultSchema): Promise<boolean> => {
      const payload = formatCreateVaultData(data);

      const { success } = await createVault(payload);
      return success;
    },
    [createVault],
  );

  const formControllerValue: FormControllerContextValueType<CreateVaultSchema> =
    useMemo(
      () => ({
        onSubmit,
        retryEvent,
        onReset: formObject.reset,
      }),
      [retryEvent, onSubmit, formObject.reset],
    );

  const createVaultData = useMemo<CreateVaultDataContextValue>(
    () => ({
      step,
      permissionsView,
      handleSetStep: setStep,
      handleSetPermissionsView: setPermissionsView,
    }),
    [permissionsView, step],
  );

  return (
    <FormProvider {...formObject}>
      <CreateVaultDataContext.Provider value={createVaultData}>
        <FormControllerContext.Provider value={formControllerValue}>
          <FormController>{children}</FormController>
        </FormControllerContext.Provider>
      </CreateVaultDataContext.Provider>
    </FormProvider>
  );
};
