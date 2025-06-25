import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { useEstimateGas, useAccount } from 'wagmi';
import { type Address, encodeFunctionData } from 'viem';

import { useSendTransaction, withSuccess } from 'modules/web3';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useVaultInfo, useVaultPermission, vaultTexts } from 'modules/vaults';

import { fallbackedAddress } from 'utils/fallbacked-address';

import { useReportStatus } from 'features/report';
import { GoToVault } from 'modules/vaults/components/go-to-vault';
import { MintFormValidatedValues } from '../types';

export const useMint = () => {
  const { activeVault } = useVaultInfo();
  const { isReportAvailable, prepareReportCall } = useReportStatus();
  const { sendTX, ...rest } = useSendTransaction();

  return {
    mint: useCallback(
      async ({ amount, recipient, token }: MintFormValidatedValues) => {
        invariant(activeVault?.owner, '[useMint] owner is undefined');

        const loadingActionText = vaultTexts.actions.mint.loading(token);
        const mainActionCompleteText = vaultTexts.actions.mint.completed(token);

        const mintCall = {
          to: activeVault.owner,
          data: encodeFunctionData({
            abi: dashboardAbi,
            functionName: token === 'stETH' ? 'mintStETH' : 'mintWstETH',
            args: [recipient, amount],
          }),
          loadingActionText,
        };

        // if we have to post report, there will be extra modal due to async fetch
        const transactions = isReportAvailable
          ? async () => {
              return [await prepareReportCall(), mintCall];
            }
          : [mintCall];

        const { success } = await withSuccess(
          sendTX({
            transactions,
            forceAtomic: true,
            mainActionLoadingText: loadingActionText,
            mainActionCompleteText,
            renderSuccessContent: GoToVault,
          }),
        );

        return success;
      },
      [activeVault?.owner, prepareReportCall, sendTX, isReportAvailable],
    ),
    ...rest,
  };
};

export type EstimateGasMintProps = {
  recipient: Address;
  token: string;
  amount: bigint;
};

export const useEstimateMint = ({
  recipient,
  token,
  amount,
}: EstimateGasMintProps) => {
  const { hasPermission } = useVaultPermission('minter');
  const { address } = useAccount();
  const payload = [
    fallbackedAddress(recipient || address),
    amount ?? 1n,
  ] as const;
  const functionName = token === 'stETH' ? 'mintStETH' : 'mintWstETH';
  const { activeVault } = useVaultInfo();
  const owner = activeVault?.owner;

  const enabled = !!(hasPermission && address);

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
