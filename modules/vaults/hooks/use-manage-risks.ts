import { keepPreviousData, useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { isAddressEqual, zeroAddress } from 'viem';

import { useVault } from '../vault-context';
import { useDappStatus } from '../../web3';
import { VAULTS_OWNER_ROLES_MAP, VAULTS_ROOT_ROLES_MAP } from '../consts';

export const useMitigateRisks = () => {
  const { activeVault, queryKeys } = useVault();
  const { address } = useDappStatus();

  // owners
  // NO
  // supplier
  // verified NO
  // tier level
  const { data, ...rest } = useQuery({
    queryKey: [
      ...queryKeys.base,
      'vault-mitigate-risks',
      activeVault?.address,
    ] as const,
    enabled: !!activeVault && !!address,
    refetchOnMount: true,
    staleTime: 1000 * 60, // 1min
    placeholderData: keepPreviousData,
    queryFn: async () => {
      invariant(activeVault, '[useMitigateRisks] activeVault is not defined');

      const { dashboard, group, operatorGrid, nodeOperator } = activeVault;
      const { operator, shareLimit, tierIds } = group;

      // check if Node Operator has passed verification process
      const isSameAddress =
        isAddressEqual(operator, nodeOperator) && nodeOperator !== zeroAddress;
      const isGroupLimitAvailable = shareLimit > 0n;

      const [defaultAdminList, suppliers, tier, ...tiersList] =
        await Promise.all([
          dashboard.read.getRoleMembers([VAULTS_ROOT_ROLES_MAP.defaultAdmin]),
          dashboard.read.getRoleMembers([VAULTS_OWNER_ROLES_MAP.supplier]),
          operatorGrid.read.vaultTierInfo([activeVault.address]),
          ...tierIds.map((tierId) => operatorGrid.read.tier([tierId])),
        ]);

      const isTierLimitAvailable = tiersList.some(
        (tier) => tier.shareLimit > 0n,
      );

      const [_, tierId] = tier;

      const isNodeOperatorVerified =
        isSameAddress && isGroupLimitAvailable && isTierLimitAvailable;
      const isMultipleOwners = defaultAdminList.length > 1;
      const isTierDefault = tierId === 0n;
      const isVaultOwner = !!address && defaultAdminList.includes(address);
      const isSupplier = !!address && suppliers.includes(address);

      return {
        isNodeOperatorVerified,
        isMultipleOwners,
        isTierDefault,
        defaultAdminList,
        isVaultOwner,
        isSupplier,
      };
    },
  });

  return {
    ...rest,
    isNodeOperatorVerified: data?.isNodeOperatorVerified,
    isMultipleOwners: data?.isMultipleOwners,
    isTierDefault: data?.isTierDefault,
    isVaultOwner: data?.isVaultOwner,
    isSupplier: data?.isSupplier,
    defaultAdminList: data?.defaultAdminList,
  };
};
