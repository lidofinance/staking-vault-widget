import { type FC, type PropsWithChildren, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { trackMatomoEvent } from 'utils/track-matomo-event';
import { useDappStatus, useLidoSDK } from 'modules/web3';
import { useVault } from 'modules/vaults';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

import { useAwaiter } from 'shared/hooks/use-awaiter';
import { FormController, useDisableForm } from 'shared/hook-form';

import { editPermissionsSchema } from './consts';
import { useEditPermissions, usePermissionsFormData } from './hooks';
import { FormBackdrop } from './components';
import { getPendingPermissionsValues, toPermissionsFormValues } from './utils';
import type { EditPermissionsSchema } from './types';
import { FormAndContentWrapper } from './styles';

export const PermissionsFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { invalidateVaultConfig } = useVault();
  const { isDappActive } = useDappStatus();
  const { data: rolesList, refetch } = usePermissionsFormData();
  const { getLatestTxBlock } = useLidoSDK();
  const asyncPermissions = useAwaiter(rolesList);
  const { editPermissions, retryEvent } = useEditPermissions();
  const disabled = useDisableForm();

  const formObject = useForm<EditPermissionsSchema>({
    defaultValues: async () =>
      toPermissionsFormValues(await asyncPermissions.awaiter),
    resolver: zodResolver(editPermissionsSchema),
    disabled: !isDappActive || disabled,
    mode: 'all',
  });

  const { reset, trigger } = formObject;

  const onSubmit = useCallback(
    async (values: EditPermissionsSchema): Promise<boolean> => {
      trackMatomoEvent(
        MATOMO_CLICK_EVENTS_TYPES.clickSettingsSubmitPermissionsTab,
      );

      // state the submitted edits were made against
      const previous = rolesList && toPermissionsFormValues(rolesList);
      const { success } = await editPermissions(values);
      const [, refetched] = await Promise.all([
        invalidateVaultConfig(),
        refetch({
          cancelRefetch: true,
          throwOnError: false,
        }),
      ]);

      // the form is always reset to fresh data, so confirmed changes are shown as current state
      // (a confirmed grant must not stay a removable 'grant' row or vanish on "Clear changes")
      const isFresh =
        refetched.isSuccess &&
        refetched.data.blockNumber >= (getLatestTxBlock() ?? 0n);

      if (!isFresh) {
        reset(
          refetched.data ? toPermissionsFormValues(refetched.data) : undefined,
        );
        return success;
      }

      const fresh = toPermissionsFormValues(refetched.data);
      reset(fresh);

      if (!success && previous) {
        // restore edits that are not applied yet on top of fresh defaults, so retry sends the remaining txs
        reset(getPendingPermissionsValues(fresh, values, previous), {
          keepDefaultValues: true,
        });
        void trigger();
      }

      return success;
    },
    [
      editPermissions,
      getLatestTxBlock,
      invalidateVaultConfig,
      refetch,
      reset,
      rolesList,
      trigger,
    ],
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
