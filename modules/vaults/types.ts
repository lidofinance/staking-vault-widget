import type {
  Address,
  Hex,
  ReadContractReturnType,
  ContractFunctionReturnType,
} from 'viem';
import type {
  LidoSDKVaultContracts,
  LidoSDKVaultEntity,
} from '@lidofinance/lido-ethereum-sdk/stvault';
import { VaultHubAbi } from '@lidofinance/lido-ethereum-sdk/stvault';

import type { RegisteredPublicClient } from '../web3';
import type { Confirmation } from '../../utils/get-confirmations';
import { PDG_POLICY } from './consts';

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

export type PredepositGuarantee = Awaited<
  ReturnType<LidoSDKVaultContracts['getContractPredepositGuarantee']>
>;
export type OperatorGrid = Awaited<
  ReturnType<LidoSDKVaultContracts['getContractOperatorGrid']>
>;
export type Dashboard = Awaited<
  ReturnType<LidoSDKVaultContracts['getContractVaultDashboard']>
>;
export type Vault = Awaited<
  ReturnType<LidoSDKVaultContracts['getContractVault']>
>;
export type LazyOracle = Awaited<
  ReturnType<LidoSDKVaultContracts['getContractLazyOracle']>
>;
export type VaultHub = Awaited<
  ReturnType<LidoSDKVaultContracts['getContractVaultHub']>
>;

export type VaultBaseInfo = {
  vaultEntity: LidoSDKVaultEntity;
  blockNumber: bigint;
  address: Address;
  vault: Vault;
  hub: VaultHub;
  dashboard: Dashboard;
  operatorGrid: OperatorGrid;
  lazyOracle: LazyOracle;
  predepositGuarantee: PredepositGuarantee;
  group: ContractFunctionReturnType<OperatorGrid['abi'], 'view', 'group'>;
  nodeOperator: Address;
  vaultOwner: Address;
  pendingOwner: Address;
  withdrawalCredentials: Hex;
  isReportFresh: boolean;
  isReportMissing: boolean;
  hubReport: HubReportData;
  report: VaultReportType | null;
  isVaultDisconnected: boolean;
  isVaultFullDisconnected: boolean;
  isVaultConnected: boolean;
  isPendingDisconnect: boolean;
  isPendingConnect: boolean;
  isReportAvailable: boolean;
  hasPendingOwner: boolean;
} & VaultConnection;

export type Tier = {
  id: bigint;
  tierName: string;
  shareLimit: bigint;
  shareLimitStETH: bigint;
  liabilityShares: bigint;
  liabilityStETH: bigint;
  operator: Address;
  reserveRatioBP: number;
  forcedRebalanceThresholdBP: number;
  infraFeeBP: number;
  liquidityFeeBP: number;
  reservationFeeBP: number;
};

export type TierVault = {
  tierId: bigint;
  totalValue: bigint;
  shareLimit: bigint;
  stETHLimit: bigint;
  liabilityStETH: bigint;
  mintableStETH: bigint;
  totalMintingCapacityStETH: bigint;
  totalMintingCapacityShares: bigint;
  reserveRatioBP: number;
  forcedRebalanceThresholdBP: number;
  infraFeeBP: number;
  liquidityFeeBP: number;
  reservationFeeBP: number;
  isPendingConnect: boolean;
};

export type VaultTierInfoArgs = {
  publicClient: RegisteredPublicClient;
  vault: VaultBaseInfo;
};

export type TierConfirmationFnNames =
  | 'changeTier'
  | 'updateVaultShareLimit'
  | 'syncTier';

export type ExtendTierConfirmation =
  | {
      _id: string;
      vaultAddress: Address;
      member: Address;
      expiryTimestamp: bigint;
      expiryDate: Date;
      tierId: bigint;
      functionName: Extract<
        'changeTier' | 'updateVaultShareLimit',
        TierConfirmationFnNames
      >;
      proposedVaultLimitStETH: bigint;
      proposedVaultLimitShares: bigint;
    }
  | {
      _id: string;
      vaultAddress: Address;
      member: Address;
      expiryTimestamp: bigint;
      expiryDate: Date;
      tierId: bigint;
      functionName: Extract<'syncTier', TierConfirmationFnNames>;
      proposedVaultLimitStETH: undefined;
      proposedVaultLimitShares: undefined;
    };

export type VaultTierInfo = {
  lidoTVLSharesLimit: bigint;
  minimalReserve: bigint;
  isVaultConnected: boolean;
  address: Address;
  owner: Address;
  nodeOperator: Address;
  vault: TierVault;
  tier: Tier;
  proposals: {
    confirmExpiry: bigint;
    lastProposal: Confirmation<TierConfirmationFnNames> | undefined;
    extendLastProposal: ExtendTierConfirmation | undefined;
    proposedVaultLimitStETH: bigint;
    proposedVaultLimitShares: bigint;
  };
};

export type NodeOperatorTierInfoArgs = {
  vault: VaultBaseInfo;
  publicClient: RegisteredPublicClient;
};

export type NodeOperatorTiersInfo = {
  group: {
    nodeOperator: Address;
    shareLimit: bigint;
    stEthLimit: bigint;
    liabilityShares: bigint;
    liabilityStETH: bigint;
  };
  tiers: Tier[];
};

export type PDGOptions = keyof typeof PDG_POLICY;
