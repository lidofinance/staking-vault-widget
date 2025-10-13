import type { Address } from 'viem';

import { CHAINS } from '@lidofinance/lido-ethereum-sdk/common';

import type { API_NAMES, CONTRACT_NAMES, NetworkConfig } from './const';

// Main deployments
import mainnetSet from 'networks/mainnet.json' assert { type: 'json' };
import hoodiSet from 'networks/hoodi.json' assert { type: 'json' };

// reexport types and const
export type { CONTRACT_NAMES, NetworkConfig } from './const';
export { CONTRACTS } from './const';

// Main deployments
const NETWORKS_MAP = {
  [CHAINS.Mainnet]: mainnetSet,
  [CHAINS.Hoodi]: hoodiSet,
} as Record<string, NetworkConfig>;

export const getNetworkConfig = (chain: CHAINS): NetworkConfig | undefined => {
  return NETWORKS_MAP[chain];
};

export const getContractAddress = (
  chain: CHAINS,
  contractName: CONTRACT_NAMES,
): Address | undefined => {
  const networkConfig = getNetworkConfig(chain);

  return networkConfig?.contracts?.[contractName];
};

export const getApiURL = (
  chain: CHAINS,
  apiName: API_NAMES,
): string | undefined => {
  const networkConfig = getNetworkConfig(chain);

  return networkConfig?.api?.[apiName];
};
