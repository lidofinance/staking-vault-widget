import type { Address } from 'viem';
import { useReadContracts } from 'wagmi';

import { useVaultInfo } from 'modules/vaults';

import { EDITABLE_ROLES_LIST, EDITABLE_ROLES_MAP } from '../consts';

export const useVaultPermissionsRoles = () => {
  const { activeVault } = useVaultInfo();

  return useReadContracts({
    contracts: activeVault
      ? EDITABLE_ROLES_LIST.map((key) =>
          activeVault.dashboard.prepare.getRoleMembers([
            EDITABLE_ROLES_MAP[key],
          ]),
        )
      : undefined,
    allowFailure: false,
    query: {
      enabled: !!activeVault,
      select: (data) =>
        data.map((item, index) => {
          return {
            permissionName: EDITABLE_ROLES_LIST[index],
            addressList: [...item] as Address[],
          };
        }),
    },
  });
};
