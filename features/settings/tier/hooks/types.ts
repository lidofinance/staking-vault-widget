import type { LidoSDKShares } from '@lidofinance/lido-ethereum-sdk/shares';
import type { Address } from 'viem';

import { type RegisteredPublicClient } from 'modules/web3';
import { type VaultBaseInfo } from 'modules/vaults';
import { type Confirmation } from 'utils/get-confirmations';

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
};

export type VaultTierInfoArgs = {
  publicClient: RegisteredPublicClient;
  vault: VaultBaseInfo;
  shares: LidoSDKShares;
};

export type VaultTierInfo = {
  lidoTVLSharesLimit: bigint;
  isVaultConnected: boolean;
  address: Address;
  owner: Address;
  nodeOperator: Address;
  vault: TierVault;
  tier: Tier;
  proposals: {
    confirmExpiry: bigint;
    lastProposal: Confirmation;
    proposedVaultLimitStETH: bigint;
    proposedVaultLimit: bigint;
  };
};

export type NodeOperatorTierInfoArgs = {
  vault: VaultBaseInfo;
  shares: LidoSDKShares;
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
