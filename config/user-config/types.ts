import { CHAINS } from '@lidofinance/lido-ethereum-sdk/common';

export type UserConfigDefaultType = {
  defaultChain: number;
  supportedChainIds: number[];
  prefillUnsafeElRpcUrls: Record<CHAINS, string[]>;
  walletconnectProjectId: string | undefined;
};
