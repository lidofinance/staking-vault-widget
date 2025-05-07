import { useCallback } from 'react';
import { useEstimateGas, useAccount } from 'wagmi';
import { Address, encodeFunctionData } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useVaultInfo } from 'modules/vaults';
import invariant from 'tiny-invariant';
import { useVaultPermission } from 'modules/vaults/hooks/use-vault-permissions';
import { fallbackedAddress } from 'utils/fallbacked-address';
import { useSendTransaction, withSuccess } from 'modules/web3';
import { useReportStatus } from 'features/report/use-report';

export const useMint = () => {
  const { activeVault } = useVaultInfo();
  const { shouldApplyReport, prepareReportCall } = useReportStatus();
  const { sendTX, ...rest } = useSendTransaction();

  return {
    mint: useCallback(
      async (recipient: Address, amount: bigint, token: string) => {
        invariant(activeVault?.owner, '[useMint] owner is undefined');

        const loadingActionText = `Minting ${token} backed by vault`;
        const mainActionCompleteText = `Minted ${token} backed by vault`;

        const mintCall = {
          to: activeVault.owner,
          data: encodeFunctionData({
            abi: dashboardAbi,
            functionName: token === 'stETH' ? 'mintStETH' : 'mintWstETH',
            args: [recipient, amount],
          }),
          value: amount,
          loadingActionText,
        };

        // if we have to post report, there will be extra modal due to async fetch
        const transactions = shouldApplyReport
          ? async () => {
              return [await prepareReportCall(), mintCall];
            }
          : [mintCall];

        const { success } = await withSuccess(
          sendTX({
            transactions,
            mainActionLoadingText: loadingActionText,
            mainActionCompleteText,
            forceAtomic: true,
          }),
        );

        return success;
      },
      [activeVault?.owner, prepareReportCall, sendTX, shouldApplyReport],
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
