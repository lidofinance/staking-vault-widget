import { FC, PropsWithChildren, useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { useDappStatus } from 'modules/web3';
import { useVault } from 'modules/vaults';

import { useAwaiter } from 'shared/hooks/use-awaiter';
import { FormController } from 'shared/hook-form/form-controller';
import { validateFormWithZod } from 'utils/validate-form-value';

import { editPermissionsSchema } from '../consts';
import { EditPermissionsSchema, FieldSchema, PermissionKeys } from '../types';
import { useEditPermissions, usePermissionsFormData } from '../hooks';
import { collectFormValuesToRpc } from '../utils';
import { FormBackdrop } from '../components';

export const PermissionsFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { invalidateVaultConfig } = useVault();
  const { isDappActive } = useDappStatus();
  const { data: rolesList, refetch } = usePermissionsFormData();
  const asyncPermissions = useAwaiter(rolesList);
  const { editPermissions, retryEvent } = useEditPermissions();

  const formObject = useForm<EditPermissionsSchema>({
    defaultValues: async () =>
      (await asyncPermissions.awaiter) as Record<PermissionKeys, FieldSchema[]>,
    resolver: validateFormWithZod(editPermissionsSchema),
    disabled: !isDappActive,
    mode: 'onBlur',
  });

  const reset = formObject.reset;

  const onSubmit = useCallback(
    async (data: EditPermissionsSchema): Promise<boolean> => {
      const { success } = await editPermissions(collectFormValuesToRpc(data));
      const [{ data: newData }] = await Promise.all([
        refetch({
          cancelRefetch: true,
          throwOnError: false,
        }),
        invalidateVaultConfig('roles'),
      ]);

      reset(newData || undefined);

      return success;
    },
    [editPermissions, invalidateVaultConfig, refetch, reset],
  );

  return (
    <>
      <FormController
        formObject={formObject}
        onSubmit={onSubmit}
        retryEvent={retryEvent}
        afterSubmitResetOptions={false}
      >
        {children}
      </FormController>
      <FormBackdrop open={formObject.formState.isLoading} />
    </>
  );
};
