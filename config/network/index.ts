import invariant from 'tiny-invariant';
import getConfigNext from 'next/config';
import type { Address } from 'viem';

import { CHAINS } from '@lidofinance/lido-ethereum-sdk/common';

import { getPreConfig } from 'config/get-preconfig';

import type { API_NAMES, CONTRACT_NAMES, NetworkConfig } from './const';

// Main deployments
import mainnetSet from 'networks/mainnet.json';
// Public
import hoodiSet from 'networks/hoodi.json';

// reexport types and const
export type { CONTRACT_NAMES, NetworkConfig } from './const';
export { CONTRACTS } from './const';

const { serverRuntimeConfig } = getConfigNext();

const DEVNET_OVERRIDES: Record<number, string> = // Merge client&server values
  (serverRuntimeConfig.devnetOverrides || getPreConfig().devnetOverrides || '')
    .split(',')
    .reduce(
      (acc, override) => {
        const [chainId, setName] = override.split(':');
        if (!isNaN(Number(chainId)) && setName) {
          acc[Number(chainId)] = setName;
        }
        return acc;
      },
      {} as Record<number, string>,
    );

// Devnet deployments
const DEVNETS_MAP = {
  hoodi: hoodiSet,
} as Record<string, NetworkConfig>;

// Main deployments
const NETWORKS_MAP = {
  [CHAINS.Mainnet]: mainnetSet,
  [CHAINS.Hoodi]: hoodiSet,
} as Record<string, NetworkConfig>;

export const getNetworkConfig = (chain: CHAINS): NetworkConfig | undefined => {
  const overridedSetName = DEVNET_OVERRIDES[chain];

  if (overridedSetName) {
    invariant(
      overridedSetName in DEVNETS_MAP,
      `DEVNETS_MAP doesn't contain the override set "${overridedSetName}" for chainId: ${chain}`,
    );
    return DEVNETS_MAP[overridedSetName];
  }

  return NETWORKS_MAP[chain];
};

export const getContractAddress = (
  chain: CHAINS,
  contractName: CONTRACT_NAMES,
): Address | undefined => {
  const networkConfig = getNetworkConfig(chain);

  return networkConfig?.contracts?.[contractName];
};

export const getApiURL = (apiName: API_NAMES): string | undefined => {
  return getPreConfig()[apiName];
};
