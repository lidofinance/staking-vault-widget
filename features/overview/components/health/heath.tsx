import { OverviewItem, OverviewSection } from 'features/overview/shared';
import { SectionPayload, useVaultOverview } from 'features/overview/contexts';

const sectionPayloadList: SectionPayload[] = [
  {
    title: 'Health factor',
    key: 'healthFactor',
  },
  {
    title: 'Total value',
    key: 'totalValue',
  },
  {
    title: 'stETH liability',
    key: 'mintedEth',
  },
  {
    title: 'Forced rebalance threshold',
    key: 'rebalanceThreshold',
  },
];

export const Health = () => {
  const { getVaultDataToRender } = useVaultOverview();
  const renderData = getVaultDataToRender(sectionPayloadList);

  return (
    <OverviewSection title="Vault health" titleTooltip="Lorem Ipsum">
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
