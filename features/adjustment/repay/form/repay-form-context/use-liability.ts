import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';
import { usePublicClient } from 'wagmi';

import { getDashboardContract, useVaultInfo } from 'modules/vaults';
import { useLidoSDK } from 'modules/web3';

export const useLiability = () => {
  const { shares } = useLidoSDK();
  const publicClient = usePublicClient();
  const { activeVault } = useVaultInfo();

  return useQuery({
    queryKey: ['vault-liability', activeVault?.address, publicClient?.chain.id],
    enabled: !!activeVault?.address,
    queryFn: async () => {
      invariant(publicClient, '[useLiability]Public client is not available');
      invariant(
        activeVault?.address,
        '[useLiability]Active vault address is not available',
      );
      const vault = getDashboardContract(activeVault?.owner, publicClient);
      const liabilityShares = await vault.read.liabilityShares();
      const liabilitySteth = await shares.convertToSteth(liabilityShares);

      return {
        liabilityWsteth: liabilityShares,
        liabilitySteth,
      };
    },
  });
};
