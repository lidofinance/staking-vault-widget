import React, { createContext, useContext, useMemo } from 'react';
import invariant from 'tiny-invariant';

import { useAccount } from 'wagmi';
import { config } from 'config';

import { wagmiChainMap } from './web3-provider';
import { LidoSDKProvider } from './lido-sdk';

type DappChainContextValue = {
  supportedChainIds: number[];
  isChainTypeMatched: boolean;
};

export type SupportedChainLabels = {
  [key: string]: string;
};

type UseDappChainValue = {
  chainId: number;
  isSupportedChain: boolean;
  supportedChainLabels: SupportedChainLabels;
} & DappChainContextValue;

const DappChainContext = createContext<DappChainContextValue | null>(null);
DappChainContext.displayName = 'DappChainContext';

const getChainLabelById = (chainId: number) => {
  const chain = wagmiChainMap[chainId];
  return chain ? chain.name : '';
};

export const useDappChain = (): UseDappChainValue => {
  const context = useContext(DappChainContext);
  invariant(context, 'useDappChain was used outside of DappChainProvider');
  const { chainId: walletChain } = useAccount();

  return useMemo(() => {
    const supportedChainLabels = context.supportedChainIds.reduce(
      (acc, chainId) => ({
        ...acc,
        [chainId]: getChainLabelById(chainId),
      }),
      {},
    ) as SupportedChainLabels;

    return {
      ...context,
      chainId:
        walletChain && context.supportedChainIds.includes(walletChain)
          ? walletChain
          : config.defaultChain,
      isSupportedChain: walletChain
        ? context.supportedChainIds.includes(walletChain)
        : true,
      supportedChainLabels,
    };
  }, [context, walletChain]);
};

export const SupportL1Chains: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { chainId } = useAccount();

  return (
    <DappChainContext.Provider
      value={useMemo(
        () => ({
          supportedChainIds: config.supportedChains,
          isChainTypeMatched: chainId
            ? config.supportedChains.includes(chainId)
            : false,
        }),
        [chainId],
      )}
    >
      <LidoSDKProvider>{children}</LidoSDKProvider>
    </DappChainContext.Provider>
  );
};
