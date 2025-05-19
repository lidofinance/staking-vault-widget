import { useCallback } from 'react';
import { useEstimateGas } from 'wagmi';
import { Address, encodeFunctionData } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';
import { useVaultInfo } from 'modules/vaults';
import invariant from 'tiny-invariant';
import { useVaultPermission } from 'modules/vaults/hooks/use-vault-permissions';

import { fallbackedAddress } from 'utils/fallbacked-address';
import { useSendTransaction, withSuccess } from 'modules/web3';
import { useReportStatus } from 'features/report';
import { GoToVault } from 'modules/vaults/components/go-to-vault';

type WithdrawArgs = {
  recipient: Address;
  amount: bigint;
};

export const useWithdraw = () => {
  const { activeVault } = useVaultInfo();
  const vaultOwner = activeVault?.owner;
  const { sendTX, ...rest } = useSendTransaction();
  const { isReportAvailable, prepareReportCall } = useReportStatus();

  const withdraw = useCallback(
    async ({ amount, recipient }: WithdrawArgs) => {
      invariant(vaultOwner, '[useWithdraw] vaultOwner is undefined');

      const withdrawCall = {
        loadingActionText: 'Withdrawing ETH from vault',
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

      return withSuccess(
        sendTX({
          transactions,
          forceAtomic: true,
          mainActionLoadingText: 'Withdrawing ETH from vault',
          mainActionCompleteText: 'ETH withdrawn from vault',
          renderSuccessContent: GoToVault,
        }),
      );
    },
    [vaultOwner, isReportAvailable, sendTX, prepareReportCall],
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
