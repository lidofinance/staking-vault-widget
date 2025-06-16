import invariant from 'tiny-invariant';
import { getContract, PublicClient, WalletClient } from 'viem';

import { getContractAddress } from 'config';

import { LazyOracleAbi } from 'abi/lazy-oracle';

export const getLazyOracleContract = <TClient extends PublicClient>(
  publicClient: TClient,
) => {
  invariant(
    publicClient.chain?.id,
    '[getLazyOracleContract] chainId is not defined',
  );

  const address = getContractAddress(publicClient.chain.id, 'lazyOracle');

  invariant(address, '[getLazyOracleContract] lazyOracle is not defined');
  return getContract({
    address,
    abi: LazyOracleAbi,
    client: {
      public: publicClient,
    },
  });
};

export const getWritableLazyOracleContract = <
  TClient extends PublicClient,
  TWallet extends WalletClient,
>(
  publicClient: TClient,
  walletClient: TWallet,
) => {
  invariant(
    publicClient.chain?.id,
    '[getWritableLazyOracleContract] chainId is not defined',
  );

  const address = getContractAddress(publicClient.chain.id, 'lazyOracle');

  invariant(
    address,
    '[getWritableLazyOracleContract] lazyOracle is not defined',
  );
  return getContract({
    address,
    abi: LazyOracleAbi,
    client: {
      public: publicClient,
      wallet: walletClient,
    },
  });
};
