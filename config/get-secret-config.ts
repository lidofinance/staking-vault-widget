import getConfigNext from 'next/config';
import { type Modify, toBoolean } from './helpers';

const { serverRuntimeConfig } = getConfigNext();

export type SecretConfigType = Modify<
  typeof serverRuntimeConfig,
  {
    defaultChain: number;
    supportedChains: number[];
    // Dynamic keys like rpcUrls_<number>
    [key: `rpcUrls_${number}`]: [string, ...string[]];

    cspReportOnly: boolean;

    runStartupChecks: boolean;

    rateLimit: number;
    rateLimitTimeFrame: number;
  }
>;

// 'getSecretConfig()' is required for the backend side.
// We can't merge with 'getPreConfig()' because we want to split responsibility
//
// Also you can note that 'getSecretConfig' is just a proxy for 'serverRuntimeConfig'
// because we want similar approach with 'getConfig'
export const getSecretConfig = (): SecretConfigType => {
  const supportedChains = (
    serverRuntimeConfig.supportedChains?.split(',') ?? []
  ).map((chainId: string) => Number(chainId));

  return {
    ...serverRuntimeConfig,

    defaultChain: Number(serverRuntimeConfig.defaultChain) || 560048,
    supportedChains,

    // map dynamic rpc url envs per supported chains (with mainnet included)
    ...[1, ...supportedChains].reduce(
      (acc, chainId) => {
        const rpcUrls =
          serverRuntimeConfig[`rpcUrls_${chainId}`]?.split(',') ?? [];
        acc[`rpcUrls_${chainId}`] = rpcUrls as [string, ...string[]];
        return acc;
      },
      {} as Record<string, [string, ...string[]]>,
    ),

    cspReportOnly: toBoolean(serverRuntimeConfig.cspReportOnly),
    runStartupChecks: toBoolean(serverRuntimeConfig.runStartupChecks),
    rateLimit: Number(serverRuntimeConfig.rateLimit) || 100,
    rateLimitTimeFrame: Number(serverRuntimeConfig.rateLimitTimeFrame) || 60, // 1 minute;
  };
};

export const secretConfig = getSecretConfig();
