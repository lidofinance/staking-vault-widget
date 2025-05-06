import { useCallback } from 'react';
import { useAccount, useEstimateGas } from 'wagmi';
import { Address, encodeFunctionData } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useVaultInfo } from 'modules/vaults';
import invariant from 'tiny-invariant';
import { useVaultPermission } from 'modules/vaults/hooks/use-vault-permissions';
import {
  TransactionEntry,
  useSendTransaction,
  withSuccess,
} from 'modules/web3/hooks/use-send-tx';

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
          loadingActionText: 'Supplying vault with ETH',
        };

        const { success } = await withSuccess(
          sendTX({
            transactions: [fundCall],
            mainActionLoadingText: 'Supplying vault with ETH',
            mainActionCompleteText: 'Vault supplied with ETH',
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
