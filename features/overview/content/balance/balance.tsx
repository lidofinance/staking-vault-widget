import { useMemo } from 'react';

import {
  OverviewItem,
  OverviewSection,
  SectionData,
} from 'features/overview/inner';

import { useVaultOverview } from 'features/overview/vault-overview';

import { WithdrawalChart } from './withdrawal-chart';

const sectionPayloadList: SectionData[] = [
  {
    indicator: 'balance',
    titleView: 'row',
    textSize: 'lg',
  },
  {
    indicator: 'withdrawableEther',
    titleView: 'row',
    textSize: 'lg',
  },
];

export const Balance = () => {
  const { getVaultDataToRender } = useVaultOverview();
  const [balanceData, withdrawableData] = useMemo(
    () =>
      sectionPayloadList.map((sectionItem) =>
        getVaultDataToRender(sectionItem),
      ),
    [getVaultDataToRender],
  );

  return (
    <OverviewSection>
      <OverviewItem symbol="ETH" {...balanceData} />
      <OverviewItem symbol="ETH" {...withdrawableData}>
        <WithdrawalChart />
      </OverviewItem>
    </OverviewSection>
  );
};
