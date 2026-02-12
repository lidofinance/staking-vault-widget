import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';

import { useLidoSDK } from 'modules/web3';
import { isBigint } from 'utils';

import { useVault } from '../vault-context';
import { readWithReport } from '../report';
import { getStEthContract } from '../contracts';

export type MaxMintableResult = {
  maxMintableStETH: bigint;
  maxMintableShares: bigint;
};

export const useMaxMintable = (amount?: bigint | null) => {
  const { publicClient } = useLidoSDK();
  const { activeVault, queryKeys } = useVault();

  const enabled = !!activeVault && isBigint(amount);

  return useQuery<MaxMintableResult>({
    queryKey: [
      ...queryKeys.state,
      'max-mintable-steth-with-supply',
      { supply: amount?.toString() },
    ],
    enabled: enabled,
    queryFn: async () => {
      invariant(
        activeVault,
        '[useMaxMintableSteth] Active vault owner is not defined',
      );

      invariant(isBigint(amount), '[useMaxMintable] Amount must be a bigint');

      const [maxMintableShares] = await readWithReport({
        publicClient,
        lazyOracle: activeVault.lazyOracle,
        report: activeVault.report,
        isReportFresh: activeVault.isReportFresh,
        contracts: [
          activeVault.dashboard.prepare.remainingMintingCapacityShares([
            amount,
          ]),
        ] as const,
      });

      const stethContract = getStEthContract(publicClient);
      const maxMintableStETH =
        maxMintableShares === 0n
          ? 0n
          : await stethContract.read.getPooledEthByShares([maxMintableShares]);

      return { maxMintableStETH, maxMintableShares };
    },
  });
};
