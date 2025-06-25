import type { VaultHubAbi } from 'abi/vault-hub';
import type { Address, Hex, ReadContractReturnType } from 'viem';
import type {
  getDashboardContract,
  getStakingVaultContract,
} from './contracts';

type VaultConnection = ReadContractReturnType<
  typeof VaultHubAbi,
  'vaultConnection',
  [Address]
>;

type VaultObligations = {
  obligations: ReadContractReturnType<
    typeof VaultHubAbi,
    'vaultObligations',
    [Address]
  >;
};

export type VaultInfo = VaultConnection &
  VaultObligations & {
    address: Address;
    owner: Address;
    nodeOperator: Address;
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
    withdrawalCredentials: Address;
  };

export type VaultReportType = {
  vault: Address;
  timestamp: bigint;
  totalValueWei: bigint;
  fee: bigint;
  liabilityShares: bigint;
  slashingReserve: bigint;
  proof: Hex[];
};

export type VaultBaseInfo = {
  address: Address;
  vault: ReturnType<typeof getStakingVaultContract>;
  dashboard: ReturnType<typeof getDashboardContract>;
  nodeOperator: Address;
  withdrawalCredentials: Hex;
  isReportFresh: boolean;
  reportCID: string;
  report: VaultReportType | null;
} & VaultConnection;
