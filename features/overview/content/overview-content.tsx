import { useVaultOverview } from 'features/overview/vault-overview';

import { Balance } from './balance';
import { Fees } from './fees';
import { Health } from './health';
import { StakingMetrics } from './staking-metrics';
import { Banners } from './banners';

import { SectionDivider } from '../shared';

export const OverviewContent = () => {
  const { isLoadingVault, values } = useVaultOverview();

  return (
    <>
      {(isLoadingVault || values?.isVaultConnected) && (
        <>
          <SectionDivider />
          <Banners />
          <StakingMetrics />
          <Health />
          <SectionDivider />
          <Balance />
          <SectionDivider />
          <Fees />
        </>
      )}
    </>
  );
};
