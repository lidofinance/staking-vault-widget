import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';

import { useVault } from 'modules/vaults';

// on-chain quarantine state and total value without applying the pending report;
// overview values are simulated with the report, so the expired
// quarantine is already released there
export const useOnchainQuarantine = () => {
  const { activeVault, queryKeys } = useVault();

  return useQuery({
    queryKey: [...queryKeys.state, 'onchain-quarantine'] as const,
    enabled:
      !!activeVault &&
      !activeVault.isReportFresh &&
      activeVault.isReportAvailable,
    queryFn: async () => {
      invariant(activeVault, '[useOnchainQuarantine] activeVault is undefined');
      const { lazyOracle, hub, address, blockNumber } = activeVault;

      const [quarantine, totalValue] = await Promise.all([
        lazyOracle.read.vaultQuarantine([address], { blockNumber }),
        hub.read.totalValue([address], { blockNumber }),
      ]);

      return { quarantine, totalValue };
    },
  });
};
