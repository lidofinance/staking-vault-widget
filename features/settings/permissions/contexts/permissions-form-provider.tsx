import { FC, PropsWithChildren, useMemo, useCallback, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import { useDappStatus } from 'modules/web3';
import { usePublicClient } from 'wagmi';

import {
  FormController,
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';
import { validateFormWithZod } from 'utils/validate-form-value';
import { editPermissionsSchema } from 'features/settings/permissions/consts';
import {
  EditPermissionsSchema,
  FieldSchema,
} from 'features/settings/permissions/types';
import {
  useEditPermissionsWithDashboard,
  simulateEditPermissionsWithDashboard,
} from 'features/settings/permissions/hooks';
import { useVaultInfo } from 'features/overview/contexts';
import { collectFormValuesToRpc } from 'features/settings/permissions/utils';
import { usePermissionsData } from './permissions-data-provider';

export const PermissionsFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const publicClient = usePublicClient();
  const { address } = useDappStatus();
  const { activeVault } = useVaultInfo();
  const { callEditPermissions } = useEditPermissionsWithDashboard();
  const { rolesList, refetch } = usePermissionsData();

  const formObject = useForm<EditPermissionsSchema>({
    resolver: validateFormWithZod(editPermissionsSchema),
    mode: 'all',
  });

  useEffect(() => {
    if (rolesList.length > 0) {
      rolesList.forEach((role) => {
        const values = role.addressList.map(
          (address) =>
            ({
              account: address,
              group: 'settled',
              state: 'display',
            }) as FieldSchema,
        );
        formObject.setValue(`${role.permissionName}`, values);
      });
    }
  }, [formObject, rolesList]);

  const onSubmit = useCallback(
    async (data: EditPermissionsSchema): Promise<boolean> => {
      // TODO: use modal from components/tx-modal
      const payload = collectFormValuesToRpc(data);
      if (activeVault?.owner && publicClient && address) {
        try {
          await simulateEditPermissionsWithDashboard({
            payload: payload,
            publicClient: publicClient,
            delegationAddress: activeVault?.owner,
            account: address,
          });
        } catch (err) {
          return false;
        }
      } else {
        return false;
      }

      try {
        await callEditPermissions(payload);
        refetch();
        return true;
      } catch (err) {
        return false;
      }

      return true;
    },
    [callEditPermissions, address, publicClient, activeVault?.owner, refetch],
  );

  const { retryEvent, retryFire } = useFormControllerRetry();
  const formControllerValue: FormControllerContextValueType<EditPermissionsSchema> =
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
