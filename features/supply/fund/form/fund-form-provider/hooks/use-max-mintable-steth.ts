import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';
import { usePublicClient } from 'wagmi';

import { getDashboardContract, useVaultInfo } from 'modules/vaults';
import { useLidoSDK } from 'modules/web3';

export const useMaxMintableSteth = (amount: bigint | undefined) => {
  const publicClient = usePublicClient();
  const { shares } = useLidoSDK();
  const { activeVault } = useVaultInfo();

  const enabled = !!activeVault && typeof amount === 'bigint';

  return useQuery({
    queryKey: [
      'max-mintable-steth-with-supply',
      activeVault?.owner,
      amount?.toString(),
    ],
    enabled: enabled,
    queryFn: async () => {
      invariant(publicClient, 'Public client is not defined');
      invariant(activeVault?.owner, 'Active vault owner is not defined');

      const dashboard = getDashboardContract(activeVault.owner, publicClient);
      const mintableShares = await dashboard.read.remainingMintingCapacity([
        amount ?? 0n,
      ]);
      const steth = await shares.convertToSteth(mintableShares);

      return steth;
    },
  });
};
