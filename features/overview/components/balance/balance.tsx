import { useMemo } from 'react';

import { OverviewItem, OverviewSection } from 'features/overview/shared';
import { SectionData, useVaultOverview } from 'features/overview/contexts';

import { WithdrawalChart } from './withdrawal-chart';

const sectionPayloadList: SectionData[] = [
  {
    indicator: 'balanceEth',
    titleView: 'row',
    textSize: 'lg',
  },
  {
    indicator: 'withdrawableEth',
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
      <OverviewItem {...balanceData} />
      <OverviewItem {...withdrawableData}>
        <WithdrawalChart />
      </OverviewItem>
    </OverviewSection>
  );
};
