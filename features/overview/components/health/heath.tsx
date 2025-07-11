import { useMemo } from 'react';

import { formatPercent, getHealthFactorColor } from 'utils';

import { OverviewItem, OverviewSection } from 'features/overview/shared';
import { SectionData, useVaultOverview } from 'features/overview/contexts';

import { CarrySpread } from './carry-spread';
import {
  RemainingMintingCapacity,
  RemainingMintingCapacityChart,
} from './remaining-minting-capacity';

const sectionPayloadList: SectionData[] = [
  {
    indicator: 'healthFactorNumber',
  },
  {
    indicator: 'liabilityStETH',
  },
];

export const Health = () => {
  const { getVaultDataToRender } = useVaultOverview();

  const [healthFactorData, liabilityStETHData] = useMemo(
    () =>
      sectionPayloadList.map((sectionEntry) => {
        const { indicator, payload, ...item } =
          getVaultDataToRender(sectionEntry);
        const isHealthFactor = indicator === 'healthFactorNumber';
        const color = isHealthFactor
          ? getHealthFactorColor(payload as string | number)
          : undefined;

        const formattedPayload = isHealthFactor
          ? formatPercent.format(Number(payload) / 100)
          : payload;

        return { payload: formattedPayload, indicator, color, ...item };
      }),
    [getVaultDataToRender],
  );

  return (
    <OverviewSection>
      <OverviewItem {...healthFactorData}>
        <CarrySpread />
      </OverviewItem>
      <OverviewItem {...liabilityStETHData}>
        <RemainingMintingCapacityChart />
        <RemainingMintingCapacity />
      </OverviewItem>
    </OverviewSection>
  );
};
