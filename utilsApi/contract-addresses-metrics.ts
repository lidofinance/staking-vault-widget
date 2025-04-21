import { CHAINS } from '@lidofinance/lido-ethereum-sdk/common';

import { config, CONTRACT_NAMES, CONTRACTS, getContractAddress } from 'config';

import type { Address, Abi } from 'viem';

// ABIs
import { LidoLocatorAbi } from '@lidofinance/lido-ethereum-sdk/core';
import { StethAbi } from '@lidofinance/lido-ethereum-sdk/stake';
import { WithdrawalQueueAbi } from '@lidofinance/lido-ethereum-sdk/withdraw';
import { WstethABI } from '@lidofinance/lido-ethereum-sdk/wrap';

import { AggregatorAbi } from 'abi/aggregator-abi';
import { ENSResolverAbi } from 'abi/ens-resolver-abi';
import { ENSRegistryAbi } from 'abi/ens-registry-abi';
import { VaultViewerAbi } from 'abi/vault-viewer';
import { PredepositGuaranteeAbi } from 'abi/predeposit-guarantee';
import { VaultHubAbi } from 'abi/vault-hub';
import { VaultFactoryAbi } from 'abi/vault-factory';

export const METRIC_CONTRACT_ABIS = {
  [CONTRACTS.lido]: StethAbi,
  [CONTRACTS.wsteth]: WstethABI,
  [CONTRACTS.withdrawalQueue]: WithdrawalQueueAbi,
  [CONTRACTS.aggregatorEthUsdPriceFeed]: AggregatorAbi,
  [CONTRACTS.lidoLocator]: LidoLocatorAbi,
  [CONTRACTS.ensPublicResolver]: ENSResolverAbi,
  [CONTRACTS.ensRegistry]: ENSRegistryAbi,
  [CONTRACTS.predepositGuarantee]: PredepositGuaranteeAbi,
  [CONTRACTS.vaultHub]: VaultHubAbi,
  [CONTRACTS.vaultFactory]: VaultFactoryAbi,
  [CONTRACTS.vaultViewer]: VaultViewerAbi,
} as const;

export type MetricContractName = CONTRACT_NAMES;

export const getMetricContractAbi = (
  contractName: MetricContractName,
): Abi | undefined => {
  return (METRIC_CONTRACT_ABIS as any)[contractName];
};

const supportedChainsWithMainnet: CHAINS[] = config.supportedChains.includes(
  CHAINS.Mainnet,
)
  ? config.supportedChains
  : [...config.supportedChains];

const CONTRACTS_WITH_EVENTS = [CONTRACTS.lido, CONTRACTS.wsteth];

const invertContractsNamesToAddress = (
  contractNames: CONTRACT_NAMES[],
  chainId: CHAINS,
) =>
  contractNames.reduce(
    (acc, contractName) => {
      const address = getContractAddress(chainId, contractName);
      if (address) {
        acc[address] = contractName;
      }
      return acc;
    },
    {} as Record<Address, CONTRACT_NAMES>,
  );

export const METRIC_CONTRACT_ADDRESSES = supportedChainsWithMainnet.reduce(
  (mapped, chainId) => {
    return {
      ...mapped,
      [chainId]: invertContractsNamesToAddress(
        Object.values(CONTRACTS),
        chainId,
      ),
    };
  },
  {} as Record<CHAINS, Record<Address, CONTRACT_NAMES>>,
);

export const METRIC_CONTRACT_EVENT_ADDRESSES =
  supportedChainsWithMainnet.reduce(
    (mapped, chainId) => {
      return {
        ...mapped,
        [chainId]: invertContractsNamesToAddress(
          Object.values(CONTRACTS_WITH_EVENTS),
          chainId,
        ),
      };
    },
    {} as Record<CHAINS, Record<Address, CONTRACT_NAMES>>,
  );
