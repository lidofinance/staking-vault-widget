import invariant from 'tiny-invariant';
import { getContract } from 'viem';

import { LidoPartialAbi } from 'abi/lido-partial-abi';
import { getContractAddress } from 'config';
import type { RegisteredPublicClient } from 'modules/web3';

import { getEncodable } from '../utils/encodable';

export const getLidoContract = (publicClient: RegisteredPublicClient) => {
  const address = getContractAddress(publicClient.chain.id, 'lido');

  invariant(address, '[getLidoContract] lido is not defined');

  return getEncodable(
    getContract({
      address,
      abi: LidoPartialAbi,
      client: publicClient,
    }),
  );
};
