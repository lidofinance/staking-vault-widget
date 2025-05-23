import { OverviewItem, OverviewSection } from 'features/overview/shared';
import { SectionPayload, useVaultOverview } from 'features/overview/contexts';
import { getUtilizationRatioColor } from 'utils';

const sectionPayloadList: SectionPayload[] = [
  {
    key: 'utilizationRatio',
  },
  {
    key: 'liabilityStETH',
  },
  {
    key: 'totalMintingCapacityStETH',
  },
];

export const Capacity = () => {
  const { getVaultDataToRender } = useVaultOverview();

  return (
    <OverviewSection title="stETH capacity utilization">
      {sectionPayloadList.map((sectionItem) => {
        const { key, ...item } = getVaultDataToRender(sectionItem);
        const isUtilizationRatio = key === 'utilizationRatio';
        const color = isUtilizationRatio
          ? getUtilizationRatioColor(String(item.payload))
          : undefined;

        return <OverviewItem {...item} key={key} color={color} />;
      })}
    </OverviewSection>
  );
};
