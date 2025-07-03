import { OverviewItem, OverviewSection } from 'features/overview/shared';
import {
  useVaultOverview,
  SectionData,
} from 'features/overview/contexts/vault-overview';

import { TotalValueUsd } from './total-value-usd';
import { NetStakingRewards } from './net-staking-rewards';

const sectionPayloadList: SectionData[] = [
  {
    indicator: 'totalValue',
  },
  {
    indicator: 'netApr',
  },
];

export const StakingMetrics = () => {
  const { getVaultDataToRender } = useVaultOverview();

  const [totalValueData, netAprData] = sectionPayloadList.map((item) =>
    getVaultDataToRender(item),
  );

  return (
    <OverviewSection>
      <OverviewItem {...totalValueData}>
        <TotalValueUsd />
      </OverviewItem>
      <OverviewItem {...netAprData}>
        <NetStakingRewards />
      </OverviewItem>
    </OverviewSection>
  );
};
