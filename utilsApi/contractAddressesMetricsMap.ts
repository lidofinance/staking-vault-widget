import { Abi } from 'viem';
import type { Address } from 'viem';
import { invert, isNull, memoize, omitBy } from 'lodash';
import { StethAbi } from '@lidofinance/lido-ethereum-sdk/stake';
import { WstethABI } from '@lidofinance/lido-ethereum-sdk/wrap';

import {
  LIDO_LOCATOR_BY_CHAIN,
  LIDO_TOKENS,
  CHAINS,
} from '@lidofinance/lido-ethereum-sdk/common';
import { LidoLocatorAbi } from '@lidofinance/lido-ethereum-sdk/core';

import { AggregatorAbi } from 'abi/aggregator-abi';

import { config } from 'config';
import { getTokenAddress } from 'consts/token-addresses';
import { AGGREGATOR_STETH_USD_PRICE_FEED_BY_NETWORK } from 'consts/aggregator';

export const CONTRACT_NAMES = {
  aggregator: 'aggregator',
  aggregatorStEthUsdPriceFeed: 'aggregatorStEthUsdPriceFeed',
  lidoLocator: 'lidoLocator',
  wsteth: 'wsteth',
  lido: 'lido',
} as const;
export type CONTRACT_NAMES = keyof typeof CONTRACT_NAMES;

export const METRIC_CONTRACT_ABIS = {
  [CONTRACT_NAMES.aggregator]: AggregatorAbi,
  [CONTRACT_NAMES.aggregatorStEthUsdPriceFeed]: AggregatorAbi,
  [CONTRACT_NAMES.lidoLocator]: LidoLocatorAbi,
  [CONTRACT_NAMES.lido]: StethAbi,
  [CONTRACT_NAMES.wsteth]: WstethABI,
} as const;

export const getMetricContractAbi = memoize(
  (contractName: CONTRACT_NAMES): Abi => {
    return METRIC_CONTRACT_ABIS[contractName];
  },
);

const supportedChainsWithMainnet: CHAINS[] = config.supportedChains.includes(
  CHAINS.Mainnet,
)
  ? config.supportedChains
  : [...config.supportedChains, CHAINS.Mainnet];

export const METRIC_CONTRACT_ADDRESSES = supportedChainsWithMainnet.reduce(
  (mapped, chainId) => {
    const map = {
      [CONTRACT_NAMES.lido]:
        getTokenAddress(chainId, LIDO_TOKENS.steth) ?? null,
      [CONTRACT_NAMES.wsteth]:
        getTokenAddress(chainId, LIDO_TOKENS.wsteth) ?? null,
      [CONTRACT_NAMES.aggregator]:
        AGGREGATOR_STETH_USD_PRICE_FEED_BY_NETWORK[chainId] ?? null,
      [CONTRACT_NAMES.aggregatorStEthUsdPriceFeed]:
        AGGREGATOR_STETH_USD_PRICE_FEED_BY_NETWORK[chainId] ?? null,
      [CONTRACT_NAMES.lidoLocator]: LIDO_LOCATOR_BY_CHAIN[chainId] ?? null,
    };
    return {
      ...mapped,
      [chainId]: invert(omitBy(map, isNull)),
    };
  },
  {} as Record<CHAINS, Record<Address, CONTRACT_NAMES>>,
);

export const METRIC_CONTRACT_EVENT_ADDRESSES =
  supportedChainsWithMainnet.reduce(
    (mapped, chainId) => {
      const map = {
        [CONTRACT_NAMES.lido]:
          getTokenAddress(chainId, LIDO_TOKENS.steth) ?? null,
        [CONTRACT_NAMES.wsteth]:
          getTokenAddress(chainId, LIDO_TOKENS.wsteth) ?? null,
      };
      return {
        ...mapped,
        [chainId]: invert(omitBy(map, isNull)),
      };
    },
    {} as Record<CHAINS, Record<Address, CONTRACT_NAMES>>,
  );
