import { FC, PropsWithChildren, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

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
import { useAwaiter } from 'shared/hooks/use-awaiter';
import { FormBackdrop } from '../components';

export const PermissionsFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { rolesList, refetch } = usePermissionsData();
  const asyncPermissions = useAwaiter(rolesList);
  const { editPermissions, retryEvent } = useEditPermissions();

  const formObject = useForm<EditPermissionsSchema>({
    defaultValues: async () =>
      (await asyncPermissions.awaiter) as Record<PermissionKeys, FieldSchema[]>,
    resolver: validateFormWithZod(editPermissionsSchema),
    mode: 'onBlur',
  });

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
        formObject.reset(newDefaultValues);
      }

      return success;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editPermissions, refetch, formObject.reset],
  );

  return (
    <FormProvider {...formObject}>
      <FormController onSubmit={onSubmit} retryEvent={retryEvent}>
        {children}
      </FormController>
      <FormBackdrop open={formObject.formState.isLoading} />
    </FormProvider>
  );
};
