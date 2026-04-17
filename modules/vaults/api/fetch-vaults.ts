import { isAddressEqual, zeroAddress, type Address } from 'viem';

import { calculateHealth } from 'utils';
import { optBigint } from 'utils/opt-bigint';
import { optNumber } from 'utils/opt-number';

import { getApiURL } from 'config';

import type { RegisteredPublicClient } from 'modules/web3';
import {
  LidoSDKVaultEntity,
  LidoSDKVaultModule,
} from '@lidofinance/lido-ethereum-sdk';

import { getStEthContract } from '../contracts';
import { vaultApiRoutes } from '../consts';

export type FetchVaultsParams = {
  page: number;
  perPage: number;
  sortBy:
    | 'totalValue'
    | 'liabilityStETH'
    | 'liabilityShares'
    | 'healthFactor'
    | 'forcedRebalanceThresholdBP'
    | 'blockNumber'
    | 'grossStakingAPR'
    | 'grossStakingAprBps'
    | 'grossStakingAprPercent'
    | 'carrySpreadAPR'
    | 'carrySpreadAprBps'
    | 'carrySpreadAprPercent';
  sortDir: 'asc' | 'desc';
  role?: string;
  address?: Address;
};

export type FetchVaultsContext = {
  publicClient: RegisteredPublicClient;
  vaultModule: LidoSDKVaultModule;
};

type VaultEntryRaw = {
  address: Address;
} & Partial<{
  ens: string | null;
  customName: string | null;
  totalValue: string;
  liabilityStETH: string;
  liabilityShares: string;
  healthFactor: string;
  shareLimit: string;
  reserveRatioBP: number;
  forcedRebalanceThresholdBP: number;
  infraFeeBP: number;
  liquidityFeeBP: number;
  reservationFeeBP: number;
  feeRate: string;
  updatedAt: string;
  blockNumber: number;
  isReportFresh: boolean;
  isQuarantineActive: boolean;
  quarantinePendingTotalValueIncrease: string;
  quarantineStartTimestamp: number;
  quarantineEndTimestamp: number;
  rebaseReward: string;
  grossStakingRewards: string;
  nodeOperatorRewards: string;
  dailyLidoFees: string;
  netStakingRewards: string;
  grossStakingAprPercent: number;
  netStakingAprPercent: number;
  grossStakingAprSma: number;
  netStakingAprSma: number;
  carrySpreadAprSma: number;
  bottomLine: string;
  carrySpreadAprPercent: number;
  lastReport: {
    fee: string | null;
    inOutDelta: string | null;
    totalValueWei: string | null;
    liabilityShares: string | null;
    slashingReserve: string | null;
  };
}>;

export type VaultEntry = {
  address: Address;
} & Partial<{
  ens: string;
  customName: string;
  totalValue: bigint;
  liabilityStETH: bigint;
  liabilityShares: bigint;
  healthFactor: number;
  shareLimit: bigint;
  reserveRatioBP: number;
  forcedRebalanceThresholdBP: number;
  infraFeeBP: number;
  liquidityFeeBP: number;
  reservationFeeBP: number;
  feeRate: bigint;
  updatedAt: Date;
  blockNumber: number;
  isReportFresh: boolean;
  isQuarantineActive: boolean;
  quarantinePendingTotalValueIncrease: bigint;
  quarantineStartTimestamp: number;
  quarantineEndTimestamp: number;
  rebaseReward: bigint;
  grossStakingRewards: bigint;
  nodeOperatorRewards: bigint;
  dailyLidoFees: bigint;
  netStakingRewards: bigint;
  grossStakingAprPercent: number;
  netStakingAprPercent: number;
  grossStakingAprSma: number;
  netStakingAprSma: number;
  carrySpreadAprSma: number;
  bottomLine: bigint;
  carrySpreadAprPercent: number;
  lastReport: {
    fee: bigint;
    inOutDelta: bigint;
    totalValueWei: bigint;
    liabilityShares: bigint;
    slashingReserve: bigint;
  };
}>;

type VaultsApiResponse = {
  // indicates where response came from
  isAPI: boolean;
  total: number;
  nextUpdateAt?: string;
  lastReportMeta?: {
    cid: string;
    refSlot: number;
    blockNumber: number;
    timestamp: number;
  };
  data: VaultEntryRaw[];
};

export type FetchVaultsResult = {
  isAPI: boolean;
  total: number;
  pagesCount: number;
  nextUpdateAt?: Date;
  lastReportMeta?: {
    cid: string;
    refSlot: number;
    blockNumber: number;
    timestamp: number;
    reportDate: Date;
  };
  data: VaultEntry[];
};

