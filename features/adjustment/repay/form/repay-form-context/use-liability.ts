import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';

import { readWithReport, useVault } from 'modules/vaults';
import { useLidoSDK } from 'modules/web3';

export const useLiability = () => {
  const { shares, publicClient } = useLidoSDK();
  const { activeVault, queryKeys } = useVault();

  return useQuery({
    queryKey: [...queryKeys.state, 'vault-liability'],
    enabled: !!activeVault,
    queryFn: async () => {
      invariant(activeVault, '[useLiability]Active vault is not available');

      const [liabilityShares] = await readWithReport({
        publicClient,
        report: activeVault.report,
        contracts: [activeVault.dashboard.prepare.liabilityShares()] as const,
      });
      const liabilitySteth = await shares.convertToSteth(liabilityShares);

      return {
        liabilityWsteth: liabilityShares,
        liabilitySteth,
      };
    },
  });
};
