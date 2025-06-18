import { OverviewItem, OverviewSection } from 'features/overview/shared';
import { SectionData, useVaultOverview } from 'features/overview/contexts';

const sectionPayloadList: SectionData[] = [
  {
    key: 'nodeOperatorFee',
  },
];

export const NodeOperator = () => {
  const { getVaultDataToRender } = useVaultOverview();

  return (
    <OverviewSection title="Node operator reward share">
      {sectionPayloadList.map((sectionItem) => {
        const { key, ...item } = getVaultDataToRender(sectionItem);
        return <OverviewItem key={key} {...item} />;
      })}
    </OverviewSection>
  );
};
