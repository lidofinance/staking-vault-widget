import type { PublicClient, Address } from 'viem';
import { usePublicClient } from 'wagmi';
import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';

import type { LidoSDKShares } from '@lidofinance/lido-ethereum-sdk/shares';
import { calculateHealth } from '@lidofinance/lsv-cli/dist/utils/health/calculate-health';

import { useLidoSDK } from 'modules/web3';
import {
  getVaultHubContract,
  getStakingVaultContract,
  getDashboardContract,
} from 'modules/vaults';
import { fetchReportMerkle } from 'features/report/ipfs';
import { readWithReport } from 'features/report/simulate-report';

import { Multicall3AbiUtils } from 'abi/multicall-abi';
import { STRATEGY_LAZY } from 'consts/react-query-strategies';
import { bigIntMax } from 'utils/bigint-math';

import { VAULTS_ROOT_ROLES_MAP } from '../consts';

import type { VaultInfo } from 'types';

type VaultDataArgs = {
  publicClient: PublicClient;
  vaultAddress: Address;
  shares: LidoSDKShares;
};

const getVaultData = async ({
  publicClient,
  vaultAddress,
  shares,
}: VaultDataArgs): Promise<VaultInfo> => {
  invariant(
    publicClient.chain?.contracts?.multicall3,
    `Multicall3 address is not defined for chain ${publicClient.chain?.id}`,
  );

  const vaultHubContract = getVaultHubContract(publicClient);
  const vaultContract = getStakingVaultContract(vaultAddress, publicClient);

  const [
    owner,
    nodeOperator,
    { timestamp: vaultTime },
    [hubTime, , reportCID],
  ] = await Promise.all([
    vaultContract.read.owner(),
    vaultContract.read.nodeOperator(),
    vaultContract.read.latestReport(),
    vaultHubContract.read.latestReportData(),
  ]);

  const isReportAvailable = hubTime > vaultTime;

  // okay for now due to HTML caching
  const report = isReportAvailable
    ? await fetchReportMerkle(publicClient.chain.id, reportCID, vaultAddress)
    : undefined;

  const reportCall = report
    ? vaultHubContract.encode.updateVaultData([
        vaultAddress,
        report.totalValueWei,
        report.inOutDelta,
        report.fee,
        report.liabilityShares,
        report.proof,
      ])
    : undefined;

  const dashboardContract = getDashboardContract(owner, publicClient);

  const [
    inOutDelta,
    locked,
    { shareLimit, forcedRebalanceThresholdBP, liabilityShares, ...rest },
    balance,
    totalValue,
    nodeOperatorUnclaimedFee,
    withdrawableEther,
    totalMintingCapacity,
  ] = await readWithReport({
    publicClient,
    reportCall,
    contracts: [
      vaultContract.encode.inOutDelta(),
      vaultContract.encode.locked(),
      vaultHubContract.encode.vaultSocket([vaultAddress]),
      {
        abi: Multicall3AbiUtils,
        address: publicClient.chain.contracts.multicall3.address,
        functionName: 'getEthBalance',
        args: [vaultAddress],
      },
      dashboardContract.encode.totalValue(),
      dashboardContract.encode.nodeOperatorUnclaimedFee(),
      dashboardContract.encode.withdrawableEther(),
      dashboardContract.encode.totalMintingCapacity(),
    ] as const,
  });

  const [
    nodeOperatorFeeBP,
    defaultAdmins,
    nodeOperatorManagers,
    confirmExpiry,
  ] = await Promise.all([
    dashboardContract.read.nodeOperatorFeeBP(),
    dashboardContract.read.getRoleMembers([VAULTS_ROOT_ROLES_MAP.defaultAdmin]),
    dashboardContract.read.getRoleMembers([
      VAULTS_ROOT_ROLES_MAP.nodeOperatorManager,
    ]),
    dashboardContract.read.getConfirmExpiry(),
  ]);

  const mintableShares = bigIntMax(totalMintingCapacity - liabilityShares, 0n);

  const [
    liabilityStETH,
    mintableStETH,
    stETHLimit,
    lockedShares,
    totalMintingCapacityStETH,
  ] = await Promise.all([
    shares.convertToSteth(liabilityShares),
    shares.convertToSteth(mintableShares),
    shares.convertToSteth(shareLimit),
    shares.convertToShares(locked),
    shares.convertToSteth(totalMintingCapacity),
  ]);

  const healthScore = calculateHealth({
    totalValue,
    liabilitySharesInStethWei: liabilityStETH,
    forceRebalanceThresholdBP: forcedRebalanceThresholdBP,
  });

  return {
    address: vaultAddress,
    owner,
    nodeOperator,
    defaultAdmins,
    nodeOperatorManagers,
    totalValue,
    liabilityStETH,
    mintableStETH,
    mintableShares,
    stETHLimit,
    apr: null,
    healthScore: healthScore.healthRatio,
    totalMintingCapacity,
    totalMintingCapacityStETH,
    inOutDelta,
    locked,
    lockedShares,
    nodeOperatorUnclaimedFee,
    withdrawableEther,
    balance,
    nodeOperatorFeeBP,
    confirmExpiry,
    shareLimit,
    forcedRebalanceThresholdBP,
    liabilityShares,
    ...rest,
  };
};

export const useSingleVaultData = (vaultAddress: Address | undefined) => {
  const { shares } = useLidoSDK();
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ['single-vault-data', publicClient?.chain.id, vaultAddress],
    enabled: !!vaultAddress && !!publicClient,
    queryFn: async (): Promise<VaultInfo> => {
      invariant(publicClient, 'PublicClient is not defined');
      invariant(vaultAddress, 'vaultAddress is not defined');

      return getVaultData({ publicClient, shares, vaultAddress });
    },
    ...STRATEGY_LAZY,
  });
};

// TODO: find way to remove readonly
export const useVaultData = (
  vaultsAddressesList: readonly Address[] | undefined,
) => {
  const { shares } = useLidoSDK();
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ['vault-data', { data: vaultsAddressesList }],
    enabled: !!vaultsAddressesList?.length && !!publicClient,
    ...STRATEGY_LAZY,

    queryFn: async (): Promise<VaultInfo[]> => {
      invariant(publicClient, 'PublicClient is not ready');

      const vaults: VaultInfo[] = [];

      if (vaultsAddressesList?.length && vaultsAddressesList.length === 0) {
        return vaults;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      for (const vaultAddress of vaultsAddressesList!) {
        vaults.push(
          await getVaultData({
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
