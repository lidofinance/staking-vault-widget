import { Address } from 'viem';
import { useQuery } from '@tanstack/react-query';

import { getVaultHubViewerContract } from 'modules/web3/contracts/vault-hub-viewer';
import { STRATEGY_LAZY } from 'consts/react-query-strategies';

export const useVaultsConnected = () => {
  const vaultHubViewer = getVaultHubViewerContract();

  return useQuery({
    queryKey: ['use-vaults-connected'],
    enabled: !!vaultHubViewer,
    ...STRATEGY_LAZY,
    queryFn: async () => {
      return (await vaultHubViewer.read.vaultsConnected()) as Address[];
    },
  });
};
