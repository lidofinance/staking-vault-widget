import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';
import { isAddressEqual, type Abi, type Address } from 'viem';

import { type RegisteredPublicClient, useLidoSDK } from 'modules/web3';
import {
  readWithReport,
  VAULT_TOTAL_BASIS_POINTS,
  VAULT_TOTAL_BASIS_POINTS_BN,
  useVault,
  DEFAULT_TIER_ID,
  getLidoContract,
  getStEthContract,
  type ExtendTierConfirmation,
  type TierConfirmationFnNames,
} from 'modules/vaults';
import { ceilDivBigint, formatPercent, toEthValue, toStethValue } from 'utils';
import { bigIntMax } from 'utils/bigint-math';
import {
  type Confirmation,
  getConfirmationsInfo,
} from 'utils/get-confirmations';

import type { VaultTierInfoArgs, VaultTierInfo } from '../types';

export type VaultTierData = ReturnType<typeof selectTierData>;

const getVaultTierConfirmation = async (
  address: Address,
  publicClient: RegisteredPublicClient,
  abi: Abi,
  vaultAddress: Address,
): Promise<{
  confirmExpiry: bigint;
  proposedVaultLimitShares: bigint;
  lastProposal: Confirmation<TierConfirmationFnNames> | undefined;
}> => {
  const { confirmations, confirmExpiry } =
    await getConfirmationsInfo<TierConfirmationFnNames>(
      address,
      publicClient,
      abi,
    );

  const vaultProposals = confirmations.filter(({ decodedData }) =>
    isAddressEqual(decodedData.args[0], vaultAddress),
  );
  const syncTierProposal = vaultProposals.findLast(
    ({ decodedData }) => decodedData.functionName === 'syncTier',
  );
  const lastProposal = syncTierProposal ?? vaultProposals.at(-1);

  const index =
    lastProposal?.decodedData.functionName === 'updateVaultShareLimit' ? 1 : 2;
  const proposedVaultLimitShares = lastProposal?.decodedData.args[index] ?? 0n;

  return {
    confirmExpiry,
    proposedVaultLimitShares,
    lastProposal,
  };
};

const enrichLastProposal = (
  proposal: Confirmation<TierConfirmationFnNames>,
  currentTierID: bigint,
  proposedVaultLimitStETH: bigint,
  proposedVaultLimitShares: bigint,
): ExtendTierConfirmation => {
  const { member, expiryTimestamp, expiryDate, decodedData } = proposal;

  const { functionName, args } = decodedData;
  const tierId = functionName === 'changeTier' ? args[1] : currentTierID;

  const base = {
    _id: crypto.randomUUID(),
    vaultAddress: args[0],
    member,
    expiryTimestamp,
    expiryDate,
    tierId,
  };

  if (functionName === 'syncTier') {
    return {
      ...base,
      functionName,
      proposedVaultLimitStETH: undefined,
      proposedVaultLimitShares: undefined,
    };
  }

  return {
    ...base,
    functionName,
    proposedVaultLimitStETH,
    proposedVaultLimitShares,
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
    forcedRebalanceThresholdBP,
    shareLimit,
    hub,
    operatorGrid,
    isPendingConnect,
    reserveRatioBP,
    infraFeeBP,
    liquidityFeeBP,
    reservationFeeBP,
    lazyOracle,
    ...rest
  } = vault;

  const lidoV3Contract = getLidoContract(publicClient);
  const stethContract = getStEthContract(publicClient);

  const [
    vaultRecord,
    totalValue,
    vaultTotalMintingCapacityShares,
    vaultMintableShares,
    vaultInfo,
  ] = await readWithReport({
    publicClient,
    lazyOracle,
    report: vault.report,
    isReportFresh: vault.isReportFresh,
    contracts: [
      hub.prepare.vaultRecord([vault.address]),
      dashboard.prepare.totalValue(),
      dashboard.prepare.totalMintingCapacityShares(),
      dashboard.prepare.remainingMintingCapacityShares([0n]),
      operatorGrid.prepare.vaultTierInfo([vault.address]),
    ] as const,
  });

  const [_nodeOperator, tierId] = vaultInfo;
  const { liabilityShares: vaultLiabilityShares, minimalReserve } = vaultRecord;

  const [tier] = await readWithReport({
    publicClient,
    lazyOracle,
    report: vault.report,
    isReportFresh: vault.isReportFresh,
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

  const { confirmExpiry, lastProposal, proposedVaultLimitShares } =
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
    stethContract.read.getPooledEthBySharesRoundUp([vaultLiabilityShares]),
    stethContract.read.getPooledEthByShares([vaultMintableShares]),
    stethContract.read.getPooledEthByShares([shareLimit]),
    stethContract.read.getPooledEthByShares([vaultTotalMintingCapacityShares]),
    stethContract.read.getPooledEthByShares([tierShareLimit]),
    stethContract.read.getPooledEthBySharesRoundUp([tierLiabilityShares]),
    stethContract.read.getPooledEthByShares([proposedVaultLimitShares]),
    lidoV3Contract.read.getMaxMintableExternalShares(),
  ]);

  const extendLastProposal = lastProposal
    ? enrichLastProposal(
        lastProposal,
        tierId,
        proposedVaultLimitStETH,
        proposedVaultLimitShares,
      )
    : undefined;

  return {
    lidoTVLSharesLimit,
    address,
    nodeOperator,
    minimalReserve,
    proposals: {
      confirmExpiry,
      lastProposal,
      extendLastProposal,
      proposedVaultLimitStETH,
      proposedVaultLimitShares,
    },
    vault: {
      tierId,
      totalValue,
      liabilityStETH: vaultLiabilityStETH,
      mintableStETH: vaultMintableStETH,
      stETHLimit: vaultStETHLimit,
      totalMintingCapacityStETH: vaultTotalMintingCapacityStETH,
      totalMintingCapacityShares: vaultTotalMintingCapacityShares,
      reserveRatioBP: Number(reserveRatioBP),
      forcedRebalanceThresholdBP: Number(forcedRebalanceThresholdBP),
      infraFeeBP: Number(infraFeeBP),
      liquidityFeeBP: Number(liquidityFeeBP),
      reservationFeeBP: Number(reservationFeeBP),
      shareLimit,
      isPendingConnect,
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
  const { vault, tier, minimalReserve } = tierData;

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

  const RR = BigInt(vault.reserveRatioBP);
  const oneMinusRR = VAULT_TOTAL_BASIS_POINTS_BN - RR;
  const collateral = bigIntMax(
    minimalReserve,
    ceilDivBigint(
      vault.totalMintingCapacityStETH * VAULT_TOTAL_BASIS_POINTS_BN,
      oneMinusRR,
    ),
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
    collateral,
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
    queryKey: [
      ...queryKeys.state,
      'vault-tier-info',
      activeVault?.blockNumberString,
    ],
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
