import { FC, PropsWithChildren, useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { useDappStatus } from 'modules/web3';
import { useAwaiter } from 'shared/hooks/use-awaiter';
import { FormController } from 'shared/hook-form/form-controller';
import { validateFormWithZod } from 'utils/validate-form-value';

import { editPermissionsSchema } from 'features/settings/permissions/consts';
import {
  EditPermissionsSchema,
  FieldSchema,
  PermissionKeys,
} from 'features/settings/permissions/types';
import { useEditPermissions } from 'features/settings/permissions/hooks';
import {
  collectFormValuesToRpc,
  collectRolesToFormValues,
  formatRawPermissions,
} from 'features/settings/permissions/utils';
import { usePermissionsData } from './permissions-data-provider';

import { FormBackdrop } from '../components';

export const PermissionsFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { isDappActive } = useDappStatus();
  const { rolesList, refetch } = usePermissionsData();
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
      const { data: refetchData } = await refetch({
        cancelRefetch: true,
        throwOnError: false,
      });

      const newDefaultValues = collectRolesToFormValues(
        formatRawPermissions(refetchData as []),
      );
      if (newDefaultValues) {
        reset(newDefaultValues);
      }

      return success;
    },
    [editPermissions, refetch, reset],
  );

  return (
    <>
      <FormController
        formObject={formObject}
        onSubmit={onSubmit}
        retryEvent={retryEvent}
      >
        {children}
      </FormController>
      <FormBackdrop open={formObject.formState.isLoading} />
    </>
  );
};
