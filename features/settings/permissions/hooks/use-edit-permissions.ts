import invariant from 'tiny-invariant';
import { useCallback } from 'react';

import {
  type TransactionEntry,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';
import {
  useVault,
  vaultTexts,
  GoToVault,
  VAULTS_ALL_ROLES_MAP,
} from 'modules/vaults';

import type {
  EditPermissionsSchema,
  GrantRole,
  PermissionKeys,
} from '../types';

export const useEditPermissions = () => {
  const { activeVault } = useVault();
  const { sendTX, ...rest } = useSendTransaction();

  return {
    editPermissions: useCallback(
      async (values: EditPermissionsSchema) => {
        invariant(
          activeVault,
          '[useEditPermissions] activeVault is not defined',
        );

        const { toGrant, toRevoke } = Object.entries(values).reduce<{
          toRevoke: GrantRole[];
          toGrant: GrantRole[];
        }>(
          ({ toRevoke, toGrant }, [key, fieldList]) => {
            const role = VAULTS_ALL_ROLES_MAP[key as PermissionKeys];

            fieldList?.forEach((field) => {
              let array: GrantRole[] | undefined = undefined;
              if (field.action === 'grant') {
                array = toGrant;
              } else if (field.action === 'revoke') {
                array = toRevoke;
              }
              array?.push({
                account: field.account,
                role,
              });
            });

            return { toRevoke, toGrant };
          },
          { toRevoke: [], toGrant: [] },
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