const fetchVaultRPC = async (
  { publicClient, vaultModule }: FetchVaultsContext,
  vaultAddress: Address,
): Promise<VaultEntryRaw> => {
  const vaultHub = await vaultModule.contracts.getContractVaultHub();
  const vaultEntity = new LidoSDKVaultEntity({
    vaultAddress,
    skipDashboardCheck: true,
    bus: vaultModule,
  });
  const { owner, forcedRebalanceThresholdBP } =
    await vaultHub.read.vaultConnection([vaultAddress]);

  if (isAddressEqual(zeroAddress, owner)) {
    throw new Error(`[fetchVaultRPC] no such vault connected: ${vaultAddress}`);
  }

  const dashboardContract = await vaultEntity.getDashboardContract();

  const [totalValue, liabilityShares] = await Promise.all([
    dashboardContract.read.totalValue(),
    dashboardContract.read.liabilityShares(),
  ]);

  const stethContract = getStEthContract(publicClient);
  const liabilityStETH = await stethContract.read.getPooledEthBySharesRoundUp([
    liabilityShares,
  ]);

  const healthScore = calculateHealth({
    totalValue,
    liabilitySharesInStethWei: liabilityStETH,
    forceRebalanceThresholdBP: forcedRebalanceThresholdBP,
  });

  return {
    address: vaultAddress,
    totalValue: totalValue.toString(),
    liabilityStETH: liabilityStETH.toString(),
    healthFactor: String(healthScore.healthRatio),
    forcedRebalanceThresholdBP: forcedRebalanceThresholdBP,
    liabilityShares: liabilityShares.toString(),
  };
};

const fetchVaultsDataBatchRPC = async (
  { vaultModule }: FetchVaultsContext,
  offset: bigint,
  limit: bigint,
): Promise<{ vaults: VaultEntryRaw[]; total: number }> => {
  const vaultViewer = await vaultModule.contracts.getContractVaultViewer();
  const [vaultsData, totalVaultsCount] = await Promise.all([
    vaultViewer.read.vaultsDataBatch([offset, limit]),
    vaultViewer.read.vaultsCount(),
  ]);

  const vaultsCalculatedData = vaultsData.map((vaultData) => {
    const { totalValue, liabilityStETH, connection, record } = vaultData;

    const healthScore = calculateHealth({
      totalValue,
      liabilitySharesInStethWei: liabilityStETH,
      forceRebalanceThresholdBP: connection.forcedRebalanceThresholdBP,
    });

    return {
      address: vaultData.vaultAddress,
      totalValue: totalValue.toString(),
      liabilityStETH: liabilityStETH.toString(),
      healthFactor: String(healthScore.healthRatio),
      forcedRebalanceThresholdBP: connection.forcedRebalanceThresholdBP,
      liabilityShares: record.liabilityShares.toString(),
    };
  });

  return {
    vaults: vaultsCalculatedData,
    total: Number(totalVaultsCount),
  };
};

const LIMIT_BY_ADDRESS = 200n;
const fetchVaultsDataByAddressRPC = async (
  ctx: FetchVaultsContext,
  address: Address,
): Promise<{ vaults: VaultEntryRaw[]; total: number }> => {
  const { vaultModule } = ctx;
  const vaultViewer = await vaultModule.contracts.getContractVaultViewer();
  const vaultCount = await vaultViewer.read.vaultsCount();
  const vaultAddresses: Address[] = [];

  for (let i = 0n; i < vaultCount; i += LIMIT_BY_ADDRESS) {
    const vaults = await vaultViewer.read.vaultsByOwnerBatch([
      address,
      BigInt(i),
      LIMIT_BY_ADDRESS,
    ]);
    vaultAddresses.push(...vaults);
  }

  const vaults = await Promise.all(
    vaultAddresses.map((vaultAddress) =>
      fetchVaultRPC(ctx, vaultAddress).catch((e) => {
        console.warn(
          `[fetchConnectedVaultsRPC] Failed to fetch vault data for ${vaultAddress}:`,
          e,
        );
        return {
          address: vaultAddress,
        };
      }),
    ),
  );

  return { vaults, total: vaults.length };
};

const fetchConnectedVaultsRPC = async (
  ctx: FetchVaultsContext,
  params: FetchVaultsParams,
): Promise<VaultsApiResponse> => {
  const offset = BigInt(params.perPage * (params.page - 1));
  const limit = BigInt(params.perPage);

  const { vaults, total } = await (params.address
    ? fetchVaultsDataByAddressRPC(ctx, params.address)
    : fetchVaultsDataBatchRPC(ctx, offset, limit));

  return {
    data: vaults,
    total,
    isAPI: false,
  };
};

