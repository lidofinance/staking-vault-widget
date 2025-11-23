import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';
import { Address } from 'viem';

import {
  getPredepositGuaranteeContract,
  useVault,
  VAULTS_ALL_ROLES_MAP,
} from 'modules/vaults';
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
};

const collectRolesToFormValues = ({
  rolesList,
  ...rest
}: RolesAndDelegates): EditPermissionsSchema => {
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
    rolesSchema,
    ...rest,
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
    select: collectRolesToFormValues,
    queryFn: async () => {
      invariant(activeVault, 'Active vault is not defined');

      // TODO: can be changed to `VaultViewer.geRoleMembers`
      const result = await publicClient.multicall({
        allowFailure: false,
        contracts: EDITABLE_ROLES_LIST.map((role) =>
          activeVault.dashboard.prepare.getRoleMembers([
            VAULTS_ALL_ROLES_MAP[role],
          ]),
        ),
      });

      const pdgContract = getPredepositGuaranteeContract(publicClient);
      const [noGuarantor, noDepositor] = await Promise.all([
        pdgContract.read.nodeOperatorGuarantor([activeVault.nodeOperator]),
        pdgContract.read.nodeOperatorDepositor([activeVault.nodeOperator]),
      ]);

      return {
        rolesList: result.map((item, index) => ({
          permissionName: EDITABLE_ROLES_LIST[index],
          addressList: [...item],
        })),
        noGuarantor,
        noDepositor,
      };
    },
  });
};
