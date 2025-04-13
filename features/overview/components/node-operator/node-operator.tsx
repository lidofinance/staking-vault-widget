import { OverviewItem, OverviewSection } from 'features/overview/shared';
import { SectionPayload, useVaultOverview } from 'features/overview/contexts';

const sectionPayloadList: SectionPayload[] = [
  {
    title: 'Reward share',
    key: 'nodeOperatorFee',
  },
  {
    title: 'Accumulated',
    key: 'accumulatedFee',
  },
];

export const NodeOperator = () => {
  const { getVaultDataToRender } = useVaultOverview();
  const renderData = getVaultDataToRender(sectionPayloadList);

  return (
    <OverviewSection title="Node operator reward share">
      {renderData.map((item) => (
        <OverviewItem
          key={item.title}
          title={item.title}
          content={item.payload}
        />
      ))}
    </OverviewSection>
  );
};
