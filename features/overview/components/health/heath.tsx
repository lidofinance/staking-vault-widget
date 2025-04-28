import { OverviewItem, OverviewSection } from 'features/overview/shared';
import { SectionPayload, useVaultOverview } from 'features/overview/contexts';
import { getHealthFactorColor } from 'utils';

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
    key: 'liabilityStETH',
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
      {renderData.map((item) => {
        const isHealthy = item.key === 'healthFactor';
        const color = isHealthy
          ? getHealthFactorColor(item.payload)
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
