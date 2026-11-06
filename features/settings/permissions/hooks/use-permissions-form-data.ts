import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';

import { useVault, VAULTS_ALL_ROLES_MAP } from 'modules/vaults';
import { useLidoSDK, useRefetchOnTxBlock } from 'modules/web3';
import { getBlockToReadAt } from 'utils/wait-for-rpc-block';

import { EDITABLE_ROLES_LIST } from '../consts';

import type {
  EditPermissionsSchema,
  FieldSchema,
  PermissionAccounts,
  PermissionsFormData,
} from '../types';

export type RolesAndDelegates = {
  rolesList: PermissionAccounts[];
  noGuarantor: Address;
  noDepositor: Address;
  blockNumber: bigint;
};

const collectRolesToFormValues = ({
  rolesList,
  ...rest
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
    rolesSchema,
    ...rest,
  };
};

export const usePermissionsFormData = () => {
  const { publicClient, getLatestTxBlock } = useLidoSDK();
  const { activeVault, queryKeys } = useVault();

  const query = useQuery({
    queryKey: [
      ...queryKeys.config('roles'),
      'getRoleMembers',
      { roles: EDITABLE_ROLES_LIST },
    ],
    enabled: !!activeVault,
    select: collectRolesToFormValues,
    queryFn: async ({ signal }) => {
      invariant(activeVault, 'Active vault is not defined');

      // wait for RPC to reach the latest tx block and read at it,
      // so data after partial success of legacy batch includes applied txs
      const blockNumber = await getBlockToReadAt(
        publicClient,
        getLatestTxBlock() ?? 0n,
        {
          signal,
        },
      );

      // TODO: can be changed to `VaultViewer.geRoleMembers`
      const result: readonly (readonly Address[])[] =
        await publicClient.multicall({
          allowFailure: false,
          blockNumber,
          contracts: EDITABLE_ROLES_LIST.map((role) =>
            activeVault.dashboard.prepare.getRoleMembers([
              VAULTS_ALL_ROLES_MAP[role],
            ]),
          ),
        });

      const pdgContract = activeVault.predepositGuarantee;
      const [noGuarantor, noDepositor] = await Promise.all([
        pdgContract.read.nodeOperatorGuarantor([activeVault.nodeOperator], {
          blockNumber,
        }),
        pdgContract.read.nodeOperatorDepositor([activeVault.nodeOperator], {
          blockNumber,
        }),
      ]);

      return {
        rolesList: result.map((item, index: number) => ({
          permissionName: EDITABLE_ROLES_LIST[index],
          addressList: [...item],
        })),
        noGuarantor,
        noDepositor,
        blockNumber,
      };
    },
  });

  useRefetchOnTxBlock(query);

  return query;
};
