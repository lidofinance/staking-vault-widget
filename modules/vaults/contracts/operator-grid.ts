import { getContract } from 'viem';

import { OperatorGridAbi } from 'abi/operator-grid';
import { getContractAddress } from 'config';
import invariant from 'tiny-invariant';

import type {
  RegisteredPublicClient,
  RegisteredWalletClient,
} from 'modules/web3';
import { getEncodable } from 'modules/vaults/utils/encodable';

// TODO: move to lido-sdk
export const getOperatorGridContract = (
  publicClient: RegisteredPublicClient,
) => {
  const address = getContractAddress(publicClient.chain.id, 'operatorGrid');

  invariant(address, '[getOperatorGridContract] operatorGrid is not defined');
  return getEncodable(
    getContract({
      address,
      abi: OperatorGridAbi,
      client: {
        public: publicClient,
      },
    }),
  );
};

export const getWritableOperatorGridContract = <
  TClient extends RegisteredPublicClient,
  TWallet extends RegisteredWalletClient,
>(
  publicClient: TClient,
  walletClient: TWallet,
) => {
  const address = getContractAddress(publicClient.chain.id, 'operatorGrid');

  invariant(
    address,
    '[getWritableOperatorGridContract] operatorGrid is not defined',
  );
  return getContract({
    address,
    abi: OperatorGridAbi,
    client: {
      public: publicClient,
      wallet: walletClient,
    },
  });
};
