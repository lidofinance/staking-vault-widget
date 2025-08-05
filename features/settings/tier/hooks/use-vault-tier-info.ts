import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';

import type { LidoSDKShares } from '@lidofinance/lido-ethereum-sdk/shares';
import type { Address } from 'viem';

import { type RegisteredPublicClient, useLidoSDK } from 'modules/web3';
import {
  readWithReport,
  VAULT_TOTAL_BASIS_POINTS,
  VAULT_TOTAL_BASIS_POINTS_BN,
  type VaultBaseInfo,
  useVault,
  DEFAULT_TIER_ID,
} from 'modules/vaults';

import { formatBalance, formatPercent } from 'utils';

type VaultTierInfoArgs = {
  publicClient: RegisteredPublicClient;
  vault: VaultBaseInfo;
  shares: LidoSDKShares;
};

export type VaultTierInfo = {
  isVaultConnected: boolean;
  address: Address;
  owner: Address;
  nodeOperator: Address;
  totalValue: bigint;
  liabilityStETH: bigint;
  mintableStETH: bigint;
  stETHLimit: bigint;
  totalMintingCapacityStETH: bigint;
  forcedRebalanceThresholdBP: number;
  reserveRatioBP: number;
  reservationFeeBP: number;
  tierId: bigint;
  tierShareLimit: bigint;
  tierStETHLimit: bigint;
  tierReserveRatioBP: bigint;
  tierForcedRebalanceThresholdBP: bigint;
  tierInfraFeeBP: bigint;
  tierLiquidityFeeBP: bigint;
  tierReservationFeeBP: bigint;
};

export type VaultTierData = ReturnType<typeof selectTierData>;

const getVaultTierInfo = async ({
  publicClient,
  vault,
  shares,
}: VaultTierInfoArgs): Promise<VaultTierInfo> => {
  const {
    address,
    dashboard,
    vault: vaultContract,
    nodeOperator,
    withdrawalCredentials,
    forcedRebalanceThresholdBP,
    shareLimit,
    hub,
    operatorGrid,
    ...rest
  } = vault;

  const [
    record,
    isVaultConnected,
    totalValue,
    totalMintingCapacityShares,
    mintableShares,
    tier,
  ] = await readWithReport({
    publicClient,
    report: vault.report,
    contracts: [
      hub.prepare.vaultRecord([vault.address]),
      hub.prepare.isVaultConnected([vault.address]),
      dashboard.prepare.totalValue(),
      dashboard.prepare.totalMintingCapacityShares(),
      dashboard.prepare.remainingMintingCapacityShares([0n]),
      operatorGrid.prepare.vaultInfo([vault.address]),
    ] as const,
  });

  const { liabilityShares } = record;

  const [
    _,
    tierId,
    tierShareLimit,
    tierReserveRatioBP,
    tierForcedRebalanceThresholdBP,
    tierInfraFeeBP,
    tierLiquidityFeeBP,
    tierReservationFeeBP,
  ] = tier;

  const [
    liabilityStETH,
    mintableStETH,
    stETHLimit,
    totalMintingCapacityStETH,
    tierStETHLimit,
  ] = await Promise.all([
    shares.convertToSteth(liabilityShares),
    shares.convertToSteth(mintableShares),
    shares.convertToSteth(shareLimit),
    shares.convertToSteth(totalMintingCapacityShares),
    shares.convertToSteth(tierShareLimit),
  ]);

  return {
    isVaultConnected,
    address,
    nodeOperator,
    totalValue,
    liabilityStETH,
    mintableStETH,
    stETHLimit,
    totalMintingCapacityStETH,
    forcedRebalanceThresholdBP,
    tierId,
    tierShareLimit,
    tierStETHLimit,
    tierReserveRatioBP,
    tierForcedRebalanceThresholdBP,
    tierInfraFeeBP,
    tierLiquidityFeeBP,
    tierReservationFeeBP,
    ...rest,
  };
};

const toEthValue = (value: bigint | undefined) =>
  typeof value === 'bigint' ? `${formatBalance(value).trimmed} ETH` : '';
const toStethValue = (value: bigint | undefined) =>
  typeof value === 'bigint' ? `${formatBalance(value).trimmed} stETH` : '';

const selectTierData = (tierData: VaultTierInfo) => {
  const {
    totalValue,
    reserveRatioBP,
    liabilityStETH,
    mintableStETH,
    forcedRebalanceThresholdBP,
    tierId,
    tierStETHLimit,
    tierInfraFeeBP,
    tierLiquidityFeeBP,
  } = tierData;

  const tierName =
    tierId === DEFAULT_TIER_ID ? 'Default' : `Tier ${Number(tierId)}`;
  const tierLimitAmountStETH = toStethValue(tierStETHLimit);
  const remainingMintingCapacityAmountStETH = toStethValue(mintableStETH);
  const totalValueETH = toEthValue(totalValue);
  const liabilityAmountStETH = toStethValue(liabilityStETH);
  const reserveRatio = formatPercent.format(
    reserveRatioBP / VAULT_TOTAL_BASIS_POINTS,
  );
  const rebalanceThreshold = formatPercent.format(
    forcedRebalanceThresholdBP / VAULT_TOTAL_BASIS_POINTS,
  );

  const lidoInfraFee = formatPercent.format(
    Number(tierInfraFeeBP) / VAULT_TOTAL_BASIS_POINTS,
  );
  const lidoLiquidityFee = formatPercent.format(
    Number(tierLiquidityFeeBP) / VAULT_TOTAL_BASIS_POINTS,
  );

  const utilizationRatio =
    tierData.totalMintingCapacityStETH === 0n
      ? 0
      : Number(
          ((tierData.liabilityStETH * VAULT_TOTAL_BASIS_POINTS_BN) /
            tierData.totalMintingCapacityStETH) *
            100n,
        ) / VAULT_TOTAL_BASIS_POINTS;

  const totalMintingCapacityAmountStETH = toStethValue(
    tierData.totalMintingCapacityStETH,
  );

  return {
    tierName,
    totalValueETH,
    reserveRatio,
    utilizationRatio,
    lidoInfraFee,
    lidoLiquidityFee,
    rebalanceThreshold,
    liabilityAmountStETH,
    totalMintingCapacityAmountStETH,
    remainingMintingCapacityAmountStETH,
    tierLimitAmountStETH,
    ...tierData,
  };
};

export const useVaultTierInfo = () => {
  const { shares, publicClient } = useLidoSDK();
  const { activeVault, queryKeys } = useVault();

  return useQuery({
    queryKey: [...queryKeys.state, 'vault-tier-info'],
    enabled: !!activeVault,
    queryFn: async () => {
      invariant(activeVault, '[useVaultTierInfo] activeVault is not defined');
      return await getVaultTierInfo({
        publicClient,
        shares,
        vault: activeVault,
      });
    },
    select: selectTierData,
  });
};
