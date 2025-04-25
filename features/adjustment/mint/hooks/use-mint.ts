import { useCallback } from 'react';
import {
  useConfig,
  useWriteContract,
  usePublicClient,
  useEstimateGas,
  useAccount,
} from 'wagmi';
import { Address, encodeFunctionData } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';
import { useVaultInfo } from 'features/overview/contexts';
import {
  SubmitPayload,
  SubmitStepEnum,
} from 'shared/components/submit-modal/types';
import invariant from 'tiny-invariant';
import { useVaultPermissions } from 'modules/vaults/hooks/use-vault-permissions';
import { fallbackedAddress } from 'utils/fallbacked-address';

export const useMint = (onMutate = () => {}) => {
  const { chainId } = useDappStatus();
  const wagmiConfig = useConfig();
  const { activeVault } = useVaultInfo();
  const publicClient = usePublicClient();
  const { data: mintTx, writeContractAsync } = useWriteContract({
    config: wagmiConfig,
    mutation: {
      onMutate,
    },
  });

  const callMint = useCallback(
    async (
      recipient: Address,
      amount: bigint,
      token: string,
      setModalState: (submitStep: SubmitPayload) => void,
    ) => {
      invariant(publicClient, '[useMintDashboard] publicClient is undefined');

      setModalState({ step: SubmitStepEnum.confirming });
      const tx = await writeContractAsync({
        abi: dashboardAbi,
        address: activeVault?.owner as Address,
        functionName: token === 'stETH' ? 'mintStETH' : 'mintWstETH',
        args: [recipient, amount],
        chainId,
      });

      setModalState({ step: SubmitStepEnum.submitting, tx });
      await publicClient.waitForTransactionReceipt({
        hash: tx,
      });

      return tx;
    },
    [chainId, writeContractAsync, activeVault?.owner, publicClient],
  );

  return {
    callMint,
    mintTx,
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
  const { hasPermission } = useVaultPermissions('minter');
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
