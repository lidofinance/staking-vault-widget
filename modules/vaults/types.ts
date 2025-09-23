import type { VaultHubAbi } from 'abi/vault-hub';
import type { Address, Hex, ReadContractReturnType } from 'viem';
import type {
  getDashboardContract,
  getStakingVaultContract,
  getVaultHubContract,
  getOperatorGridContract,
} from './contracts';

export type VaultConnection = ReadContractReturnType<
  typeof VaultHubAbi,
  'vaultConnection',
  [Address]
>;

export type VaultRecord = ReadContractReturnType<
  typeof VaultHubAbi,
  'vaultRecord',
  [Address]
>;

export type VaultReportType = {
  vault: Address;
  totalValueWei: bigint;
  fee: bigint;
  liabilityShares: bigint;
  maxLiabilityShares: bigint;
  slashingReserve: bigint;
  proof: Hex[];
  vaultLeafHash: Hex;
};

export type HubReportData = {
  root: Hex;
  refSlot: bigint;
  cid: string;
  timestamp: bigint;
};

export type VaultBaseInfo = {
  address: Address;
  vault: ReturnType<typeof getStakingVaultContract>;
  hub: ReturnType<typeof getVaultHubContract>;
  dashboard: ReturnType<typeof getDashboardContract>;
  operatorGrid: ReturnType<typeof getOperatorGridContract>;
  nodeOperator: Address;
  withdrawalCredentials: Hex;
  isReportFresh: boolean;
  isReportMissing: boolean;
  hubReport: HubReportData;
  report: VaultReportType | null;
} & VaultConnection;
