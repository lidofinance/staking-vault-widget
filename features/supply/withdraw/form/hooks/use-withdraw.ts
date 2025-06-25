import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { useChainId } from 'wagmi';
import { encodeFunctionData } from 'viem';

import { useVaultInfo, vaultTexts, GoToVault } from 'modules/vaults';
import {
  useSendTransaction,
  withSuccess,
  TransactionEntry,
} from 'modules/web3';
import { useReportCalls } from 'modules/vaults/report';

import type { WithdrawFormValidatedValues } from '../types';
import { getContractAddress } from 'config';
import { WethABI } from 'abi/weth-abi';

export const useWithdraw = () => {
  const { activeVault } = useVaultInfo();
  const chainId = useChainId();
  const { sendTX, ...rest } = useSendTransaction();
  const prepareReportCalls = useReportCalls();

  const withdraw = useCallback(
    async ({ amount, recipient, token }: WithdrawFormValidatedValues) => {
      invariant(activeVault, '[useWithdraw] activeVault is undefined');
      const wethAddress = getContractAddress(chainId, 'weth');
      invariant(
        wethAddress,
        `[useWithdraw] WETH address is undefined for chain:${chainId}`,
      );

      const calls: TransactionEntry[] = [];

      // withdraw call
      calls.push({
        ...activeVault.dashboard.encode.withdraw([recipient, amount]),
        loadingActionText: vaultTexts.actions.withdraw.loading,
      });

      // eth->weth wrap call
      if (token === 'wETH') {
        calls.push({
          loadingActionText: vaultTexts.actions.weth.loadingWrap,
          to: wethAddress,
          data: encodeFunctionData({
            abi: WethABI,
            functionName: 'deposit',
          }),
        });
      }

      const transactions = [...prepareReportCalls(), ...calls];

      const { success } = await withSuccess(
        sendTX({
          transactions,
          forceAtomic: true,
          mainActionLoadingText: vaultTexts.actions.withdraw.loading,
          mainActionCompleteText: vaultTexts.actions.withdraw.completed,
          renderSuccessContent: GoToVault,
        }),
      );

      return success;
    },
    [activeVault, chainId, prepareReportCalls, sendTX],
  );

  return {
    withdraw,
    ...rest,
  };
};
