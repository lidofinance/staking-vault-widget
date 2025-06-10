import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { useEstimateGas, useAccount } from 'wagmi';
import { encodeFunctionData } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import {
  useVaultInfo,
  useVaultPermission,
  vaultTexts,
  GoToVault,
} from 'modules/vaults';
import {
  TransactionEntry,
  useLidoSDK,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';

import type { RepayFormValidatedValues } from '../types';

export const useRepay = () => {
  const { activeVault, refetchVaultInfo } = useVaultInfo();
  const { stETH, wstETH } = useLidoSDK();
  const { sendTX, ...rest } = useSendTransaction();

  return {
    burn: useCallback(
      async ({ amount, token }: RepayFormValidatedValues) => {
        invariant(activeVault?.owner, '[useMint] owner is undefined');

        const loadingActionText = vaultTexts.actions.repay.loading(token);
        const mainActionCompleteText =
          vaultTexts.actions.repay.completed(token);

        const prepareTransactions = async () => {
          const calls: TransactionEntry[] = [];

          const isSteth = token === 'stETH';
          const tokenContract = isSteth ? stETH : wstETH;

          const allowance = await tokenContract.allowance({
            to: activeVault.owner,
          });
          const needsAllowance = allowance < amount;
          if (needsAllowance) {
            const approveCall = {
              ...(await tokenContract.populateApprove({
                amount,
                to: activeVault.owner,
              })),
              loadingActionText: vaultTexts.actions.approve.loading(token),
            };
            calls.push(approveCall);
          }
          calls.push({
            to: activeVault.owner,
            data: encodeFunctionData({
              abi: dashboardAbi,
              functionName: token === 'stETH' ? 'burnStETH' : 'burnWstETH',
              args: [amount],
            }),
            loadingActionText,
          });
          return calls;
        };

        const { success } = await withSuccess(
          sendTX({
            transactions: prepareTransactions,
            forceAtomic: true,
            mainActionLoadingText: loadingActionText,
            mainActionCompleteText,
            renderSuccessContent: GoToVault,
          }),
        );

        if (success) {
          await refetchVaultInfo();
        }

        return success;
      },
      [activeVault?.owner, refetchVaultInfo, sendTX, stETH, wstETH],
    ),
    ...rest,
  };
};

type EstimateGasBurnProps = {
  token: string;
  amount?: bigint;
  allowance?: bigint;
};

export const useEstimateGasRepay = ({
  token,
  amount,
  allowance,
}: EstimateGasBurnProps) => {
  const { hasPermission } = useVaultPermission('repayer');
  const { address } = useAccount();
  const payload = [amount ?? 1n] as const;
  const functionName = token === 'stETH' ? 'burnStETH' : 'burnWstETH';
  const { activeVault } = useVaultInfo();
  const owner = activeVault?.owner;

  const enabled = !!(
    hasPermission &&
    allowance !== undefined &&
    payload[0] <= allowance &&
    address
  );

  return useEstimateGas({
    to: owner,
    account: address,
    data: encodeFunctionData({
      abi: dashboardAbi,
      functionName,
      args: payload,
    }),
    query: {
      enabled,
    },
  });
};
