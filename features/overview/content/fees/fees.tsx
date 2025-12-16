import { useMemo } from 'react';

import {
  OverviewItem,
  OverviewSection,
  type SectionData,
} from 'features/overview/inner';

import { useVaultOverview } from 'features/overview/vault-overview';

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
      <OverviewItem symbol="ETH" {...noFeeData} />
      <OverviewItem symbol="ETH" {...lidoFeeData} />
    </OverviewSection>
  );
};
