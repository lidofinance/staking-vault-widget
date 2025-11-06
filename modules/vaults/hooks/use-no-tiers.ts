import invariant from 'tiny-invariant';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { useLidoSDK } from 'modules/web3';

import {
  useVault,
  getStEthContract,
  DEFAULT_TIER_ID,
  NodeOperatorTierInfoArgs,
  NodeOperatorTiersInfo,
} from 'modules/vaults';

export type NodeOperatorTiersData = ReturnType<
  typeof selectNodeOperatorTiersData
>;

const fetchTiersForOperator = async ({
  vault,
  publicClient,
}: NodeOperatorTierInfoArgs): Promise<NodeOperatorTiersInfo> => {
  const { nodeOperator, operatorGrid } = vault;
  const stethContract = getStEthContract(publicClient);

  const [group, vaultInfo] = await Promise.all([
    operatorGrid.read.group([nodeOperator]),
    operatorGrid.read.vaultTierInfo([vault.address]),
  ]);

  const { tierIds, shareLimit, liabilityShares, ...rest } = group;
  const [_, vaultTierId] = vaultInfo;

  const writableTierIds: bigint[] = [...tierIds];

  if (vaultTierId === 0n) {
    writableTierIds.unshift(0n);
  }

  const tiers = await Promise.all(
    writableTierIds.map((tierId) => operatorGrid.read.tier([tierId])),
  );

  const [stEthLimit, liabilityStETH] = await Promise.all([
    stethContract.read.getPooledEthByShares([shareLimit]),
    stethContract.read.getPooledEthBySharesRoundUp([liabilityShares]),
  ]);

  const tiersWithStETH = await Promise.all(
    tiers.map(async (tier, index) => {
      const [shareLimitStETH, liabilityStETH] = await Promise.all([
        stethContract.read.getPooledEthByShares([tier.shareLimit]),
        stethContract.read.getPooledEthBySharesRoundUp([tier.liabilityShares]),
      ]);

      const id = writableTierIds[index];
      const tierName =
        id === DEFAULT_TIER_ID ? 'Default' : `Tier ${Number(id)}`;
      return { ...tier, id, tierName, shareLimitStETH, liabilityStETH };
    }),
  );

  return {
    tiers: tiersWithStETH,
    group: {
      nodeOperator,
      shareLimit,
      stEthLimit,
      liabilityShares,
      liabilityStETH,
    },
    ...rest,
  };
};

// TODO: pretty tier mint params
const selectNodeOperatorTiersData = (tierData: NodeOperatorTiersInfo) => {
  return tierData;
};

export const useNodeOperatorTiersInfo = (): UseQueryResult<
  NodeOperatorTiersData,
  Error
> => {
  const { activeVault, queryKeys } = useVault();
  const { publicClient } = useLidoSDK();

  return useQuery({
    queryKey: [...queryKeys.base, 'node-operator-tier-info'],
    enabled: !!activeVault,
    queryFn: async () => {
      invariant(
        activeVault,
        '[useNodeOperatorTiersInfo] activeVault is not defined',
      );
      return await fetchTiersForOperator({ vault: activeVault, publicClient });
    },
    select: selectNodeOperatorTiersData,
  });
};
