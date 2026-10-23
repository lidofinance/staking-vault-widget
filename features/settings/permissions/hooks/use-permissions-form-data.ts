import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';

import { useVault, VAULTS_ALL_ROLES_MAP } from 'modules/vaults';
import { useLidoSDK } from 'modules/web3';

import { EDITABLE_ROLES_LIST } from '../consts';

import type {
  EditPermissionsSchema,
  FieldSchema,
  PermissionAccounts,
} from '../types';

export type RolesAndDelegates = {
  rolesList: PermissionAccounts[];
  noGuarantor: Address;
  noDepositor: Address;
  noBalanceLocked: bigint;
};

export type PermissionsFormData = {
  formValues: EditPermissionsSchema;
  // NO balance locked in PDG for predeposits, blocks guarantor change
  noBalanceLocked: bigint;
};

const collectPermissionsFormData = ({
  rolesList,
  noGuarantor,
  noDepositor,
  noBalanceLocked,
}: RolesAndDelegates): PermissionsFormData => {
  const rolesSchema = rolesList.reduce(
    (acc, role) => {
      const { addressList, permissionName } = role;
      acc[permissionName] = addressList.map(
        (address) =>
          ({
            account: address,
            action: 'display',
          }) as FieldSchema,
      );

      return acc;
    },
    {} as EditPermissionsSchema['rolesSchema'],
  );

  return {
    formValues: {
      rolesSchema,
      noGuarantor,
      noDepositor,
    },
    noBalanceLocked,
  };
};

export const usePermissionsFormData = () => {
  const { publicClient } = useLidoSDK();
  const { activeVault, queryKeys } = useVault();

  return useQuery({
    queryKey: [
      ...queryKeys.config('roles'),
      'getRoleMembers',
      { roles: EDITABLE_ROLES_LIST },
    ],
    enabled: !!activeVault,
    select: collectPermissionsFormData,
    queryFn: async (): Promise<RolesAndDelegates> => {
      invariant(activeVault, 'Active vault is not defined');

      // TODO: can be changed to `VaultViewer.geRoleMembers`
      const result: readonly (readonly Address[])[] =
        await publicClient.multicall({
          allowFailure: false,
          contracts: EDITABLE_ROLES_LIST.map((role) =>
            activeVault.dashboard.prepare.getRoleMembers([
              VAULTS_ALL_ROLES_MAP[role],
            ]),
          ),
        });

      const pdgContract = activeVault.predepositGuarantee;
      const [noGuarantor, noDepositor, noBalance] = await Promise.all([
        pdgContract.read.nodeOperatorGuarantor([activeVault.nodeOperator]),
        pdgContract.read.nodeOperatorDepositor([activeVault.nodeOperator]),
        pdgContract.read.nodeOperatorBalance([activeVault.nodeOperator]),
      ]);

      return {
        rolesList: result.map((item, index: number) => ({
          permissionName: EDITABLE_ROLES_LIST[index],
          addressList: [...item],
        })),
        noGuarantor,
        noDepositor,
        noBalanceLocked: noBalance.locked,
      };
    },
  });
};
