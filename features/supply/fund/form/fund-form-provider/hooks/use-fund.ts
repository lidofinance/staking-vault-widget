import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { usePublicClient } from 'wagmi';
import { encodeFunctionData } from 'viem';

import { getContractAddress } from 'config';
import { WethABI } from 'abi/weth-abi';

import {
  TransactionEntry,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';
import { useVaultInfo, vaultTexts, GoToVault } from 'modules/vaults';

import { readWithReport, useReportCalls } from 'modules/vaults/report';
import type { FundFormValidatedValues } from 'features/supply/fund/form/types';

export const useFund = () => {
  const publicClient = usePublicClient();
  const { activeVault } = useVaultInfo();

  const prepareReportCalls = useReportCalls();
  const { sendTX, ...rest } = useSendTransaction();

  return {
    fund: useCallback(
      async ({
        amount,
        mintSteth,
        token,
        mintAddress,
      }: FundFormValidatedValues) => {
        invariant(activeVault, '[useFund] owner is undefined');
        const wethAddress = getContractAddress(publicClient.chain.id, 'weth');
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
          ...activeVault.dashboard.encode.fund({ value: amount }),
          loadingActionText: vaultTexts.actions.supply.loading,
        });

        // minting stETH requires async data for report and minting capacity
        if (mintSteth) {
          prepareTransactions = async () => {
            calls.push(...prepareReportCalls());

            const [maxMintableShares] = await readWithReport({
              contracts: [
                activeVault.dashboard.prepare.remainingMintingCapacityShares([
                  amount,
                ]),
              ],
              publicClient,
              report: activeVault.report,
            });

            calls.push({
              ...activeVault.dashboard.encode.mintShares([
                mintAddress,
                maxMintableShares,
              ]),
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
      [activeVault, prepareReportCalls, publicClient, sendTX],
    ),
    ...rest,
  };
};
