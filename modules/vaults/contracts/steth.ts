import invariant from 'tiny-invariant';
import { getContract } from 'viem';

import { LidoAbi } from '@lidofinance/lido-ethereum-sdk/core';
import { getContractAddress } from 'config';
import type { RegisteredPublicClient } from 'modules/web3';

import { getEncodable } from '../utils/encodable';

export const getStEthContract = (publicClient: RegisteredPublicClient) => {
  const address = getContractAddress(publicClient.chain.id, 'lido');

  invariant(address, '[getStEthContract] lido is not defined');

  return getEncodable(
    getContract({
      address,
      abi: LidoAbi,
      client: publicClient,
    }),
  );
};
