import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { useAccount, useChainId, useEstimateGas, usePublicClient } from 'wagmi';
import { Address, encodeFunctionData } from 'viem';

import { getContractAddress } from 'config';
import { WethABI } from 'abi/weth-abi';
import { dashboardAbi } from 'abi/dashboard-abi';

import {
  TransactionEntry,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';
import {
  getDashboardContract,
  useVaultInfo,
  useVaultPermission,
  vaultTexts,
  GoToVault,
} from 'modules/vaults';

import { useReportStatus } from 'features/report';

import type { FundFormSchemaType } from '../../types';

export const useFund = () => {
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { activeVault } = useVaultInfo();

  const { isReportAvailable, prepareReportCall } = useReportStatus();
  const { sendTX, ...rest } = useSendTransaction();

  return {
    fund: useCallback(
      async ({ amount, mintSteth, token, mintAddress }: FundFormSchemaType) => {
        const wethAddress = getContractAddress(chainId, 'weth');

        invariant(publicClient, '[useFund] publicClient is undefined');
        invariant(activeVault?.owner, '[useFund] owner is undefined');
        invariant(wethAddress, '[useFund] WETH address is undefined');

        let prepareTransactions: () => Promise<TransactionEntry[]> = () =>
          Promise.reject(undefined);

        const calls: TransactionEntry[] = [];

        if (token === 'wETH') {
          calls.push({
            to: wethAddress,
            data: encodeFunctionData({
              abi: WethABI,
              functionName: 'withdraw',
              args: [amount],
            }),
            loadingActionText: 'Unwrapping wETH',
          });
        }

        calls.push({
          to: activeVault.owner,
          data: encodeFunctionData({
            abi: dashboardAbi,
            functionName: 'fund',
          }),
          value: amount,
          loadingActionText: vaultTexts.actions.supply.loading,
        });

        // minting stETH requires async data for report and minting capacity
        if (mintSteth) {
          prepareTransactions = async () => {
            isReportAvailable && calls.push(await prepareReportCall());

            const dashboard = getDashboardContract(
              activeVault.owner,
              publicClient,
            );

            const maxMintableShares =
              await dashboard.read.remainingMintingCapacity([amount]);

            calls.push({
              to: activeVault.owner,
              data: encodeFunctionData({
                abi: dashboardAbi,
                functionName: 'mintShares',
                args: [mintAddress, maxMintableShares],
              }),
              loadingActionText: vaultTexts.actions.mint.loading('stETH'),
            });

            return calls;
          };
        }

        const { success } = await withSuccess(
          sendTX({
            transactions: mintSteth ? prepareTransactions : calls,
            mainActionLoadingText: vaultTexts.actions.supply.loading,
            mainActionCompleteText: vaultTexts.actions.supply.completed,
            renderSuccessContent: GoToVault,
          }),
        );

        return success;
      },
      [
        activeVault?.owner,
        chainId,
        isReportAvailable,
        prepareReportCall,
        publicClient,
        sendTX,
      ],
    ),
    ...rest,
  };
};

export type SimulationFundProps = {
  address: Address | undefined;
  amount: bigint;
};

export const useEstimateGasFund = ({
  address,
  amount,
}: SimulationFundProps) => {
  const { address: accountAddress } = useAccount();
  const { hasPermission } = useVaultPermission('supplier');

  return useEstimateGas({
    to: address as Address,
    data: encodeFunctionData({
      abi: dashboardAbi,
      functionName: 'fund',
    }),
    account: accountAddress,
    value: amount,
    query: {
      enabled: !!address && hasPermission && !!amount,
    },
  });
};
