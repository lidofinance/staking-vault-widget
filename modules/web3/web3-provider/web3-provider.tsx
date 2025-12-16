import {
  createContext,
  useContext,
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { http, publicActions } from 'viem';
import { WagmiProvider, createConfig, useConnections, fallback } from 'wagmi';
import * as WagmiChains from 'wagmi/chains';

import { ReefKnotProvider, getDefaultConfig } from 'reef-knot/core-react';
import {
  ReefKnotWalletsModal,
  getDefaultWalletsModalConfig,
} from 'reef-knot/connect-wallet-modal';
import { WalletIdsEthereum, WalletsListEthereum } from 'reef-knot/wallets';

import { useThemeToggle } from '@lidofinance/lido-ui';

import { config } from 'config';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { useUserConfig } from 'config/user-config';
import { useGetRpcUrlByChainId } from 'config/rpc';
import { walletMetricProps } from 'consts/matomo-wallets-events';

import { SupportL1Chains } from './dapp-chain';
import { useWeb3Transport } from './use-web3-transport';

import type {
  ChainsList,
  MainnetConfig,
  MainnetPublicClient,
  RegisteredConfig,
} from '../types';
import { STRATEGY_LAZY } from 'consts/react-query-strategies';

const WALLETS_PINNED: WalletIdsEthereum[] = [
  'binanceWallet',
  'browserExtension',
];

export const wagmiChainMap = Object.values(WagmiChains).reduce(
  (acc, chain) => {
    acc[chain.id] = chain;
    return acc;
  },
  {} as Record<number, WagmiChains.Chain>,
);

type Web3ProviderContextValue = {
  mainnetConfig: MainnetConfig;
  publicClientMainnet: MainnetPublicClient;
};

const Web3ProviderContext = createContext<Web3ProviderContextValue | null>(
  null,
);
Web3ProviderContext.displayName = 'Web3ProviderContext';

export const useMainnetOnlyWagmi = () => {
  const value = useContext(Web3ProviderContext);
  invariant(value, 'useMainnetOnlyWagmi was used outside of Web3Provider');
  return value;
};

export const Web3Provider: FC<PropsWithChildren> = ({ children }) => {
  const {
    defaultChain: defaultChainId,
    supportedChainIds,
    walletconnectProjectId,
    isWalletConnectionAllowed,
  } = useUserConfig();
  const { themeName } = useThemeToggle();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            ...STRATEGY_LAZY,
            retry: 3,
          },
        },
      }),
  );

  const { supportedChains, defaultChain } = useMemo(() => {
    // must preserve order of supportedChainIds
    const supportedChains = supportedChainIds
      .map((id) => wagmiChainMap[id])
      .filter((chain) => chain) as unknown as ChainsList;

    const defaultChain = wagmiChainMap[defaultChainId] || supportedChains[0];

    return {
      supportedChains,
      defaultChain,
    };
  }, [defaultChainId, supportedChainIds]);

  const getRpcUrlByChainId = useGetRpcUrlByChainId();

  const backendRPC: Record<number, string> = useMemo(
    () =>
      supportedChainIds.reduce(
        (res, curr) => ({ ...res, [curr]: getRpcUrlByChainId(curr) }),
        {},
      ),
    [supportedChainIds, getRpcUrlByChainId],
  );
  const { transportMap, onActiveConnection } = useWeb3Transport(
    supportedChains,
    backendRPC,
  );

  // Separate wagmi config for readonly Mainnet (powers USD feeds, ENS and etc)
  const web3ProviderContextValue = useMemo(() => {
    const batchConfig = {
      wait: config.PROVIDER_BATCH_TIME,
      batchSize: config.PROVIDER_MAX_BATCH,
    };

    const rpcUrlMainnet = getRpcUrlByChainId(CHAINS.Mainnet);

    const mainnetConfig = createConfig({
      chains: [WagmiChains.mainnet],
      ssr: true,
      connectors: [],
      batch: {
        multicall: false,
      },
      pollingInterval: config.PROVIDER_POLLING_INTERVAL,
      transports: {
        [WagmiChains.mainnet.id]: fallback([
          // api/rpc
          http(rpcUrlMainnet, {
            batch: batchConfig,
            name: rpcUrlMainnet,
          }),
          // fallback rpc from wagmi.chains like cloudfare-eth
          http(undefined, {
            batch: batchConfig,
            name: 'default public RPC URL',
          }),
        ]),
      },
    });

    const publicClientMainnet = mainnetConfig
      .getClient({
        chainId: CHAINS.Mainnet,
      })
      .extend(publicActions) as MainnetPublicClient;

    return { mainnetConfig, publicClientMainnet };
  }, [getRpcUrlByChainId]);

  const { wagmiConfig, reefKnotConfig, walletsModalConfig } = useMemo(() => {
    return getDefaultConfig({
      // Reef-Knot config args
      rpc: backendRPC,
      defaultChain: defaultChain,
      walletconnectProjectId,
      walletsList: WalletsListEthereum,

      // Wagmi config args
      transports: transportMap,
      chains: supportedChains,
      autoConnect: isWalletConnectionAllowed,
      ssr: true,
      pollingInterval: config.PROVIDER_POLLING_INTERVAL,
      batch: {
        multicall: false,
      },

      // Wallets config args
      ...getDefaultWalletsModalConfig(),
      ...walletMetricProps,
      walletsPinned: WALLETS_PINNED,
    });
  }, [
    backendRPC,
    supportedChains,
    defaultChain,
    walletconnectProjectId,
    isWalletConnectionAllowed,
    transportMap,
  ]);

  const [activeConnection] = useConnections({ config: wagmiConfig });

  useEffect(() => {
    void onActiveConnection(activeConnection ?? null);
  }, [activeConnection, onActiveConnection]);

  return (
    <QueryClientProvider client={queryClient}>
      <Web3ProviderContext.Provider value={web3ProviderContextValue}>
        {/* default wagmi autoConnect, MUST be false in our case, because we use custom autoConnect from Reef Knot */}
        <WagmiProvider
          config={wagmiConfig as RegisteredConfig}
          reconnectOnMount={false}
        >
          <ReefKnotProvider config={reefKnotConfig}>
            <ReefKnotWalletsModal
              config={walletsModalConfig}
              darkThemeEnabled={themeName === 'dark'}
            />
            <SupportL1Chains>{children}</SupportL1Chains>
          </ReefKnotProvider>
        </WagmiProvider>
      </Web3ProviderContext.Provider>
    </QueryClientProvider>
  );
};
