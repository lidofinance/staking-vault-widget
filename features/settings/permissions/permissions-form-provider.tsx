import { type FC, type PropsWithChildren, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { trackMatomoEvent } from 'utils/track-matomo-event';
import { isBehindTxBlock, useDappStatus, useLidoSDK } from 'modules/web3';
import { useVault } from 'modules/vaults';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

import { useAwaiter } from 'shared/hooks/use-awaiter';
import { useConnectionGuard } from 'shared/hooks/use-connection-guard';
import { FormController, useDisableForm } from 'shared/hook-form';
import { useTransactionModal } from 'shared/components/transaction-modal';

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
  const { dispatchModal } = useTransactionModal();
  const asyncPermissions = useAwaiter(rolesList);
  const { editPermissions, retryEvent, retryFire } = useEditPermissions();
  const disabled = useDisableForm();
  const startConnectionGuard = useConnectionGuard();

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
      const isSameConnection = startConnectionGuard();
      const { success } = await editPermissions(values);
      const [, refetched] = await Promise.all([
        invalidateVaultConfig(),
        refetch({
          cancelRefetch: true,
          throwOnError: false,
        }),
      ]);

      // the wallet switched meanwhile: the form is already reset for the new connection,
      // so edits of the previous one must not be restored into it
      if (!isSameConnection()) return success;

      // the form is always reset to fresh data, so confirmed changes are shown as current state
      // (a confirmed grant must not stay a removable 'grant' row or vanish on "Clear changes")
      const isFresh =
        refetched.isSuccess &&
        !isBehindTxBlock(refetched.data.blockNumber, getLatestTxBlock());

      if (!isFresh) {
        if (success) {
          reset(
            refetched.data
              ? toPermissionsFormValues(refetched.data)
              : undefined,
          );
        } else {
          // without fresh data pending edits can't be told from applied ones, so the form keeps
          // the user's edits for a new submit once data refreshes, and retry is disabled for this attempt
          dispatchModal({ type: 'disable-retry', onRetry: retryFire });
        }
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
      dispatchModal,
      editPermissions,
      getLatestTxBlock,
      invalidateVaultConfig,
      refetch,
      reset,
      retryFire,
      rolesList,
      startConnectionGuard,
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
