import { useMemo } from 'react';

import { useVaultTierInfo } from 'modules/vaults';

export const useTierVoting = () => {
  // const { data: noTiersInfo } = useNodeOperatorTiersInfo();
  const { data: vaultTierInfo } = useVaultTierInfo();

  return useMemo(() => {
    const proposal = vaultTierInfo?.proposals.lastProposal;

    // console.log('useTierVoting::proposals', vaultTierInfo?.proposals);
    // console.log('useTierVoting::noTiersInfo', noTiersInfo);

    return { proposal };
  }, [vaultTierInfo]);
};
