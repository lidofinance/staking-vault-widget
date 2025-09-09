import { useMemo } from 'react';

import {
  OverviewItem,
  OverviewSection,
  SectionData,
} from 'features/overview/inner';

import { useVaultOverview } from 'features/overview/vault-overview';

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

  const [totalValueData, netAprData] = useMemo(
    () => sectionPayloadList.map((item) => getVaultDataToRender(item)),
    [getVaultDataToRender],
  );

  return (
    <OverviewSection>
      <OverviewItem {...totalValueData} symbol="ETH">
        <TotalValueUsd />
      </OverviewItem>
      <OverviewItem {...netAprData}>
        <NetStakingRewards />
      </OverviewItem>
    </OverviewSection>
  );
};
