import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { getAddress } from 'viem';

import {
  type TransactionEntry,
  useLidoSDK,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';
import {
  useVault,
  vaultTexts,
  GoToVault,
  VAULTS_ALL_ROLES_MAP,
  getPredepositGuaranteeContract,
} from 'modules/vaults';

import { usePermissionsFormData } from './use-permissions-form-data';
import type {
  EditPermissionsSchema,
  GrantRole,
  PermissionKeys,
} from '../types';

export const useEditPermissions = () => {
  const { publicClient } = useLidoSDK();
  const { activeVault } = useVault();
  const { sendTX, ...rest } = useSendTransaction();
  const { data: permissionsData } = usePermissionsFormData();

  return {
    editPermissions: useCallback(
      async (values: EditPermissionsSchema) => {
        invariant(
          activeVault,
          '[useEditPermissions] activeVault is not defined',
        );
        invariant(
          permissionsData,
          '[useEditPermissions] permissionsData is not defined',
        );

        const pdgContract = getPredepositGuaranteeContract(publicClient);

        const { rolesSchema, noGuarantor, noDepositor } = values;
        const { toGrant, toRevoke } = Object.entries(rolesSchema).reduce<{
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

        if (
          getAddress(permissionsData.noGuarantor) !== getAddress(noGuarantor)
        ) {
          transactions.push({
            ...pdgContract.encode.setNodeOperatorGuarantor([noGuarantor]),
            loadingActionText: vaultTexts.actions.settings.noGuarantorLoading,
          });
        }

        if (
          getAddress(permissionsData.noDepositor) !== getAddress(noDepositor)
        ) {
          transactions.push({
            ...pdgContract.encode.setNodeOperatorDepositor([noDepositor]),
            loadingActionText: vaultTexts.actions.settings.noDepositorLoading,
          });
        }

        return withSuccess(
          sendTX({
            transactions,
            mainActionLoadingText: 'Editing vault permissions',
            mainActionCompleteText: 'Vault permissions edited',
            renderSuccessContent: GoToVault,
          }),
        );
      },
      [activeVault, sendTX, permissionsData, publicClient],
    ),
    ...rest,
  };
};
