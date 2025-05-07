import { usePublicClient } from 'wagmi';
import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';

import { useLidoSDK } from 'modules/web3';

import { getStakingVaultContract } from 'modules/vaults/contracts/staking-vault';
import { getDashboardContract } from 'modules/vaults/contracts/dashboard';
import { STRATEGY_LAZY } from 'consts/react-query-strategies';
import { calculateHealth } from '@lidofinance/lsv-cli/dist/utils/health/calculate-health';

import type { PublicClient, Address } from 'viem';
import type { LidoSDKShares } from '@lidofinance/lido-ethereum-sdk/shares';

type VaultDataArgs = {
  publicClient: PublicClient;
  vaultAddress: Address;
  shares: LidoSDKShares;
};

export interface VaultTableInfo {
  address: Address;
  owner: Address;
  totalValue: bigint;
  liabilityStETH: bigint;
  healthScore: number;
  forcedRebalanceThresholdBP: number;
  liabilityShares: bigint;
}

const getVaultDataTable = async ({
  publicClient,
  vaultAddress,
  shares,
}: VaultDataArgs): Promise<VaultTableInfo> => {
  const vaultContract = getStakingVaultContract(vaultAddress, publicClient);
  const owner = await vaultContract.read.owner();
  const dashboardContract = getDashboardContract(owner, publicClient);

  const [totalValue, liabilityShares, forcedRebalanceThresholdBP] =
    await Promise.all([
      dashboardContract.read.totalValue(),
      dashboardContract.read.liabilityShares(),
      dashboardContract.read.forcedRebalanceThresholdBP(),
    ]);

  const liabilityStETH = await shares.convertToSteth(liabilityShares);

  const healthScore = calculateHealth({
    totalValue,
    liabilitySharesInStethWei: liabilityStETH,
    forceRebalanceThresholdBP: forcedRebalanceThresholdBP,
  });

  return {
    address: vaultAddress,
    owner,
    totalValue,
    liabilityStETH,
    healthScore:
      healthScore.healthRatio > 100000 ? Infinity : healthScore.healthRatio,
    forcedRebalanceThresholdBP,
    liabilityShares,
  };
};

export const useVaultDataTable = (
  vaultsAddressesList: readonly Address[] | undefined,
) => {
  const { shares } = useLidoSDK();
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ['vault-data-table', { data: vaultsAddressesList }],
    enabled: !!vaultsAddressesList?.length && !!publicClient,
    ...STRATEGY_LAZY,
    queryFn: async (): Promise<VaultTableInfo[]> => {
      invariant(publicClient, 'PublicClient is not ready');

      const vaults: VaultTableInfo[] = [];

      if (vaultsAddressesList?.length && vaultsAddressesList.length === 0) {
        return vaults;
      }

      invariant(vaultsAddressesList, 'Vaults addresses list is empty');
      for (const vaultAddress of vaultsAddressesList) {
        vaults.push(
          await getVaultDataTable({
            publicClient,
            vaultAddress,
            shares,
          }),
        );
      }

      return vaults;
    },
  });
};
