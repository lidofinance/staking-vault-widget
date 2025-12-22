import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import {
  GoToVault,
  useReportCalls,
  useVault,
  useVaultConfirmingRoles,
  useVaultPermission,
  useVaultTierInfo,
  vaultTexts,
} from 'modules/vaults';
import {
  type TransactionEntry,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';

import { useAlterTier } from 'features/settings/tier/hooks';

export const useSyncTier = () => {
  const { activeVault } = useVault();
  const { refetch } = useVaultTierInfo();
  const prepareReportCalls = useReportCalls();
  const { sendTX, ...rest } = useSendTransaction();
  const { hasAdmin, isNodeOperator } = useVaultConfirmingRoles();
  const { hasPermission } = useVaultPermission('vaultConfiguration');
  const { data: alterTier } = useAlterTier();

  return {
    syncTier: useCallback(async () => {
      invariant(activeVault, '[useSyncTier] activeVault is undefined');
      invariant(alterTier, '[useSyncTier] alterTier is undefined');

      const { tierName } = alterTier;
      const tx: TransactionEntry[] = [];

      const loadingActionText = vaultTexts.actions.settings.syncTier(tierName);
      const mainActionCompleteText =
        vaultTexts.actions.settings.completeSyncTier(tierName);

      const nodeOperatorSyncTierRequest = {
        ...activeVault.operatorGrid.encode.syncTier([activeVault.address]),
        loadingActionText,
      };

      const roleOrAdminSyncTierRequest = {
        ...activeVault.dashboard.encode.syncTier(),
        loadingActionText,
      };

      if (isNodeOperator) {
        tx.push(nodeOperatorSyncTierRequest);
      }

      if (hasAdmin || hasPermission) {
        tx.push(roleOrAdminSyncTierRequest);
      }

      const { success } = await withSuccess(
        sendTX({
          transactions: async () => [...prepareReportCalls(), ...tx],
          forceAtomic: true,
          mainActionLoadingText: loadingActionText,
          mainActionCompleteText,
          renderSuccessContent: GoToVault,
        }),
      );

      await refetch();

      return success;
    }, [
      activeVault,
      prepareReportCalls,
      sendTX,
      hasAdmin,
      isNodeOperator,
      hasPermission,
      alterTier,
      refetch,
    ]),
    ...rest,
  };
};
