import { OverviewItem, OverviewSection } from 'features/overview/shared';
import { SectionPayload, useVaultOverview } from 'features/overview/contexts';

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

const getUtilizationRatioColor = (utilizationRatio: string) => {
  if (!utilizationRatio) return '';
  const utilizationRatioNumber = Number(utilizationRatio.split('%')[0]);

  if (utilizationRatioNumber < 90) return '#53BA95';
  if (utilizationRatioNumber < 100) return '#ffbf00';
  if (utilizationRatioNumber === 100) return '#E14D4D';
  if (utilizationRatioNumber > 100) return 'darkRed';
};

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
