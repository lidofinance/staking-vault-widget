import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';

import { useLidoSDK } from 'modules/web3';

import { useVault } from '../vault-context';
import { readWithReport } from '../report';
import { getLidoV3Contract } from '../contracts';

export type MaxMintableResult = {
  maxMintableStETH: bigint;
  maxMintableShares: bigint;
};

export const useMaxMintable = (amount?: bigint | null) => {
  const { publicClient } = useLidoSDK();
  const { activeVault, queryKeys } = useVault();

  const enabled = !!activeVault && typeof amount === 'bigint';

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

      invariant(
        typeof amount === 'bigint',
        '[useMaxMintable] Amount must be a bigint',
      );

      const [maxMintableShares] = await readWithReport({
        publicClient,
        report: activeVault.report,
        contracts: [
          activeVault.dashboard.prepare.remainingMintingCapacityShares([
            amount,
          ]),
        ] as const,
      });

      const lidoV3Contract = getLidoV3Contract(publicClient);
      const maxMintableStETH =
        maxMintableShares === 0n
          ? 0n
          : await lidoV3Contract.read.getPooledEthBySharesRoundUp([
              maxMintableShares,
            ]);

      return { maxMintableStETH, maxMintableShares };
    },
  });
};
