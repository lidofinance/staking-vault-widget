import { OverviewItem, OverviewSection } from 'features/overview/shared';
import { SectionPayload, useVaultOverview } from 'features/overview/contexts';
import { getUtilizationRatioColor } from 'utils';

const sectionPayloadList: SectionPayload[] = [
  {
    title: 'Utilization ratio',
    key: 'utilizationRatio',
  },
  {
    title: 'stETH liability',
    key: 'liabilityStETH',
  },
  {
    title: 'Total minting capacity',
    key: 'totalMintingCapacity',
  },
];

export const Capacity = () => {
  const { getVaultDataToRender } = useVaultOverview();
  const renderData = getVaultDataToRender(sectionPayloadList);

  return (
    <OverviewSection title="stETH capacity utilization">
      {renderData.map((item) => {
        const isUtilizationRatio = item.key === 'utilizationRatio';
        const color = isUtilizationRatio
          ? getUtilizationRatioColor(item.payload)
          : undefined;

        return (
          <OverviewItem
            key={item.title}
            title={item.title}
            content={item.payload}
            isLoading={item.isLoading}
            color={color}
          />
        );
      })}
    </OverviewSection>
  );
};
