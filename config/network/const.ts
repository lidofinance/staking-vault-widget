import type { Address } from 'viem';

// For future overrides of APIs in devnets
export const API_NAMES = {};

const CONTRACT_LIST = [
  'lido',
  'wsteth',
  'lidoLocator',
  'withdrawalQueue',
  'stakingRouter',
  'aggregatorEthUsdPriceFeed',
  'ensPublicResolver',
  'ensRegistry',
  'predepositGuarantee',
  'vaultHub',
  'vaultFactory',
  'vaultViewer',
  'operatorGrid',
  'weth',
] as const;

export const CONTRACTS = Object.fromEntries(
  CONTRACT_LIST.map((contract) => [contract, contract]),
) as { [key in (typeof CONTRACT_LIST)[number]]: key };

export type CONTRACT_NAMES = (typeof CONTRACT_LIST)[number];

export type NetworkConfig = {
  api: {
    [K in keyof typeof API_NAMES]?: string;
  };
  contracts: {
    [K in keyof typeof CONTRACTS]?: Address;
  };
};
