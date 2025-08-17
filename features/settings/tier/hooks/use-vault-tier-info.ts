import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';

import { useLidoSDK } from 'modules/web3';
import {
  readWithReport,
  VAULT_TOTAL_BASIS_POINTS,
  VAULT_TOTAL_BASIS_POINTS_BN,
  useVault,
  DEFAULT_TIER_ID,
} from 'modules/vaults';
import { formatPercent, toEthValue, toStethValue } from 'utils';

import { VaultTierInfoArgs, VaultTierInfo } from './types';
import { getConfirmationsInfo } from 'utils/get-confirmations';

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
    vaultTotalMintingCapacityShares,
    vaultMintableShares,
    vaultInfo,
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

  const [
    _nodeOperator,
    tierId,
    vaultShareLimit,
    vaultReserveRatioBP,
    vaultForcedRebalanceThresholdBP,
    vaultInfraFeeBP,
    vaultLiquidityFeeBP,
    vaultReservationFeeBP,
  ] = vaultInfo;
  const { liabilityShares: vaultLiabilityShares } = record;

  const [tier] = await readWithReport({
    publicClient,
    report: vault.report,
    contracts: [operatorGrid.prepare.tier([tierId])],
  });
  const {
    operator: tierOperator,
    shareLimit: tierShareLimit,
    liabilityShares: tierLiabilityShares,
    reserveRatioBP: tierReserveRatioBP,
    forcedRebalanceThresholdBP: tierForcedRebalanceThresholdBP,
    infraFeeBP: tierInfraFeeBP,
    liquidityFeeBP: tierLiquidityFeeBP,
    reservationFeeBP: tierReservationFeeBP,
  } = tier;

  const tierName =
    tierId === DEFAULT_TIER_ID ? 'Default' : `Tier ${Number(tierId)}`;

  const { confirmations, confirmExpiry } = await getConfirmationsInfo(
    operatorGrid as any,
    publicClient,
    operatorGrid.abi,
  );
  const lastProposal = confirmations[confirmations.length - 1];
  const proposedVaultLimit = lastProposal?.decodedData.args[2] ?? 0n;

  const [
    vaultLiabilityStETH,
    vaultMintableStETH,
    vaultStETHLimit,
    vaultTotalMintingCapacityStETH,
    tierStETHLimit,
    tierLiabilityStETH,
    proposedVaultLimitStETH,
  ] = await Promise.all([
    shares.convertToSteth(vaultLiabilityShares),
    shares.convertToSteth(vaultMintableShares),
    shares.convertToSteth(vaultShareLimit),
    shares.convertToSteth(vaultTotalMintingCapacityShares),
    shares.convertToSteth(tierShareLimit),
    shares.convertToSteth(tierLiabilityShares),
    shares.convertToSteth(proposedVaultLimit),
  ]);

  return {
    isVaultConnected,
    address,
    nodeOperator,
    proposals: {
      confirmExpiry,
      lastProposal,
      proposedVaultLimitStETH,
      proposedVaultLimit,
    },
    vault: {
      tierId,
      totalValue,
      liabilityStETH: vaultLiabilityStETH,
      mintableStETH: vaultMintableStETH,
      stETHLimit: vaultStETHLimit,
      totalMintingCapacityStETH: vaultTotalMintingCapacityStETH,
      reserveRatioBP: Number(vaultReserveRatioBP),
      forcedRebalanceThresholdBP: Number(vaultForcedRebalanceThresholdBP),
      infraFeeBP: Number(vaultInfraFeeBP),
      liquidityFeeBP: Number(vaultLiquidityFeeBP),
      reservationFeeBP: Number(vaultReservationFeeBP),
      shareLimit: vaultShareLimit,
    },
    tier: {
      id: tierId,
      tierName,
      operator: tierOperator,
      shareLimit: tierShareLimit,
      shareLimitStETH: tierStETHLimit,
      liabilityShares: tierLiabilityShares,
      liabilityStETH: tierLiabilityStETH,
      reserveRatioBP: tierReserveRatioBP,
      forcedRebalanceThresholdBP: tierForcedRebalanceThresholdBP,
      infraFeeBP: tierInfraFeeBP,
      liquidityFeeBP: tierLiquidityFeeBP,
      reservationFeeBP: tierReservationFeeBP,
    },
    ...rest,
  };
};

const selectTierData = (tierData: VaultTierInfo) => {
  const { vault, tier } = tierData;

  const tierName =
    tier.id === DEFAULT_TIER_ID ? 'Default' : `Tier ${Number(tier.id)}`;
  const tierStETHLimitValue = toStethValue(tier.shareLimitStETH);
  const tierTotalMintingCapacityStETHValue = toStethValue(
    tier.shareLimitStETH - tier.liabilityStETH,
  );
  const tierLiabilityStETHValue = toStethValue(tier.liabilityStETH);
  const tierReserveRatioValue = formatPercent.format(
    tier.reserveRatioBP / VAULT_TOTAL_BASIS_POINTS,
  );

  const vaultStETHLimitValue = toStethValue(vault.stETHLimit);
  const vaultTotalValueETHValue = toEthValue(vault.totalValue);
  const vaultLiabilityStETHValue = toStethValue(vault.liabilityStETH);
  const vaultReserveRatioValue = formatPercent.format(
    vault.reserveRatioBP / VAULT_TOTAL_BASIS_POINTS,
  );
  const vaultRebalanceThresholdValue = formatPercent.format(
    vault.forcedRebalanceThresholdBP / VAULT_TOTAL_BASIS_POINTS,
  );
  const vaultLidoInfraFeeValue = formatPercent.format(
    Number(vault.infraFeeBP) / VAULT_TOTAL_BASIS_POINTS,
  );
  const vaultLidoLiquidityFeeValue = formatPercent.format(
    Number(vault.liquidityFeeBP) / VAULT_TOTAL_BASIS_POINTS,
  );
  const vaultUtilizationRatioValue = formatPercent.format(
    vault.totalMintingCapacityStETH === 0n
      ? 0
      : Number(
          (vault.liabilityStETH * VAULT_TOTAL_BASIS_POINTS_BN) /
            vault.totalMintingCapacityStETH,
        ) / VAULT_TOTAL_BASIS_POINTS,
  );
  const vaultTotalMintingCapacityStETHValue = toStethValue(
    vault.totalMintingCapacityStETH,
  );

  return {
    ...tierData,
    vaultTotalValueETHValue,
    vaultReserveRatioValue,
    vaultUtilizationRatioValue,
    vaultLidoInfraFeeValue,
    vaultLidoLiquidityFeeValue,
    vaultRebalanceThresholdValue,
    vaultLiabilityStETHValue,
    vaultTotalMintingCapacityStETHValue,
    vaultStETHLimitValue,

    tierName,
    tierStETHLimitValue,
    tierTotalMintingCapacityStETHValue,
    tierLiabilityStETHValue,
    tierReserveRatioValue,
    tierStETHLimit: tier.shareLimitStETH,
    tierLiabilityStETH: tier.liabilityStETH,
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
