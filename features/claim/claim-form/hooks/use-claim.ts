import { useCallback } from 'react';
import { useEstimateGas, useAccount } from 'wagmi';
import { Address, encodeFunctionData } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useVaultInfo, useVaultPermission, vaultTexts } from 'modules/vaults';
import invariant from 'tiny-invariant';
import { fallbackedAddress } from 'utils/fallbacked-address';
import { useSendTransaction, withSuccess } from 'modules/web3';
import { GoToVault } from 'modules/vaults/components/go-to-vault';

export const useClaim = () => {
  const { activeVault, refetchVaultInfo } = useVaultInfo();
  const owner = activeVault?.owner;
  const { sendTX, ...rest } = useSendTransaction();

  return {
    claim: useCallback(
      async (recipient: Address) => {
        invariant(owner, '[useClaim] owner is undefined');

        const loadingActionText = vaultTexts.actions.claim.loading;
        const mainActionCompleteText = vaultTexts.actions.claim.completed;

        const claimCall = {
          to: owner,
          data: encodeFunctionData({
            abi: dashboardAbi,
            functionName: 'claimNodeOperatorFee',
            args: [recipient],
          }),
          loadingActionText,
        };

        const { success } = await withSuccess(
          sendTX({
            transactions: [claimCall],
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
      [owner, refetchVaultInfo, sendTX],
    ),
    ...rest,
  };
};

export const useEstimateClaim = (recipient?: Address) => {
  const { address } = useAccount();
  const { hasPermission } = useVaultPermission('nodeOperatorFeeClaimer');
  const { activeVault } = useVaultInfo();
  const owner = activeVault?.owner;
  const enabled = !!(
    owner &&
    address &&
    hasPermission &&
    activeVault.nodeOperatorUnclaimedFee > 0n
  );

  return useEstimateGas({
    to: owner,
    account: address,
    data: encodeFunctionData({
      abi: dashboardAbi,
      functionName: 'claimNodeOperatorFee',
      args: [fallbackedAddress(recipient || address)],
    }),
    query: {
      enabled,
    },
  });
};
