import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { useAccount, useEstimateGas } from 'wagmi';
import { Address, encodeFunctionData } from 'viem';

import {
  TransactionEntry,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';

import { useVaultInfo, useVaultPermission, vaultTexts } from 'modules/vaults';
import { GoToVault } from 'modules/vaults/components/go-to-vault';

import { dashboardAbi } from 'abi/dashboard-abi';

export const useFund = () => {
  const { activeVault } = useVaultInfo();
  const { sendTX, ...rest } = useSendTransaction();

  return {
    fund: useCallback(
      async (amount: bigint) => {
        invariant(activeVault?.owner, '[useFund] owner is undefined');

        const fundCall: TransactionEntry = {
          to: activeVault.owner,
          data: encodeFunctionData({
            abi: dashboardAbi,
            functionName: 'fund',
          }),
          value: amount,
          loadingActionText: vaultTexts.actions.supply.loading,
        };

        const { success } = await withSuccess(
          sendTX({
            transactions: [fundCall],
            mainActionLoadingText: vaultTexts.actions.supply.loading,
            mainActionCompleteText: vaultTexts.actions.supply.completed,
            renderSuccessContent: GoToVault,
          }),
        );

        return success;
      },
      [activeVault?.owner, sendTX],
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
