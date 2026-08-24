import { useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { isAddressEqual, zeroAddress } from 'viem';

import { useVault } from '../vault-context';
import { useDappStatus } from '../../web3';
import {
  PDG_POLICY,
  VaultDisconnectedError,
  VAULTS_OWNER_ROLES_MAP,
  VAULTS_ROOT_ROLES_MAP,
} from '../consts';

export const useVaultRiskStatus = () => {
  const { activeVault, queryKeys } = useVault();
  const { address } = useDappStatus();

  const { data, ...rest } = useQuery({
    queryKey: [
      ...queryKeys.config(),
      'vault-risk-status',
      { address },
    ] as const,
    enabled: !!(activeVault && address),
    refetchOnMount: true,
    staleTime: 1000 * 60, // 1min
    queryFn: async () => {
      invariant(activeVault, '[useVaultRiskStatus] activeVault is not defined');

      if (activeVault.isVaultDisconnected) {
        throw new VaultDisconnectedError();
      }

      const { dashboard, group, operatorGrid, nodeOperator } = activeVault;
      const { operator, shareLimit, tierIds } = group;

      // check if Node Operator has passed verification process
      const isSameAddress =
        isAddressEqual(operator, nodeOperator) && nodeOperator !== zeroAddress;
      const isGroupLimitAvailable = shareLimit > 0n;

      const [
        defaultAdminList,
        suppliers,
        repayers,
        rebalancer,
        withdrawers,
        pdgPolicy,
        tier,
        ...tiersList
      ] = await Promise.all([
        dashboard.read.getRoleMembers([VAULTS_ROOT_ROLES_MAP.defaultAdmin]),
        dashboard.read.getRoleMembers([VAULTS_OWNER_ROLES_MAP.supplier]),
        dashboard.read.getRoleMembers([VAULTS_OWNER_ROLES_MAP.repayer]),
        dashboard.read.getRoleMembers([VAULTS_OWNER_ROLES_MAP.rebalancer]),
        dashboard.read.getRoleMembers([VAULTS_OWNER_ROLES_MAP.withdrawer]),
        dashboard.read.pdgPolicy(),
        operatorGrid.read.vaultTierInfo([activeVault.address]),
        ...tierIds.map((tierId) => operatorGrid.read.tier([tierId])),
      ]);

      const isTierLimitAvailable = tiersList.some(
        (tier) => tier.shareLimit > 0n,
      );

      const [_, tierId] = tier;
      const firstAdmin = defaultAdminList.at(0);

      /*
       * Node operator (NO) verified if:
       * NO has group
       * NO's group has limit > 0
       * NO's group has one tier with limit > 0
       * */
      const isNodeOperatorVerified =
        isSameAddress && isGroupLimitAvailable && isTierLimitAvailable;
      const isMultipleOwners = defaultAdminList.length > 1;
      const isTierDefault = tierId === 0n;
      const hasTiers = tiersList.length > 0;
      const isVaultOwner = !!address && defaultAdminList.includes(address);
      const isSupplier = !!address && suppliers.includes(address);
      const isRepayer = !!address && repayers.includes(address);
      const isRebalancer = !!address && rebalancer.includes(address);
      const isUnguaranteedDepositsAllowed =
        String(pdgPolicy) === PDG_POLICY.ALLOW_DEPOSIT_AND_PROVE;

      return {
        isUnguaranteedDepositsAllowed,
        isNodeOperatorVerified,
        isMultipleOwners,
        hasTiers,
        isTierDefault,
        isVaultOwner,
        isSupplier,
        isRepayer,
        isRebalancer,
        defaultAdminList: [...defaultAdminList],
        withdrawersList: [...withdrawers],
        nodeOperator,
        firstAdmin,
      };
    },
  });

  return {
    ...rest,
    isUnguaranteedDepositsAllowed: data?.isUnguaranteedDepositsAllowed,
    isNodeOperatorVerified: data?.isNodeOperatorVerified,
    isMultipleOwners: data?.isMultipleOwners,
    hasTiers: data?.hasTiers,
    isTierDefault: data?.isTierDefault,
    isVaultOwner: data?.isVaultOwner,
    isSupplier: data?.isSupplier,
    isRepayer: data?.isRepayer,
    isRebalancer: data?.isRebalancer,
    defaultAdminList: data?.defaultAdminList,
    withdrawersList: data?.withdrawersList,
    nodeOperator: data?.nodeOperator,
    firstAdmin: data?.firstAdmin,
  };
};
