import invariant from 'tiny-invariant';
import getConfigNext from 'next/config';
import type { Address } from 'viem';

import { CHAINS } from '@lidofinance/lido-ethereum-sdk/common';

import { getPreConfig } from 'config/get-preconfig';
import type { CONTRACT_NAMES, NetworkConfig } from './const';

// Main deployments
import hoodiSet from 'networks/hoodi.json' assert { type: 'json' };
import sepoliaSet from 'networks/sepolia.json' assert { type: 'json' };

// Devnet deployments
import hoodiDevnet0Set from 'networks/hoodi-devnet-0.json' assert { type: 'json' };
import sepoliaDevnet5Set from 'networks/sepolia-devnet-5.json' assert { type: 'json' };

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
  'sepolia-devnet-5': sepoliaDevnet5Set as NetworkConfig,
  'hoodi-devnet-0': hoodiDevnet0Set as NetworkConfig,
} as Record<string, NetworkConfig>;

// Main deployments
const NETWORKS_MAP = {
  [CHAINS.Hoodi]: hoodiSet as NetworkConfig,
  [CHAINS.Sepolia]: sepoliaSet as NetworkConfig,
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
