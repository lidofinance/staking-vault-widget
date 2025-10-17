import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';
import { Abi, Address, getAddress } from 'viem';

import { type RegisteredPublicClient, useLidoSDK } from 'modules/web3';
import {
  readWithReport,
  VAULT_TOTAL_BASIS_POINTS,
  VAULT_TOTAL_BASIS_POINTS_BN,
  useVault,
  DEFAULT_TIER_ID,
  getLidoV3Contract,
} from 'modules/vaults';
import { formatPercent, toEthValue, toStethValue } from 'utils';
import { Confirmation, getConfirmationsInfo } from 'utils/get-confirmations';

import { VaultTierInfoArgs, VaultTierInfo } from '../types';

export type VaultTierData = ReturnType<typeof selectTierData>;

const getVaultTierConfirmation = async (
  address: Address,
  publicClient: RegisteredPublicClient,
  abi: Abi,
  vaultAddress: Address,
): Promise<{
  confirmExpiry: bigint;
  proposedVaultLimit: bigint;
  lastProposal: Confirmation | undefined;
}> => {
  const { confirmations, confirmExpiry } = await getConfirmationsInfo(
    address,
    publicClient,
    abi,
  );

  const lastProposal = confirmations.findLast(
    ({ decodedData }) =>
      getAddress(decodedData.args[0] as Address) === getAddress(vaultAddress),
  );
  const proposedVaultLimit = lastProposal?.decodedData.args[2] ?? 0n;

  return {
    confirmExpiry,
    proposedVaultLimit,
    lastProposal,
  };
};

const getVaultTierInfo = async ({
  publicClient,
  vault,
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

  const lidoV3Contract = getLidoV3Contract(publicClient);

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
      operatorGrid.prepare.vaultTierInfo([vault.address]),
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

  const { confirmExpiry, lastProposal, proposedVaultLimit } =
    await getVaultTierConfirmation(
      operatorGrid.address,
      publicClient,
      operatorGrid.abi,
      vault.address,
    );

  const [
    vaultLiabilityStETH,
    vaultMintableStETH,
    vaultStETHLimit,
    vaultTotalMintingCapacityStETH,
    tierStETHLimit,
    tierLiabilityStETH,
    proposedVaultLimitStETH,
    lidoTVLSharesLimit,
  ] = await Promise.all([
    lidoV3Contract.read.getPooledEthBySharesRoundUp([vaultLiabilityShares]),
    lidoV3Contract.read.getPooledEthBySharesRoundUp([vaultMintableShares]),
    lidoV3Contract.read.getPooledEthBySharesRoundUp([vaultShareLimit]),
    lidoV3Contract.read.getPooledEthBySharesRoundUp([
      vaultTotalMintingCapacityShares,
    ]),
    lidoV3Contract.read.getPooledEthBySharesRoundUp([tierShareLimit]),
    lidoV3Contract.read.getPooledEthBySharesRoundUp([tierLiabilityShares]),
    lidoV3Contract.read.getPooledEthBySharesRoundUp([proposedVaultLimit]),
    lidoV3Contract.read.getMaxMintableExternalShares(),
  ]);

  return {
    lidoTVLSharesLimit,
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
      totalMintingCapacityShares: vaultTotalMintingCapacityShares,
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

    tierName,
    tierStETHLimitValue,
    tierStETHLimit: tier.shareLimitStETH,
    tierLiabilityStETH: tier.liabilityStETH,
  };
};

export const useVaultTierInfo = () => {
  const { publicClient } = useLidoSDK();
  const { activeVault, queryKeys } = useVault();

  return useQuery({
    queryKey: [...queryKeys.state, 'vault-tier-info'],
    enabled: !!activeVault,
    queryFn: async () => {
      invariant(activeVault, '[useVaultTierInfo] activeVault is not defined');
      return await getVaultTierInfo({
        publicClient,
        vault: activeVault,
      });
    },
    select: selectTierData,
  });
};
