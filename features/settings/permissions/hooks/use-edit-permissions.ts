import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { getAddress } from 'viem';

import {
  type TransactionEntry,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';
import {
  useVault,
  vaultTexts,
  DisplayableError,
  GoToVault,
  VAULTS_ALL_ROLES_MAP,
} from 'modules/vaults';

import { usePermissionsFormData } from './use-permissions-form-data';
import type {
  EditPermissionsSchema,
  GrantRole,
  PermissionKeys,
} from '../types';

export const useEditPermissions = () => {
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

        const pdgContract = activeVault.predepositGuarantee;

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

        const isGuarantorChanged =
          getAddress(permissionsData.formValues.noGuarantor) !==
          getAddress(noGuarantor);
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

        if (isGuarantorChanged) {
          transactions.push({
            ...pdgContract.encode.setNodeOperatorGuarantor([noGuarantor]),
            loadingActionText: vaultTexts.actions.settings.noGuarantorLoading,
          });
        }

        if (
          getAddress(permissionsData.formValues.noDepositor) !==
          getAddress(noDepositor)
        ) {
          transactions.push({
            ...pdgContract.encode.setNodeOperatorDepositor([noDepositor]),
            loadingActionText: vaultTexts.actions.settings.noDepositorLoading,
          });
        }

        return withSuccess(
          sendTX({
            // re-check locked NO balance right before sending: a predeposit
            // could have happened after the form was loaded
            transactions: async () => {
              if (isGuarantorChanged) {
                const { locked } = await pdgContract.read.nodeOperatorBalance([
                  activeVault.nodeOperator,
                ]);
                if (locked > 0n) {
                  throw new DisplayableError(
                    vaultTexts.roles.guarantor.lockedError(locked),
                    false,
                  );
                }
              }

              return transactions;
            },
            mainActionLoadingText: 'Editing vault permissions',
            mainActionCompleteText: 'Vault permissions edited',
            renderSuccessContent: GoToVault,
          }),
        );
      },
      [activeVault, sendTX, permissionsData],
    ),
    ...rest,
  };
};
