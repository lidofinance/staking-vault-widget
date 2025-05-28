import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { useEstimateGas } from 'wagmi';
import { Address, encodeFunctionData } from 'viem';

import { useSendTransaction, withSuccess, useDappStatus } from 'modules/web3';
import { useReportStatus } from 'features/report';
import { useVaultInfo, useVaultPermission, vaultTexts } from 'modules/vaults';
import { GoToVault } from 'modules/vaults/components/go-to-vault';

import { fallbackedAddress } from 'utils/fallbacked-address';
import { dashboardAbi } from 'abi/dashboard-abi';

type WithdrawArgs = {
  recipient: Address;
  amount: bigint;
};

export const useWithdraw = () => {
  const { activeVault, refetchVaultInfo } = useVaultInfo();
  const vaultOwner = activeVault?.owner;
  const { sendTX, ...rest } = useSendTransaction();
  const { isReportAvailable, prepareReportCall } = useReportStatus();

  const withdraw = useCallback(
    async ({ amount, recipient }: WithdrawArgs) => {
      invariant(vaultOwner, '[useWithdraw] vaultOwner is undefined');

      const withdrawCall = {
        loadingActionText: vaultTexts.actions.withdraw.loading,
        to: vaultOwner,
        data: encodeFunctionData({
          abi: dashboardAbi,
          functionName: 'withdraw',
          args: [recipient, amount],
        }),
      };

      // if we have to post report, there will be extra modal due to async fetch
      const transactions = isReportAvailable
        ? async () => [await prepareReportCall(), withdrawCall]
        : [withdrawCall];

      const { success } = await withSuccess(
        sendTX({
          transactions,
          forceAtomic: true,
          mainActionLoadingText: vaultTexts.actions.withdraw.loading,
          mainActionCompleteText: vaultTexts.actions.withdraw.completed,
          renderSuccessContent: GoToVault,
        }),
      );

      if (success) {
        await refetchVaultInfo();
      }

      return success;
    },
    [
      vaultOwner,
      isReportAvailable,
      refetchVaultInfo,
      sendTX,
      prepareReportCall,
    ],
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
