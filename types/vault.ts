import type { VaultHubAbi } from 'abi/vault-hub';
import type { Address, ReadContractReturnType } from 'viem';

export type VaultInfo = VaultSocket &
  VaultObligations & {
    address: Address;
    isVaultConnected: boolean;
    owner: Address;
    nodeOperator: Address;
    defaultAdmins: readonly Address[];
    nodeOperatorManagers: readonly Address[];
    nodeOperatorFeeRecipient: Address;
    totalValue: bigint;
    liabilityShares: bigint;
    liabilityStETH: bigint;
    mintableStETH: bigint;
    mintableShares: bigint;
    stETHLimit: bigint;
    apr: null;
    healthScore: number;
    totalMintingCapacity: bigint;
    totalMintingCapacityStETH: bigint;
    inOutDelta: bigint;
    locked: bigint;
    lockedShares: bigint;
    nodeOperatorUnclaimedFee: bigint;
    withdrawableEther: bigint;
    balance: bigint;
    nodeOperatorFeeRate: bigint;
    confirmExpiry: bigint;
    withdrawalCredentials: Address;
    tierId: string;
    tierStETHLimit: bigint;
  };

export type VaultSocket = ReadContractReturnType<
  typeof VaultHubAbi,
  'vaultConnection',
  [Address]
>;

export type VaultObligations = {
  obligations: ReadContractReturnType<
    typeof VaultHubAbi,
    'vaultObligations',
    [Address]
  >;
};