const fetchConnectedVaultsApi = async (
  ctx: FetchVaultsContext,
  params: FetchVaultsParams,
) => {
  const apiUrl = getApiURL('vaultsApiBasePath');

  if (!apiUrl) {
    throw new Error(
      `[fetchConnectedVaultsApi] Vault API URL is not defined for ${ctx.publicClient.chain.id}`,
    );
  }

  const response = await fetch(
    vaultApiRoutes.vaults(apiUrl, {
      offset: (params.page - 1) * params.perPage,
      limit: params.perPage,
      sortBy: params.sortBy,
      direction: params.sortDir,
      role: params.role,
      address: params.address,
    }),
  );

  if (!response.ok) {
    throw new Error(
      `[fetchConnectedVaultsApi] Failed to fetch vaults from API: ${response.status} ${response.statusText}`,
    );
  }
  const result = await response.json();

  return { ...result, isAPI: true };
};

const normalizeResponse = (
  response: VaultsApiResponse,
  params: FetchVaultsParams,
): FetchVaultsResult => {
  return {
    pagesCount: Math.ceil(response.total / params.perPage),
    isAPI: response.isAPI,
    total: response.total,
    nextUpdateAt: response.nextUpdateAt
      ? new Date(response.nextUpdateAt)
      : undefined,
    lastReportMeta: response.lastReportMeta
      ? {
          ...response.lastReportMeta,
          reportDate: new Date(response.lastReportMeta.timestamp * 1000),
        }
      : undefined,
    data: response.data.map((vault) => ({
      ...vault,
      ens: vault.ens ?? undefined,
      customName: vault.customName ?? undefined,
      totalValue: optBigint(vault.totalValue),
      liabilityStETH: optBigint(vault.liabilityStETH),
      liabilityShares: optBigint(vault.liabilityShares),
      healthFactor:
        Number(vault.healthFactor) > 10_00 ||
        vault.healthFactor?.toLowerCase() === 'infinity'
          ? Infinity
          : optNumber(vault.healthFactor),
      shareLimit: optBigint(vault.shareLimit),
      reserveRatioBP: vault.reserveRatioBP,
      forcedRebalanceThresholdBP: vault.forcedRebalanceThresholdBP,
      infraFeeBP: vault.infraFeeBP,
      liquidityFeeBP: vault.liquidityFeeBP,
      reservationFeeBP: vault.reservationFeeBP,
      feeRate: optBigint(vault.feeRate),
      updatedAt: vault.updatedAt ? new Date(vault.updatedAt) : undefined,
      blockNumber: vault.blockNumber,
      isReportFresh: vault.isReportFresh,
      isQuarantineActive: vault.isQuarantineActive,
      quarantinePendingTotalValueIncrease: optBigint(
        vault.quarantinePendingTotalValueIncrease,
      ),
      quarantineStartTimestamp: vault.quarantineStartTimestamp,
      quarantineEndTimestamp: vault.quarantineEndTimestamp,
      rebaseReward: optBigint(vault.rebaseReward),
      grossStakingRewards: optBigint(vault.grossStakingRewards),
      nodeOperatorRewards: optBigint(vault.nodeOperatorRewards),
      dailyLidoFees: optBigint(vault.dailyLidoFees),
      netStakingRewards: optBigint(vault.netStakingRewards),
      grossStakingAprPercent: vault.grossStakingAprPercent,
      netStakingAprPercent: vault.netStakingAprPercent,
      grossStakingAprSma: vault.grossStakingAprSma,
      netStakingAprSma: vault.netStakingAprSma,
      carrySpreadAprSma: vault.carrySpreadAprSma,
      bottomLine: optBigint(vault.bottomLine),
      carrySpreadAprPercent: vault.carrySpreadAprPercent,
      lastReport: vault.lastReport?.fee
        ? {
            fee: optBigint(vault.lastReport?.fee),
            inOutDelta: optBigint(vault.lastReport?.inOutDelta) as bigint,
            totalValueWei: optBigint(vault.lastReport?.totalValueWei) as bigint,
            liabilityShares: optBigint(
              vault.lastReport?.liabilityShares,
            ) as bigint,
            slashingReserve: optBigint(
              vault.lastReport?.slashingReserve,
            ) as bigint,
          }
        : undefined,
    })),
  };
};

export const fetchVaults = async (
  ctx: FetchVaultsContext,
  params: FetchVaultsParams,
): Promise<FetchVaultsResult> => {
  let result: VaultsApiResponse;
  try {
    result = await fetchConnectedVaultsApi(ctx, params);
  } catch (error) {
    console.warn(
      '[fetchConnectedVaults] Error fetching connected vaults from api:',
      error,
    );
    result = await fetchConnectedVaultsRPC(ctx, params);
  }
  return normalizeResponse(result, params);
};
