import { useCallback } from 'react';
import {
  useConfig,
  usePublicClient,
  useWriteContract,
  useEstimateGas,
  useAccount,
} from 'wagmi';
import { Address, encodeFunctionData } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';
import { useVaultInfo } from 'features/overview/contexts';
import invariant from 'tiny-invariant';
import {
  SubmitStep,
  SubmitStepEnum,
} from 'shared/components/submit-modal/types';
import { useVaultPermissions } from 'modules/vaults/hooks/use-vault-permissions';
import { fallbackedAddress } from 'utils/fallbacked-address';

export const useClaim = (onMutate = () => {}) => {
  const { chainId } = useDappStatus();
  const wagmiConfig = useConfig();
  const { activeVault } = useVaultInfo();
  const publicClient = usePublicClient();
  const owner = activeVault?.owner;

  const { data: claimTx, writeContractAsync } = useWriteContract({
    config: wagmiConfig,
    mutation: {
      onMutate,
    },
  });

  const callClaim = useCallback(
    async (
      recipient: Address,
      setModalState: (submitStep: { step: SubmitStep; tx?: Address }) => void,
    ) => {
      invariant(owner, '[useClaimDashboard] owner is not available');
      invariant(
        publicClient,
        '[useClaimDashboard] publicClient is not available',
      );

      setModalState({ step: SubmitStepEnum.confirming });
      const tx = await writeContractAsync({
        abi: dashboardAbi,
        address: owner,
        functionName: 'claimNodeOperatorFee',
        args: [recipient],
        chainId,
      });

      setModalState({ step: SubmitStepEnum.submitting, tx });
      await publicClient.waitForTransactionReceipt({
        hash: tx,
      });

      return tx;
    },
    [chainId, writeContractAsync, owner, publicClient],
  );

  return {
    callClaim,
    claimTx,
  };
};

export const useEstimateClaim = (recipient?: Address) => {
  const { address } = useAccount();
  const { hasPermission } = useVaultPermissions('nodeOperatorFeeClaimer');
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
