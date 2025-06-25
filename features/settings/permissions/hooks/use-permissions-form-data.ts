import invariant from 'tiny-invariant';
import type { Address } from 'viem';
import { useQuery } from '@tanstack/react-query';

import { useVault, VAULTS_ALL_ROLES_MAP } from 'modules/vaults';

import { EDITABLE_ROLES_LIST } from '../consts';
import { collectRolesToFormValues } from '../utils';
import { useLidoSDK } from 'modules/web3';

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

      const result = await publicClient.multicall({
        allowFailure: false,
        contracts: EDITABLE_ROLES_LIST.map((role) =>
          activeVault.dashboard.prepare.getRoleMembers([
            VAULTS_ALL_ROLES_MAP[role],
          ]),
        ),
      });

      return result.map((item, index) => {
        return {
          permissionName: EDITABLE_ROLES_LIST[index],
          addressList: [...item] as Address[],
        };
      });
    },
  });
};
