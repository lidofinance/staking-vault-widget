import invariant from 'tiny-invariant';
import { useCallback, useState } from 'react';
import { useEstimateGas, useAccount } from 'wagmi';
import { encodeFunctionData } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useVaultInfo, vaultTexts, GoToVault } from 'modules/vaults';
import { useSendTransaction, withSuccess } from 'modules/web3';

export const useClaim = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const { activeVault } = useVaultInfo();
  const owner = activeVault?.owner;
  const { sendTX, ...rest } = useSendTransaction();

  return {
    claim: useCallback(async () => {
      invariant(owner, '[useClaim] owner is undefined');
      setSubmitting(true);

      const loadingActionText = vaultTexts.actions.claim.loading;
      const mainActionCompleteText = vaultTexts.actions.claim.completed;

      const claimCall = {
        to: owner,
        data: encodeFunctionData({
          abi: dashboardAbi,
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

      setSubmitting(false);
      return success;
    }, [owner, sendTX]),
    isSubmitting,
    ...rest,
  };
};

export const useEstimateClaim = () => {
  const { address } = useAccount();
  const { activeVault } = useVaultInfo();
  const owner = activeVault?.owner;
  const enabled = !!(
    owner &&
    address &&
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
