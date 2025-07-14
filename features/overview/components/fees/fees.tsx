import { useMemo } from 'react';

import { OverviewItem, OverviewSection } from 'features/overview/shared';
import { SectionData, useVaultOverview } from 'features/overview/contexts';

const sectionPayloadList: SectionData[] = [
  {
    indicator: 'undisbursedNodeOperatorFee',
    textSize: 'lg',
  },
  {
    indicator: 'unsettledLidoFees',
    textSize: 'lg',
  },
];

export const Fees = () => {
  const { getVaultDataToRender } = useVaultOverview();
  const [noFeeData, lidoFeeData] = useMemo(
    () =>
      sectionPayloadList.map((sectionItem) =>
        getVaultDataToRender(sectionItem),
      ),
    [getVaultDataToRender],
  );

  return (
    <OverviewSection>
      <OverviewItem {...noFeeData} />
      <OverviewItem {...lidoFeeData} />
    </OverviewSection>
  );
};
