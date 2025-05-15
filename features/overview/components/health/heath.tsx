import { OverviewItem, OverviewSection } from 'features/overview/shared';
import { SectionPayload, useVaultOverview } from 'features/overview/contexts';
import { formatPercent, getHealthFactorColor } from 'utils';

const sectionPayloadList: SectionPayload[] = [
  {
    title: 'Health factor',
    key: 'healthFactorNumber',
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
        const isHealthy = item.key === 'healthFactorNumber';
        const color = isHealthy
          ? getHealthFactorColor(item.payload)
          : undefined;
        const value = isHealthy
          ? formatPercent.format(Number(item.payload) / 100)
          : item.payload;

        return (
          <OverviewItem
            key={item.title}
            title={item.title}
            content={value}
            isLoading={item.isLoading}
            color={color}
          />
        );
      })}
    </OverviewSection>
  );
};
