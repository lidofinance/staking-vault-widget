import { useWriteContract, useChainId } from 'wagmi';
import { Address } from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

import { VaultFactoryAbi } from 'abi/vault-factory';
import { VAULT_FACTORY_BY_NETWORK } from 'consts/vault-factory';

export type VaultFactoryArgs = {
  defaultAdmin: Address;
  nodeOperatorManager: Address;
  assetRecoverer: Address;
  confirmExpiry: bigint;
  curatorFeeBP: number;
  nodeOperatorFeeBP: number;
  funders: Address[];
  withdrawers: Address[];
  minters: Address[];
  burners: Address[];
  rebalancers: Address[];
  depositPausers: Address[];
  depositResumers: Address[];
  validatorExitRequesters: Address[];
  validatorWithdrawalTriggerers: Address[];
  disconnecters: Address[];
  curatorFeeSetters: Address[];
  curatorFeeClaimers: Address[];
  nodeOperatorFeeClaimers: Address[];
};

export const useCreateVaultWithDelegation = () => {
  const chainId = useChainId();
  const { writeContractAsync } = useWriteContract();

  return async (args: VaultFactoryArgs) => {
    return await writeContractAsync({
      abi: VaultFactoryAbi,
      address: VAULT_FACTORY_BY_NETWORK[chainId as CHAINS] as Address,
      functionName: 'createVaultWithDelegation',
      args: [args, '0x'],
      chainId,
    });
  };
};
