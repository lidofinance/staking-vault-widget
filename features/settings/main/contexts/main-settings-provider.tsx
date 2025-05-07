import { FC, PropsWithChildren, useMemo, useCallback, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import {
  FormController,
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';

import {
  EditMainSettingsSchema,
  ManagersKeys,
  RoleFieldSchema,
} from 'features/settings/main/types';
import { useEditMainSettings } from 'features/settings/main/hooks';
import { validateFormWithZod } from 'utils/validate-form-value';
import {
  editMainSettingsSchema,
  multipleDataFields,
} from 'features/settings/main/consts';
import { useVaultInfo } from 'modules/vaults';
import { Address } from 'viem';

export const MainSettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { activeVault, refetch, isRefetching } = useVaultInfo();
  const { editMainSettings, retryEvent } = useEditMainSettings();

  const formObject = useForm<EditMainSettingsSchema>({
    defaultValues: {
      nodeOperatorManagers: [],
      nodeOperatorFeeBP: [],
      confirmExpiry: [],
      defaultAdmins: [],
    },
    resolver: validateFormWithZod(editMainSettingsSchema),
    mode: 'all',
  });

  useEffect(() => {
    if (!isRefetching) {
      (multipleDataFields as ManagersKeys[]).map((key) => {
        const managersAddresses = activeVault?.[key];
        if (managersAddresses && managersAddresses.length > 0) {
          managersAddresses.forEach((address: Address, index: number) => {
            const value = {
              value: address,
              state: 'display',
              isGranted: true,
            } as unknown as RoleFieldSchema;
            formObject.setValue(`${key}.${index}` as const, value);
          });
        }
      });
    }
  }, [formObject, activeVault, isRefetching]);

  const onSubmit = useCallback(
    async (data: EditMainSettingsSchema): Promise<boolean> => {
      const { success } = await editMainSettings(data);

      // refetch even when error because some transactions may be successful
      // or reverted due to state change
      await refetch({ cancelRefetch: true, throwOnError: true });

      return success;
    },
    [editMainSettings, refetch],
  );

  const { reset } = formObject;
  const formControllerValue: FormControllerContextValueType<EditMainSettingsSchema> =
    useMemo(
      () => ({
        onSubmit,
        retryEvent,
        onReset: reset,
      }),
      [retryEvent, onSubmit, reset],
    );

  return (
    <FormProvider {...formObject}>
      <FormControllerContext.Provider value={formControllerValue}>
        <FormController>{children}</FormController>
      </FormControllerContext.Provider>
    </FormProvider>
  );
};
