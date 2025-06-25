import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { useChainId, useEstimateGas } from 'wagmi';
import { Address, encodeFunctionData } from 'viem';

import {
  useVaultInfo,
  useVaultPermission,
  vaultTexts,
  GoToVault,
} from 'modules/vaults';
import {
  useSendTransaction,
  withSuccess,
  useDappStatus,
  TransactionEntry,
} from 'modules/web3';
import { useReportCalls } from 'modules/vaults/report';

import { fallbackedAddress } from 'utils/fallbacked-address';
import { dashboardAbi } from 'abi/dashboard-abi';

import type { WithdrawFormValidatedValues } from '../types';
import { getContractAddress } from 'config';
import { WethABI } from 'abi/weth-abi';

export const useWithdraw = () => {
  const { activeVault } = useVaultInfo();
  const chainId = useChainId();
  const vaultOwner = activeVault?.owner;
  const { sendTX, ...rest } = useSendTransaction();
  const prepareReportCalls = useReportCalls();

  const withdraw = useCallback(
    async ({ amount, recipient, token }: WithdrawFormValidatedValues) => {
      invariant(vaultOwner, '[useWithdraw] vaultOwner is undefined');
      const wethAddress = getContractAddress(chainId, 'weth');
      invariant(
        wethAddress,
        `[useWithdraw] WETH address is undefined for chain:${chainId}`,
      );

      const calls: TransactionEntry[] = [];

      // withdraw call
      calls.push({
        loadingActionText: vaultTexts.actions.withdraw.loading,
        to: vaultOwner,
        data: encodeFunctionData({
          abi: dashboardAbi,
          functionName: 'withdraw',
          args: [recipient, amount],
        }),
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
    [vaultOwner, chainId, prepareReportCalls, sendTX],
  );

  return {
    withdraw,
    ...rest,
  };
};

type EstimateGasWithdrawArgs = {
  recipient: Address;
  amount?: bigint;
};

export const useEstimateGasWithdraw = ({
  recipient,
  amount,
}: EstimateGasWithdrawArgs) => {
  const { activeVault } = useVaultInfo();

  const { address } = useDappStatus();
  const { hasPermission } = useVaultPermission('withdrawer');
  const enabled = !!(hasPermission && address);
  const owner = activeVault?.owner;

  return useEstimateGas({
    to: owner,
    account: address,
    data: encodeFunctionData({
      abi: dashboardAbi,
      functionName: 'withdraw',
      args: [fallbackedAddress(recipient || address), amount || 1n],
    }),
    query: {
      enabled,
    },
  });
};
