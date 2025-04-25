import { useCallback } from 'react';
import {
  useConfig,
  useWaitForTransactionReceipt,
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
  SubmitStep,
  SubmitStepEnum,
} from 'shared/components/submit-modal/types';
import invariant from 'tiny-invariant';
import { useVaultPermissions } from 'modules/vaults/hooks/use-vault-permissions';

type BurnArgs = {
  token: string;
  amount: bigint;
  setModalState: (submitStep: { step: SubmitStep; tx?: Address }) => void;
};

export const useBurn = (onMutate = () => {}) => {
  const { chainId } = useDappStatus();
  const wagmiConfig = useConfig();
  const { activeVault } = useVaultInfo();
  const publicClient = usePublicClient();

  const { data: burnTx, writeContractAsync } = useWriteContract({
    config: wagmiConfig,
    mutation: {
      onMutate,
    },
  });

  const { data: burnReceipt } = useWaitForTransactionReceipt({
    hash: burnTx,
  });

  const callBurn = useCallback(
    async ({ token, amount, setModalState }: BurnArgs) => {
      invariant(publicClient, '[useBurn] publicClient is undefined');

      setModalState({ step: SubmitStepEnum.confirming });
      const tx = await writeContractAsync({
        abi: dashboardAbi,
        address: activeVault?.owner as Address,
        functionName: token === 'stETH' ? 'burnStETH' : 'burnWstETH',
        args: [amount],
        chainId,
      });

      setModalState({ step: SubmitStepEnum.submitting, tx });
      await publicClient.waitForTransactionReceipt({
        hash: tx,
      });

      return tx;
    },
    [chainId, activeVault?.owner, writeContractAsync, publicClient],
  );

  return {
    callBurn,
    burnTx,
    burnReceipt,
  };
};

type EstimateGasBurnProps = {
  token: string;
  amount: bigint;
};

export const useEstimateGasBurn = ({ token, amount }: EstimateGasBurnProps) => {
  const { hasPermission } = useVaultPermissions('repayer');
  const { address } = useAccount();
  const payload = [amount ?? 1n] as const;
  const functionName = token === 'stETH' ? 'burnStETH' : 'burnWstETH';
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
