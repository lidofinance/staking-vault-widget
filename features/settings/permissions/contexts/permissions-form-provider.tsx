import { FC, PropsWithChildren, useCallback, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import { FormController } from 'shared/hook-form/form-controller';
import { validateFormWithZod } from 'utils/validate-form-value';
import { editPermissionsSchema } from 'features/settings/permissions/consts';
import {
  EditPermissionsSchema,
  FieldSchema,
} from 'features/settings/permissions/types';
import { useEditPermissions } from 'features/settings/permissions/hooks';
import { collectFormValuesToRpc } from 'features/settings/permissions/utils';
import { usePermissionsData } from './permissions-data-provider';

export const PermissionsFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const formObject = useForm<EditPermissionsSchema>({
    resolver: validateFormWithZod(editPermissionsSchema),
    mode: 'all',
  });
  const { editPermissions, retryEvent } = useEditPermissions();
  const { rolesList, refetch } = usePermissionsData();

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
        formObject.setValue(`${role.permissionName}` as const, values);
      });
    }
  }, [formObject, rolesList]);

  const onSubmit = useCallback(
    async (data: EditPermissionsSchema): Promise<boolean> => {
      const { success } = await editPermissions(collectFormValuesToRpc(data));
      await refetch({ cancelRefetch: true, throwOnError: false });
      return success;
    },
    [editPermissions, refetch],
  );

  return (
    <FormProvider {...formObject}>
      <FormController onSubmit={onSubmit} retryEvent={retryEvent}>
        {children}
      </FormController>
    </FormProvider>
  );
};
