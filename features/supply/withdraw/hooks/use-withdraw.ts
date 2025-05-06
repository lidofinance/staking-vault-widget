import { useCallback } from 'react';
import { useEstimateGas, usePublicClient } from 'wagmi';
import { Address, encodeFunctionData } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';
import { useVaultInfo } from 'modules/vaults';
import invariant from 'tiny-invariant';
import { useVaultPermission } from 'modules/vaults/hooks/use-vault-permissions';

import { fallbackedAddress } from 'utils/fallbacked-address';
import {
  TransactionEntry,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';
import { useReportStatus } from 'features/report/use-report';
import { fetchReportMerkle } from 'features/report/ipfs';
import { getVaultHubContract } from 'modules/vaults/contracts/vault-hub';

type WithdrawArgs = {
  recipient: Address;
  amount: bigint;
};

export const useWithdraw = () => {
  const { activeVault } = useVaultInfo();
  const publicClient = usePublicClient();
  const { sendTX, ...rest } = useSendTransaction();
  const { shouldApplyReport } = useReportStatus();

  const withdraw = useCallback(
    async ({ amount, recipient }: WithdrawArgs) => {
      invariant(activeVault, '[useWithdraw] activeVault is undefined');
      invariant(publicClient, '[useWithdraw] publicClient is undefined');

      const transactions: TransactionEntry[] = [];

      if (shouldApplyReport) {
        const hub = getVaultHubContract(publicClient);
        const reportCid = (await hub.read.latestReportData())[2];

        const report = await fetchReportMerkle(
          publicClient.chain.id,
          reportCid,
          activeVault.address,
        );

        transactions.push({
          loadingActionText: 'Applying oracle report',
          to: hub.address,
          data: encodeFunctionData({
            abi: hub.abi,
            functionName: 'updateVaultData',
            args: [
              activeVault.address,
              report.totalValueWei,
              report.inOutDelta,
              report.fee,
              report.liabilityShares,
              report.proof,
            ],
          }),
        });
      }

      transactions.push({
        loadingActionText: 'Withdrawing ETH from vault',
        to: activeVault.owner,
        data: encodeFunctionData({
          abi: dashboardAbi,
          functionName: 'withdraw',
          args: [recipient, amount],
        }),
      });

      return withSuccess(
        sendTX({
          transactions,
          mainActionLoadingText: 'Withdrawing ETH from vault',
          mainActionCompleteText: 'ETH withdrawn from vault',
        }),
      );
    },
    [activeVault, publicClient, shouldApplyReport, sendTX],
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
