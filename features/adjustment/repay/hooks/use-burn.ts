import { useCallback } from 'react';
import {
  useConfig,
  useWaitForTransactionReceipt,
  useWriteContract,
  usePublicClient,
  useEstimateGas,
  useAccount,
} from 'wagmi';
import { encodeFunctionData, maxUint256 } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';
import { useVaultInfo } from 'features/overview/contexts';
import {
  SubmitPayload,
  SubmitStepEnum,
} from 'shared/components/submit-modal/types';
import invariant from 'tiny-invariant';
import { useVaultPermissions } from 'modules/vaults/hooks/use-vault-permissions';
import { useLidoSDK } from 'modules/web3';

type BurnArgs = {
  token: string;
  amount: bigint;
  setModalState: (submitStep: SubmitPayload) => void;
};

export const useBurn = (onMutate = () => {}) => {
  const { chainId } = useDappStatus();
  const { stETH, wstETH } = useLidoSDK();
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
      invariant(activeVault, '[useBurn] activeVault is undefined ');
      const isSteth = token === 'stETH';
      const tokenContract = isSteth ? stETH : wstETH;

      const allowance = await tokenContract.allowance({
        to: activeVault.owner,
      });
      const needsAllowance = allowance < amount;
      if (needsAllowance) {
        setModalState({ step: SubmitStepEnum.confirming });

        const receipt = await tokenContract.approve({
          amount: maxUint256,
          to: activeVault.owner,
          callback: async (props) => {
            if (props.stage === 'receipt') {
              setModalState({
                step: SubmitStepEnum.submitting,
                tx: receipt.hash,
              });
            }
          },
        });

        await publicClient.waitForTransactionReceipt({
          hash: receipt.hash,
        });
      }

      setModalState({ step: SubmitStepEnum.confirming });
      const tx = await writeContractAsync({
        abi: dashboardAbi,
        address: activeVault.owner,
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
    [publicClient, activeVault, stETH, wstETH, writeContractAsync, chainId],
  );

  return {
    callBurn,
    burnTx,
    burnReceipt,
  };
};

type EstimateGasBurnProps = {
  token: string;
  amount?: bigint;
  allowance?: bigint;
};

export const useEstimateGasBurn = ({
  token,
  amount,
  allowance,
}: EstimateGasBurnProps) => {
  const { hasPermission } = useVaultPermissions('repayer');
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
