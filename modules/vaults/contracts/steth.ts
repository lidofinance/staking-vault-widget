import invariant from 'tiny-invariant';
import { getContract } from 'viem';

import { StETHPartialAbi } from 'abi/steth-partial-abi';
import { getContractAddress } from 'config';
import type { RegisteredPublicClient } from 'modules/web3';

import { getEncodable } from '../utils/encodable';

export const getStEthContract = (publicClient: RegisteredPublicClient) => {
  const address = getContractAddress(publicClient.chain.id, 'steth');

  invariant(address, '[getStEthContract] lido is not defined');

  return getEncodable(
    getContract({
      address,
      abi: StETHPartialAbi,
      client: publicClient,
    }),
  );
};
