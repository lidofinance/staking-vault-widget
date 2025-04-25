import { useMemo } from 'react';
import { getContract } from 'viem';
import invariant from 'tiny-invariant';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { useQuery } from '@tanstack/react-query';

import { AggregatorAbi } from 'abi/aggregator-abi';
import { STRATEGY_LAZY } from 'consts/react-query-strategies';
import { useMainnetOnlyWagmi } from 'modules/web3';
import { getContractAddress } from 'config';

export const useEthUsd = (amount?: bigint) => {
  const { publicClientMainnet } = useMainnetOnlyWagmi();
  const address = getContractAddress(
    CHAINS.Mainnet,
    'aggregatorEthUsdPriceFeed',
  );

  const {
    data: price,
    error,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['eth-usd-price', publicClientMainnet, address],
    enabled: !!(publicClientMainnet && address),
    ...STRATEGY_LAZY,
    // the async is needed here because the decimals will be requested soon
    queryFn: async () => {
      invariant(address, '[useEthUsd] aggregator address is not defined');

      const contract = getContract({
        address,
        abi: AggregatorAbi,
        client: {
          public: publicClientMainnet,
        },
      });

      const [latestAnswer, decimals] = await Promise.all([
        contract.read.latestAnswer(),
        contract.read.decimals(),
      ]);

      return latestAnswer / 10n ** BigInt(decimals);
    },
  });

  const usdAmount = useMemo(() => {
    if (price && amount) {
      // There is no need for absolute precision here
      const txCostInEth = Number(amount) / 10 ** 18;
      return txCostInEth * Number(price);
    }
    return undefined;
  }, [amount, price]);

  return {
    usdAmount,
    price,
    isLoading,
    error,
    isFetching,
    update: refetch,
  };
};
