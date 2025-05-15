import { FC, PropsWithChildren, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import { FormController } from 'shared/hook-form/form-controller';
import { validateFormWithZod } from 'utils/validate-form-value';
import { editPermissionsSchema } from 'features/settings/permissions/consts';
import { EditPermissionsSchema } from 'features/settings/permissions/types';
import { useEditPermissions } from 'features/settings/permissions/hooks';
import { collectFormValuesToRpc } from 'features/settings/permissions/utils';
import { usePermissionsData } from './permissions-data-provider';
import { useAwaiter } from 'shared/hooks/use-awaiter';
import { FormBackdrop } from '../components';

export const PermissionsFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { rolesList, refetch } = usePermissionsData();
  const someAsync = useAwaiter(rolesList);
  const { editPermissions, retryEvent } = useEditPermissions();

  const formObject = useForm<EditPermissionsSchema>({
    defaultValues: async () => {
      const data = await someAsync.awaiter;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return data!;
    },
    resolver: validateFormWithZod(editPermissionsSchema),
    mode: 'onBlur',
  });

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
      <FormBackdrop open={formObject.formState.isLoading} />
    </FormProvider>
  );
};
