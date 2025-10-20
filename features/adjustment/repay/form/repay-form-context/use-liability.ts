import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';

import { getStEthContract, readWithReport, useVault } from 'modules/vaults';
import { useLidoSDK } from 'modules/web3';

export const useLiability = () => {
  const { publicClient } = useLidoSDK();
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

      const stethContract = getStEthContract(publicClient);
      const liabilitySteth =
        await stethContract.read.getPooledEthBySharesRoundUp([liabilityShares]);

      return {
        liabilityWsteth: liabilityShares,
        liabilitySteth,
      };
    },
  });
};
