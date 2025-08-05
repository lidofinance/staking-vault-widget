import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';
import type { LidoSDKShares } from '@lidofinance/lido-ethereum-sdk/shares';
import type { Address } from 'viem';

import { useLidoSDK } from 'modules/web3';

import { type VaultBaseInfo, useVault, DEFAULT_TIER_ID } from 'modules/vaults';

type NodeOperatorTierInfoArgs = {
  vault: VaultBaseInfo;
  shares: LidoSDKShares;
};

export type NodeOperatorTiersInfo = {
  operator: Address;
  shareLimit: bigint;
  stEthLimit: bigint;
  liabilityShares: bigint;
  liabilityStETH: bigint;
  nodeOperator: Address;
  tiers: Tier[];
};

export type Tier = {
  id: bigint;
  tierName: string;
  shareLimitStETH: bigint;
  liabilityStETH: bigint;
  operator: Address;
  shareLimit: bigint;
  liabilityShares: bigint;
  reserveRatioBP: number;
  forcedRebalanceThresholdBP: number;
  infraFeeBP: number;
  liquidityFeeBP: number;
  reservationFeeBP: number;
};

export type NodeOperatorTiersData = ReturnType<
  typeof selectNodeOperatorTiersData
>;

const fetchTiersForOperator = async ({
  vault,
  shares,
}: NodeOperatorTierInfoArgs): Promise<NodeOperatorTiersInfo> => {
  const { nodeOperator, operatorGrid } = vault;

  const { tierIds, shareLimit, liabilityShares, ...rest } =
    await operatorGrid.read.group([nodeOperator]);
  const writableTierIds: bigint[] = [...tierIds];
  if (writableTierIds.length === 0) {
    writableTierIds.push(0n);
  }

  const tiers = await Promise.all(
    writableTierIds.map((tierId) => operatorGrid.read.tier([tierId])),
  );
  const [stEthLimit, liabilityStETH] = await Promise.all([
    shares.convertToSteth(shareLimit),
    shares.convertToSteth(liabilityShares),
  ]);

  const tiersWithStETH = await Promise.all(
    tiers.map(async (tier, index) => {
      const [shareLimitStETH, liabilityStETH] = await Promise.all([
        shares.convertToSteth(tier.shareLimit),
        shares.convertToSteth(tier.liabilityShares),
      ]);

      const id = writableTierIds[index];
      const tierName =
        id === DEFAULT_TIER_ID ? 'Default' : `Tier ${Number(id)}`;
      return { ...tier, id, tierName, shareLimitStETH, liabilityStETH };
    }),
  );

  return {
    tiers: tiersWithStETH,
    ...rest,
    nodeOperator,
    stEthLimit,
    liabilityStETH,
    shareLimit,
    liabilityShares,
  };
};

// TODO: pretty tier mint params
const selectNodeOperatorTiersData = (tierData: NodeOperatorTiersInfo) => {
  return tierData;
};

export const useNodeOperatorTiersInfo = () => {
  const { activeVault, queryKeys } = useVault();
  const { shares } = useLidoSDK();

  return useQuery({
    queryKey: [...queryKeys.base, 'node-operator-tier-info'],
    enabled: !!activeVault,
    queryFn: async () => {
      invariant(activeVault, '[useVaultTierInfo] activeVault is not defined');
      return await fetchTiersForOperator({ vault: activeVault, shares });
    },
    select: selectNodeOperatorTiersData,
  });
};
