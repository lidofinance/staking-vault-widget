import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';

import { readWithReport, useVaultInfo } from 'modules/vaults';
import { useLidoSDK } from 'modules/web3';

export const useLiability = () => {
  const { shares, publicClient } = useLidoSDK();
  const { activeVault } = useVaultInfo();

  return useQuery({
    queryKey: ['vault-liability', activeVault?.address, publicClient.chain.id],
    enabled: !!activeVault?.address,
    queryFn: async () => {
      invariant(
        activeVault,
        '[useLiability]Active vault address is not available',
      );

      const [liabilityShares] = await readWithReport({
        publicClient,
        report: activeVault.report,
        contracts: [activeVault.dashboard.encode.liabilityShares()] as const,
      });
      const liabilitySteth = await shares.convertToSteth(liabilityShares);

      return {
        liabilityWsteth: liabilityShares,
        liabilitySteth,
      };
    },
  });
};
