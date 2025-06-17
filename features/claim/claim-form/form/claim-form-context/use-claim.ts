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
import invariant from 'tiny-invariant';
import { useSendTransaction, withSuccess } from 'modules/web3';
import {} from 'modules/vaults/components/go-to-vault';
import { ClaimFormValidatedValues } from '../types';

export const useClaim = () => {
  const { activeVault } = useVaultInfo();
  const owner = activeVault?.owner;
  const { sendTX, ...rest } = useSendTransaction();

  return {
    claim: useCallback(
      // TODO: FIX for testnet 2.0
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async ({ recipient }: ClaimFormValidatedValues) => {
        invariant(owner, '[useClaim] owner is undefined');

        const loadingActionText = vaultTexts.actions.claim.loading;
        const mainActionCompleteText = vaultTexts.actions.claim.completed;

        const claimCall = {
          to: owner,
          data: encodeFunctionData({
            abi: dashboardAbi,
            // TODO: redo to not use recipient
            functionName: 'disburseNodeOperatorFee',
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

        return success;
      },
      [owner, sendTX],
    ),
    ...rest,
  };
};

export const useEstimateClaim = () => {
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
      functionName: 'disburseNodeOperatorFee',
    }),
    query: {
      enabled,
    },
  });
};
