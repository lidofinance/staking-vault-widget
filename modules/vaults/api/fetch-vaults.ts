import { isAddressEqual, zeroAddress, type Address } from 'viem';

import { calculateHealth } from 'utils';
import { getApiURL } from 'config';

import type { RegisteredPublicClient, useLidoSDK } from 'modules/web3';

import {
  getDashboardContract,
  getVaultHubContract,
  getVaultViewerContract,
} from '../contracts';
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
  shares: ReturnType<typeof useLidoSDK>['shares'];
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
  rebaseReward: string;
  grossStakingRewards: string;
  nodeOperatorRewards: string;
  dailyLidoFees: string;
  netStakingRewards: string;
  grossStakingAprPercent: number;
  netStakingAprPercent: number;
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
  rebaseReward: bigint;
  grossStakingRewards: bigint;
  nodeOperatorRewards: bigint;
  dailyLidoFees: bigint;
  netStakingRewards: bigint;
  grossStakingAprPercent: number;
  netStakingAprPercent: number;
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
  { publicClient, shares }: FetchVaultsContext,
  vaultAddress: Address,
): Promise<VaultEntryRaw> => {
  const vaultHub = getVaultHubContract(publicClient);
  const { owner, forcedRebalanceThresholdBP } =
    await vaultHub.read.vaultConnection([vaultAddress]);

  if (isAddressEqual(zeroAddress, owner)) {
    throw new Error(`[fetchVaultRPC] no such vault connected: ${vaultAddress}`);
  }

  const dashboardContract = getDashboardContract(owner, publicClient);

  const [totalValue, liabilityShares] = await Promise.all([
    dashboardContract.read.totalValue(),
    dashboardContract.read.liabilityShares(),
  ]);

  const liabilityStETH = await shares.convertToSteth(liabilityShares);

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
  { publicClient }: FetchVaultsContext,
  offset: bigint,
  limit: bigint,
): Promise<{ vaults: VaultEntryRaw[]; total: number }> => {
  const vaultViewer = getVaultViewerContract(publicClient);
  const vaultsData = await vaultViewer.read.vaultsDataBatch([offset, limit]);
  const totalVaultsCount = await vaultViewer.read.vaultsCount();

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

const OFFSET_BY_ADDRESS = BigInt(0);
const LIMIT_BY_ADDRESS = BigInt(200);
const fetchVaultsDataByAddressRPC = async (
  ctx: FetchVaultsContext,
  address: Address,
): Promise<{ vaults: VaultEntryRaw[]; total: number }> => {
  const { publicClient } = ctx;
  const vaultViewer = getVaultViewerContract(publicClient);

  const vaultAddresses = await vaultViewer.read.vaultsByOwnerBatch([
    address,
    OFFSET_BY_ADDRESS,
    LIMIT_BY_ADDRESS,
  ]);

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

const optBigInt = (value: string | undefined | null): bigint | undefined => {
  return value ? BigInt(value) : undefined;
};

const optNumber = (value: string | undefined): number | undefined => {
  return value ? Number(value) : undefined;
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
      totalValue: optBigInt(vault.totalValue),
      liabilityStETH: optBigInt(vault.liabilityStETH),
      liabilityShares: optBigInt(vault.liabilityShares),
      healthFactor:
        Number(vault.healthFactor) > 10_00 ||
        vault.healthFactor?.toLowerCase() === 'infinity'
          ? Infinity
          : optNumber(vault.healthFactor),
      shareLimit: optBigInt(vault.shareLimit),
      reserveRatioBP: vault.reserveRatioBP,
      forcedRebalanceThresholdBP: vault.forcedRebalanceThresholdBP,
      infraFeeBP: vault.infraFeeBP,
      liquidityFeeBP: vault.liquidityFeeBP,
      reservationFeeBP: vault.reservationFeeBP,
      feeRate: optBigInt(vault.feeRate),
      updatedAt: vault.updatedAt ? new Date(vault.updatedAt) : undefined,
      blockNumber: vault.blockNumber,
      isReportFresh: vault.isReportFresh,
      rebaseReward: optBigInt(vault.rebaseReward),
      grossStakingRewards: optBigInt(vault.grossStakingRewards),
      nodeOperatorRewards: optBigInt(vault.nodeOperatorRewards),
      dailyLidoFees: optBigInt(vault.dailyLidoFees),
      netStakingRewards: optBigInt(vault.netStakingRewards),
      grossStakingAprPercent: vault.grossStakingAprPercent,
      netStakingAprPercent: vault.netStakingAprPercent,
      bottomLine: optBigInt(vault.bottomLine),
      carrySpreadAprPercent: vault.carrySpreadAprPercent,
      lastReport: vault.lastReport?.fee
        ? {
            fee: optBigInt(vault.lastReport?.fee) as bigint,
            inOutDelta: optBigInt(vault.lastReport?.inOutDelta) as bigint,
            totalValueWei: optBigInt(vault.lastReport?.totalValueWei) as bigint,
            liabilityShares: optBigInt(
              vault.lastReport?.liabilityShares,
            ) as bigint,
            slashingReserve: optBigInt(
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
