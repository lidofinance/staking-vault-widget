import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';
import { calculateHealth } from '@lidofinance/lsv-cli/dist/utils/health/calculate-health';
import type { LidoSDKShares } from '@lidofinance/lido-ethereum-sdk/shares';

import { type RegisteredPublicClient, useLidoSDK } from 'modules/web3';

import { readWithReport } from '../report';
import { useVault } from '../vault-context';
import type { VaultBaseInfo, VaultInfo } from '../types';
import { Multicall3AbiUtils } from 'abi/multicall-abi';

type VaultDataArgs = {
  publicClient: RegisteredPublicClient;
  vault: VaultBaseInfo;
  shares: LidoSDKShares;
};

const getVaultData = async ({
  publicClient,
  vault,
  shares,
}: VaultDataArgs): Promise<VaultInfo> => {
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
    obligations,
    balance,
    totalValue,
    nodeOperatorUnclaimedFee,
    withdrawableEther,
    nodeOperatorFeeRate,
    totalMintingCapacityShares,
    mintableShares,
    tier,
  ] = await readWithReport({
    publicClient,
    report: vault.report,
    contracts: [
      hub.prepare.vaultRecord([vault.address]),
      hub.prepare.isVaultConnected([vault.address]),
      hub.prepare.vaultObligations([vault.address]),
      {
        abi: Multicall3AbiUtils,
        address: publicClient.chain.contracts.multicall3.address,
        functionName: 'getEthBalance',
        args: [address],
      },
      dashboard.prepare.totalValue(),
      dashboard.prepare.nodeOperatorDisbursableFee(),
      dashboard.prepare.withdrawableValue(),
      dashboard.prepare.nodeOperatorFeeRate(),
      dashboard.prepare.totalMintingCapacityShares(),
      dashboard.prepare.remainingMintingCapacityShares([0n]),
      operatorGrid.prepare.vaultInfo([vault.address]),
    ] as const,
  });

  const {
    liabilityShares,
    inOutDelta: { value: inOutDelta },
    locked,
  } = record;

  const tierId = tier[1];
  const tierShareLimit = tier[2];

  const [
    liabilityStETH,
    mintableStETH,
    stETHLimit,
    lockedShares,
    totalMintingCapacityStETH,
    tierStETHLimit,
  ] = await Promise.all([
    shares.convertToSteth(liabilityShares),
    shares.convertToSteth(mintableShares),
    shares.convertToSteth(shareLimit),
    shares.convertToShares(locked),
    shares.convertToSteth(totalMintingCapacityShares),
    shares.convertToSteth(tierShareLimit),
  ]);

  const healthScore = calculateHealth({
    totalValue,
    liabilitySharesInStethWei: liabilityStETH,
    forceRebalanceThresholdBP: forcedRebalanceThresholdBP,
  });

  return {
    isVaultConnected,
    address,
    nodeOperator,
    totalValue,
    liabilityStETH,
    mintableStETH,
    mintableShares,
    stETHLimit,
    apr: null,
    healthScore: healthScore.healthRatio,
    totalMintingCapacityShares,
    totalMintingCapacityStETH,
    inOutDelta,
    locked,
    lockedShares,
    nodeOperatorUnclaimedFee,
    withdrawableEther,
    balance,
    nodeOperatorFeeRate,

    shareLimit,
    forcedRebalanceThresholdBP,
    liabilityShares,
    withdrawalCredentials,
    obligations,

    tierId,
    tierShareLimit,
    tierStETHLimit,
    ...rest,
  };
};

export const useVaultOverviewData = () => {
  const { shares, publicClient } = useLidoSDK();
  const { activeVault, queryKeys } = useVault();

  return useQuery({
    queryKey: [...queryKeys.state, 'vault-overview-data'],
    enabled: !!activeVault,
    queryFn: async (): Promise<VaultInfo> => {
      invariant(activeVault, '[useSingleVaultData] activeVault is not defined');

      return getVaultData({ publicClient, shares, vault: activeVault });
    },
  });
};
