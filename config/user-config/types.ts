import { CHAINS } from 'consts/chains';

export type UserConfigDefaultType = {
  defaultChain: number;
  supportedChainIds: number[];
  prefillUnsafeElRpcUrls: Record<CHAINS, string[]>;
  walletconnectProjectId: string | undefined;
};
