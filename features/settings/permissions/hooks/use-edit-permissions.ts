import invariant from 'tiny-invariant';
import { useCallback } from 'react';

import {
  type TransactionEntry,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';
import { useVault, vaultTexts, GoToVault } from 'modules/vaults';

import { GrantRole } from '../types';

type EditPermissionsArgs = {
  toRevoke: GrantRole[];
  toGrant: GrantRole[];
};

export const useEditPermissions = () => {
  const { activeVault } = useVault();
  const { sendTX, ...rest } = useSendTransaction();

  return {
    editPermissions: useCallback(
      async ({ toGrant, toRevoke }: EditPermissionsArgs) => {
        invariant(
          activeVault,
          '[useEditPermissions] activeVault is not defined',
        );
        const transactions: TransactionEntry[] = [];
        if (toGrant.length > 0) {
          transactions.push({
            ...activeVault.dashboard.encode.grantRoles([toGrant]),
            loadingActionText: vaultTexts.actions.settings.rolesGrantLoading(
              toGrant.length,
            ),
          });
        }
        if (toRevoke.length > 0) {
          transactions.push({
            ...activeVault.dashboard.encode.revokeRoles([toRevoke]),
            loadingActionText: vaultTexts.actions.settings.rolesRevokeLoading(
              toRevoke.length,
            ),
          });
        }
        const result = withSuccess(
          sendTX({
            transactions,
            mainActionLoadingText: 'Editing vault permissions',
            mainActionCompleteText: 'Vault permissions edited',
            renderSuccessContent: GoToVault,
          }),
        );

        return result;
      },
      [activeVault, sendTX],
    ),
    ...rest,
  };
};
