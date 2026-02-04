import type { Address, Hex, ReadContractReturnType } from 'viem';
import type { RegisteredPublicClient } from '../web3';
import type { Confirmation } from '../../utils/get-confirmations';
import {
  LidoSDKVaultContracts,
  LidoSDKVaultEntity,
} from '@lidofinance/lido-ethereum-sdk';
import { VaultHubAbi } from '@lidofinance/lido-ethereum-sdk/stvault';

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
  vaultEntity: LidoSDKVaultEntity;
  blockNumber: bigint;
  blockNumberString: string;
  reportLiabilityShares: bigint;
  address: Address;
  vault: Awaited<ReturnType<LidoSDKVaultContracts['getContractVault']>>;
  hub: Awaited<ReturnType<LidoSDKVaultContracts['getContractVaultHub']>>;
  dashboard: Awaited<
    ReturnType<LidoSDKVaultContracts['getContractVaultDashboard']>
  >;
  operatorGrid: Awaited<
    ReturnType<LidoSDKVaultContracts['getContractOperatorGrid']>
  >;
  lazyOracle: Awaited<
    ReturnType<LidoSDKVaultContracts['getContractLazyOracle']>
  >;
  predepositGuarantee: Awaited<
    ReturnType<LidoSDKVaultContracts['getContractPredepositGuarantee']>
  >;
  nodeOperator: Address;
  vaultOwner: Address;
  withdrawalCredentials: Hex;
  isReportFresh: boolean;
  isReportMissing: boolean;
  hubReport: HubReportData;
  report: VaultReportType | null;
  isVaultDisconnected: boolean; // disconnected by user
  isVaultConnected: boolean;
  isPendingDisconnect: boolean;
  isPendingConnect: boolean;
  isReportAvailable: boolean;
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
