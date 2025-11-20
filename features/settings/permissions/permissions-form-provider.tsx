import { FC, PropsWithChildren, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useDappStatus } from 'modules/web3';
import { useVault } from 'modules/vaults';

import { useAwaiter } from 'shared/hooks/use-awaiter';
import { FormController } from 'shared/hook-form/form-controller';

import { editPermissionsSchema } from './consts';
import { useEditPermissions, usePermissionsFormData } from './hooks';
import { FormBackdrop } from './components';
import type { EditPermissionsSchema } from './types';
import { FormAndContentWrapper } from './styles';

export const PermissionsFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { invalidateVaultConfig, activeVault } = useVault();
  const { isDappActive } = useDappStatus();
  const { data: rolesList, refetch } = usePermissionsFormData();
  const asyncPermissions = useAwaiter(rolesList);
  const { editPermissions, retryEvent } = useEditPermissions();

  const formObject = useForm<EditPermissionsSchema>({
    defaultValues: async () => asyncPermissions.awaiter,
    resolver: zodResolver(editPermissionsSchema),
    disabled: !isDappActive || activeVault?.isPendingDisconnect,
    mode: 'all',
  });

  const reset = formObject.reset;

  const onSubmit = useCallback(
    async (values: EditPermissionsSchema): Promise<boolean> => {
      const { success } = await editPermissions(values);
      const [, { data: newData }] = await Promise.all([
        invalidateVaultConfig('roles'),
        refetch({
          cancelRefetch: true,
          throwOnError: false,
        }),
      ]);

      reset(newData || undefined);

      return success;
    },
    [editPermissions, invalidateVaultConfig, refetch, reset],
  );

  return (
    <FormAndContentWrapper>
      <FormController
        formObject={formObject}
        onSubmit={onSubmit}
        retryEvent={retryEvent}
        afterSubmitResetOptions={false}
      >
        {children}
      </FormController>
      <FormBackdrop open={formObject.formState.isLoading} />
    </FormAndContentWrapper>
  );
};
